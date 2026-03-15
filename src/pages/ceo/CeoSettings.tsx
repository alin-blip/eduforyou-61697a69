import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Shield, Globe, Palette, Mail, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SettingGroup {
  title: string;
  icon: any;
  settings: { key: string; label: string; description: string; type: 'toggle' | 'text'; defaultValue: boolean | string }[];
}

const settingsGroups: SettingGroup[] = [
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { key: 'email_alerts', label: 'Email Alerts', description: 'Receive critical alerts via email', type: 'toggle', defaultValue: true },
      { key: 'daily_digest', label: 'Daily Digest', description: 'Receive a daily summary report', type: 'toggle', defaultValue: true },
      { key: 'agent_notifications', label: 'Agent Activity Alerts', description: 'Notify on agent actions', type: 'toggle', defaultValue: false },
      { key: 'revenue_milestones', label: 'Revenue Milestones', description: 'Alert when revenue targets are hit', type: 'toggle', defaultValue: true },
    ],
  },
  {
    title: 'AI & Automation',
    icon: Zap,
    settings: [
      { key: 'ai_auto_reports', label: 'Auto AI Reports', description: 'Generate morning reports automatically', type: 'toggle', defaultValue: false },
      { key: 'ai_content_review', label: 'AI Content Pre-Review', description: 'AI scores content before CMO review', type: 'toggle', defaultValue: true },
      { key: 'auto_workflows', label: 'Auto Workflow Triggers', description: 'Automatically trigger workflows on events', type: 'toggle', defaultValue: false },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    settings: [
      { key: '2fa_enabled', label: 'Two-Factor Authentication', description: 'Require 2FA for CEO dashboard access', type: 'toggle', defaultValue: true },
      { key: 'session_timeout', label: 'Session Timeout (minutes)', description: 'Auto-logout after inactivity', type: 'text', defaultValue: '60' },
      { key: 'ip_whitelist', label: 'IP Whitelist', description: 'Restrict access to specific IPs (comma-separated)', type: 'text', defaultValue: '' },
    ],
  },
  {
    title: 'Branding',
    icon: Palette,
    settings: [
      { key: 'company_name', label: 'Company Name', description: 'Displayed in dashboard header', type: 'text', defaultValue: 'EduForYou' },
      { key: 'dark_mode', label: 'Dark Mode', description: 'Use dark theme for dashboard', type: 'toggle', defaultValue: false },
    ],
  },
  {
    title: 'Integrations',
    icon: Globe,
    settings: [
      { key: 'slack_notifications', label: 'Slack Integration', description: 'Push alerts to Slack channel', type: 'toggle', defaultValue: false },
      { key: 'google_analytics', label: 'Google Analytics', description: 'Track dashboard usage', type: 'toggle', defaultValue: true },
    ],
  },
  {
    title: 'Email',
    icon: Mail,
    settings: [
      { key: 'sender_name', label: 'Default Sender Name', description: 'Name for outgoing emails', type: 'text', defaultValue: 'EduForYou Team' },
      { key: 'reply_to', label: 'Reply-To Email', description: 'Default reply-to address', type: 'text', defaultValue: '' },
    ],
  },
];

const CeoSettings = () => {
  const [values, setValues] = useState<Record<string, boolean | string>>(() => {
    const initial: Record<string, boolean | string> = {};
    settingsGroups.forEach((g) => g.settings.forEach((s) => { initial[s.key] = s.defaultValue; }));
    return initial;
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#d4a843]" /> Platform Settings
        </h1>
        <Button onClick={saveSettings} className="bg-[#d4a843] hover:bg-[#b8912e] text-[#0a1628] font-semibold">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsGroups.map((group) => (
          <Card key={group.title} className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0a1628] flex items-center gap-2">
                <group.icon className="w-5 h-5 text-[#d4a843]" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-[#0a1628]">{setting.label}</Label>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                  {setting.type === 'toggle' ? (
                    <Switch
                      checked={values[setting.key] as boolean}
                      onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                    />
                  ) : (
                    <Input
                      value={values[setting.key] as string}
                      onChange={(e) => updateSetting(setting.key, e.target.value)}
                      className="w-40"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CeoSettings;
