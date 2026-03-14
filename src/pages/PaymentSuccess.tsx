import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => (
  <Layout>
    <section className="py-20 bg-background min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
          <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        <Link to="/">
          <Button size="lg" className="font-semibold">Back to Home</Button>
        </Link>
      </div>
    </section>
  </Layout>
);

export default PaymentSuccess;
