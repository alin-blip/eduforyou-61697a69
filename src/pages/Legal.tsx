import Layout from '@/components/layout/Layout';

const LegalPage = ({ type }: { type: 'cookies' | 'privacy' | 'terms' }) => {
  const titles: Record<string, string> = { cookies: 'Cookie Policy', privacy: 'Privacy Policy', terms: 'Terms of Service' };

  const content: Record<string, string[]> = {
    cookies: [
      'This Cookie Policy explains how EduForYou uses cookies and similar technologies.',
      '## What Are Cookies?\nCookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.',
      '## Types of Cookies We Use\n- Essential cookies: Required for the website to function\n- Analytics cookies: Help us understand how visitors use the site\n- Marketing cookies: Used to deliver relevant advertisements',
      '## Managing Cookies\nYou can control cookies through your browser settings. Note that disabling some cookies may affect website functionality.',
      '## Contact\nFor questions about our cookie policy, contact us at info@eduforyou.co.uk.',
    ],
    privacy: [
      'EduForYou is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal data.',
      '## Data We Collect\n- Contact information (name, email, phone)\n- Eligibility information (residency, date of birth)\n- Course preferences\n- Website usage data',
      '## How We Use Your Data\n- To assess your eligibility for university education\n- To recommend suitable courses\n- To guide you through the application process\n- To improve our services',
      '## Data Protection\nWe follow GDPR guidelines and never sell your data to third parties. Your information is stored securely and only accessed by authorised staff.',
      '## Your Rights\nYou have the right to access, correct, or delete your personal data. Contact us at info@eduforyou.co.uk.',
    ],
    terms: [
      'By using EduForYou\'s services, you agree to these Terms of Service.',
      '## Our Service\nEduForYou provides free university consultancy services. We help eligible individuals access UK university education through Student Finance.',
      '## Free Service\nOur service is free for students. We are compensated by partner universities upon successful student enrolment.',
      '## Eligibility\nWe provide guidance on eligibility but cannot guarantee outcomes. Final decisions on university admission and Student Finance are made by the respective institutions.',
      '## Limitation of Liability\nEduForYou provides information and guidance to the best of our ability but cannot be held liable for decisions made by universities or Student Finance England.',
      '## Contact\nFor questions about these terms, contact us at info@eduforyou.co.uk.',
    ],
  };

  return (
    <Layout>
      <section className="py-20 bg-navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">{titles[type]}</h1>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {content[type].map((block, i) => {
            const parts = block.split('\n');
            return (
              <div key={i} className="mb-6">
                {parts.map((line, j) => {
                  if (line.startsWith('## ')) return <h2 key={j} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('- ')) return <li key={j} className="flex items-start gap-2 text-muted-foreground ml-4"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />{line.replace('- ', '')}</li>;
                  return <p key={j} className="text-muted-foreground leading-relaxed">{line}</p>;
                })}
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;
