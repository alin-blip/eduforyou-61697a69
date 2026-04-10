import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, PoundSterling, Trophy, Loader2, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AGENT_PRICE_ID = 'price_1TAvO7Bm1vxHnsGAIKsBV4N7';

const AgentsPage = () => {
  const { user, isSubscribed } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast({ title: 'Autentifică-te mai întâi', description: 'Ai nevoie de un cont pentru a te abona.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: AGENT_PRICE_ID, mode: 'subscription' },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err: any) {
      toast({ title: 'Eroare', description: err.message || 'Nu am putut porni procesul de plată', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err: any) {
      toast({ title: 'Eroare', description: err.message || 'Nu am putut deschide portalul clientului', variant: 'destructive' });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Devino agent educațional</h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Câștigă comisioane atractive recomandând studenți către programe universitare din Marea Britanie. Alătură-te rețelei noastre în continuă creștere de agenți educaționali.</p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: PoundSterling, title: 'Comisioane competitive', desc: 'Câștigă până la 500 £ pentru fiecare student recomandat cu succes' },
              { icon: Users, title: 'Suport de marketing', desc: 'Ai acces la materiale de brand, pagini de prezentare și instruire' },
              { icon: Trophy, title: 'Clasament și bonusuri', desc: 'Cei mai buni agenți primesc bonusuri suplimentare și beneficii VIP' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border text-center">
                <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-gold/5 rounded-2xl p-8 md:p-12 border border-primary/10 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              {isSubscribed ? 'Ești un agent activ!' : 'Ești gata să începi?'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {isSubscribed
                ? 'Gestionează-ți abonamentul sau accesează mai jos panoul agentului.'
                : 'Abonează-te cu 97 £/lună pentru a debloca CRM-ul, comisioanele, instruirea și suportul dedicat.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isSubscribed ? (
                <>
                  <Link to="/agent">
                    <Button size="lg" className="font-semibold gap-2">
                      Mergi la panou <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" onClick={handleManage} disabled={portalLoading} className="font-semibold gap-2">
                    {portalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Gestionează abonamentul</>}
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={handleSubscribe} disabled={loading}
                    className="bg-primary hover:bg-gold-dark text-primary-foreground font-semibold gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Abonează-te — 97 £/lună <ArrowRight className="w-5 h-5" /></>}
                  </Button>
                  {!user && (
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="font-semibold">Autentifică-te mai întâi</Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AgentsPage;
