import { motion } from 'framer-motion';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { userType, user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect to appropriate dashboard based on user type
    if (userType === 'admin') {
      navigate('/admin');
    } else if (userType === 'supplier') {
      navigate('/supplier-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Helmet>
        <title>Unauthorized Access | Sleek Apparels</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-6"
          >
            <ShieldX className="w-12 h-12 text-destructive" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4"
          >
            Access Denied
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8"
          >
            You don't have permission to access this page. This area is restricted to authorized users only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Button
              onClick={handleGoHome}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-muted/50 rounded-lg"
          >
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact support or check your account permissions.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
