import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Layout>
      <section className="py-20 bg-background min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-display font-bold text-2xl">E</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-muted-foreground mt-2">{isRegister ? 'Start your education journey' : 'Sign in to your account'}</p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {isRegister && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full pl-10 pr-12 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {!isRegister && (
                <div className="text-right">
                  <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsRegister(!isRegister)} className="text-primary hover:underline font-medium">
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
