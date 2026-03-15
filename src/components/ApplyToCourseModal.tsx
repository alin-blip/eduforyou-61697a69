import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GraduationCap, X } from "lucide-react";

interface ApplyToCourseModalProps {
  courseSlug: string;
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyToCourseModal({ courseSlug, courseName, isOpen, onClose }: ApplyToCourseModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [campusSlug, setCampusSlug] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campusSlug) {
      toast({ title: "Missing Campus", description: "Please select a campus.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("quiz_results").insert({
        email: user?.email || "",
        name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        course_slug: courseSlug,
        campus_slug: campusSlug,
        eligible: true,
        eligibility_type: "DIRECT_APPLICATION",
      });
      if (error) throw error;
      toast({ title: "Application Submitted!", description: `Your application for ${courseName} has been submitted. Check your dashboard for updates.` });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#d4a84320" }}>
              <GraduationCap className="w-5 h-5" style={{ color: "#d4a843" }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "#0a1628" }}>Apply Now</h3>
              <p className="text-xs text-gray-500">{courseName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Campus (optional)</Label>
            <select
              className="w-full mt-1 rounded-md border border-gray-200 p-2 text-sm"
              value={campusSlug || ""}
              onChange={(e) => setCampusSlug(e.target.value || undefined)}
            >
              <option value="">Select a campus...</option>
              <option value="london">London Campus</option>
              <option value="birmingham">Birmingham Campus</option>
              <option value="manchester">Manchester Campus</option>
              <option value="leeds">Leeds Campus</option>
              <option value="east-london">East London Campus</option>
              <option value="greenford">Greenford Campus</option>
            </select>
          </div>

          <div>
            <Label className="text-sm text-gray-600">Preferred Start Date (optional)</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="p-3 rounded-lg bg-blue-50 text-xs text-blue-700">
            By applying, you agree to the terms and conditions. Your application will be reviewed by our admissions team.
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
              style={{ background: "#d4a843", color: "#0a1628" }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
