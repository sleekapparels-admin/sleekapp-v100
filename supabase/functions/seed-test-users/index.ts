import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestUser {
  email: string
  password: string
  full_name: string
  company_name?: string
  phone?: string
  role: 'admin' | 'retailer' | 'wholesaler' | 'supplier'
  supplierData?: {
    factory_location: string
    specializations: string[]
    certifications: string[]
    moq: number
    lead_time_days: number
    verification_status: 'verified' | 'pending'
  }
}

const TEST_USERS: TestUser[] = [
  // Admin
  {
    email: 'admin@sleekapparels.com',
    password: 'Admin123!@#',
    full_name: 'Sarah Johnson',
    company_name: 'Sleek Apparels',
    phone: '+1-555-0100',
    role: 'admin'
  },
  
  // Buyers - Fashion Brands
  {
    email: 'buyer.fashion@example.com',
    password: 'Buyer123!@#',
    full_name: 'Emma Wilson',
    company_name: 'Urban Threads Fashion',
    phone: '+1-555-0201',
    role: 'retailer'
  },
  {
    email: 'buyer.wholesale@example.com',
    password: 'Buyer123!@#',
    full_name: 'Michael Chen',
    company_name: 'Bulk Apparel Distributors',
    phone: '+1-555-0202',
    role: 'wholesaler'
  },
  
  // Buyers - Educational/Corporate
  {
    email: 'buyer.school@example.com',
    password: 'Buyer123!@#',
    full_name: 'David Martinez',
    company_name: 'Springfield School District',
    phone: '+1-555-0203',
    role: 'retailer'
  },
  
  // Suppliers
  {
    email: 'supplier.knitwear@example.com',
    password: 'Supplier123!@#',
    full_name: 'Rajesh Kumar',
    company_name: 'Bengal Knitwear Solutions',
    phone: '+880-1712-345678',
    role: 'supplier',
    supplierData: {
      factory_location: 'Dhaka, Bangladesh',
      specializations: ['Sweaters', 'Cardigans', 'Knitwear'],
      certifications: ['WRAP', 'BSCI', 'ISO 9001'],
      moq: 500,
      lead_time_days: 45,
      verification_status: 'verified'
    }
  },
  {
    email: 'supplier.cutandsew@example.com',
    password: 'Supplier123!@#',
    full_name: 'Li Wei',
    company_name: 'Precision Garments Ltd',
    phone: '+86-138-0013-8000',
    role: 'supplier',
    supplierData: {
      factory_location: 'Guangzhou, China',
      specializations: ['T-shirts', 'Polo Shirts', 'Cut & Sew'],
      certifications: ['WRAP', 'Oeko-Tex', 'ISO 9001'],
      moq: 300,
      lead_time_days: 35,
      verification_status: 'verified'
    }
  }
]

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const results = []

    for (const testUser of TEST_USERS) {
      console.log(`Creating user: ${testUser.email}`)
      
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUser?.users.find(u => u.email === testUser.email)
      
      let userId: string
      
      if (userExists) {
        console.log(`User ${testUser.email} already exists, using existing ID`)
        userId = userExists.id
        results.push({ email: testUser.email, status: 'already_exists', userId })
      } else {
        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
          user_metadata: {
            full_name: testUser.full_name,
            company_name: testUser.company_name,
            phone: testUser.phone
          }
        })

        if (authError) {
          console.error(`Error creating user ${testUser.email}:`, authError)
          results.push({ email: testUser.email, status: 'error', error: authError.message })
          continue
        }

        userId = authData.user.id
        console.log(`Created auth user: ${userId}`)
        
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        results.push({ email: testUser.email, status: 'created', userId })
      }

      // Assign role using the secure function
      if (testUser.role === 'admin') {
        const { error: roleError } = await supabaseAdmin.rpc('assign_admin_role', {
          target_user_id: userId
        })
        if (roleError) {
          console.error(`Error assigning admin role:`, roleError)
        } else {
          console.log(`Assigned admin role to ${testUser.email}`)
        }
      } else {
        // For non-admin roles, insert directly (or use assign_user_role function)
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert({ user_id: userId, role: testUser.role }, { onConflict: 'user_id,role' })
        
        if (roleError) {
          console.error(`Error assigning role:`, roleError)
        } else {
          console.log(`Assigned ${testUser.role} role to ${testUser.email}`)
        }
      }

      // Create supplier profile if supplier role
      if (testUser.role === 'supplier' && testUser.supplierData) {
        const { error: supplierError } = await supabaseAdmin
          .from('suppliers')
          .upsert({
            user_id: userId,
            company_name: testUser.company_name!,
            factory_location: testUser.supplierData.factory_location,
            specializations: testUser.supplierData.specializations,
            certifications: testUser.supplierData.certifications,
            moq: testUser.supplierData.moq,
            lead_time_days: testUser.supplierData.lead_time_days,
            verification_status: testUser.supplierData.verification_status,
            performance_score: 85,
            total_orders_completed: 0,
            on_time_delivery_rate: 95
          }, { onConflict: 'user_id' })

        if (supplierError) {
          console.error(`Error creating supplier profile:`, supplierError)
        } else {
          console.log(`Created supplier profile for ${testUser.email}`)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test users seeded successfully',
        results,
        credentials: TEST_USERS.map(u => ({ 
          email: u.email, 
          password: u.password,
          role: u.role 
        }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Seed error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
