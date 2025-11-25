import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDatabase, SAMPLE_USERS } from '@/lib/firebase/seedData';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FirebaseSeed() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setError(null);
    
    try {
      await seedDatabase();
      setSeedingComplete(true);
      toast.success('Database seeded successfully! You can now login with the test accounts.');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to seed database: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Firebase Database Seeding</CardTitle>
              <CardDescription>
                Populate your Firebase database with sample data for testing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!seedingComplete && !error && (
            <>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  What will be created:
                </h3>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• 3 test users (Buyer, Supplier, Admin)</li>
                  <li>• 1 verified supplier profile</li>
                  <li>• 7 marketplace products (ready stock items)</li>
                  <li>• User roles and permissions</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ⚠️ Important:
                </h3>
                <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>• Make sure you've deployed Firestore security rules first</li>
                  <li>• This will create real users in Firebase Authentication</li>
                  <li>• Email verification is automatic in Firebase</li>
                </ul>
              </div>

              <Button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Seed Database Now
                  </>
                )}
              </Button>
            </>
          )}

          {seedingComplete && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold text-lg">Seeding Complete!</h3>
                  <p className="text-sm text-muted-foreground">
                    You can now login with the test accounts below
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold mb-2">Test Account Credentials:</h3>
                
                {Object.entries(SAMPLE_USERS).map(([key, user]) => (
                  <div key={key} className="border-l-4 border-primary pl-3 py-1">
                    <div className="font-medium capitalize">{key}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {user.email}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      Password: {user.password}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => window.location.href = '/auth'}
                className="w-full"
                size="lg"
              >
                Go to Login Page
              </Button>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold text-lg">Seeding Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setError(null);
                  setSeedingComplete(false);
                }}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
