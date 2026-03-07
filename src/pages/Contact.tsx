import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact Us</h1>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">Get in touch with our team. We're here to help you start your university journey.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Phone, label: 'Phone', value: '+44 20 XXXX XXXX' },
                  { icon: Mail, label: 'Email', value: 'info@eduforyou.co.uk' },
                  { icon: MapPin, label: 'Address', value: 'London, United Kingdom' },
                  { icon: Clock, label: 'Hours', value: 'Mon-Fri 9:00-18:00' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-card rounded-xl p-5 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{item.label}</div>
                      <div className="text-muted-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/44XXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-success hover:bg-success/90 text-primary-foreground font-semibold gap-2 w-full">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </Button>
              </a>
            </div>

            {/* Form */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
              <h3 className="font-display font-bold text-xl text-card-foreground mb-6">Send us a message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input type="email" placeholder="Email *" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <select className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select Subject</option>
                  <option>Course Information</option>
                  <option>Eligibility Question</option>
                  <option>Student Finance</option>
                  <option>Application Status</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
                <textarea placeholder="Your Message *" rows={5} className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-orange-dark text-primary-foreground font-semibold">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
