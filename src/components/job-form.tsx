"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job, JobStatus } from "@/components/job-card";

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: any) => Promise<void>;
  job?: Job;
}

const statusOptions: JobStatus[] = [
  "Saved",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Archived",
];

const emptyForm = {
  title: "",
  employer: "",
  location: "",
  postingLink: "",
  description: "",
  applicationStatus: "Applied" as JobStatus,
  notes: "",
};

export default function JobForm({
  open,
  onOpenChange,
  onSubmit,
  job,
}: JobFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        employer: job.employer || "",
        location: job.location || "",
        postingLink: job.postingLink || "",
        description: job.description || "",
        applicationStatus: job.applicationStatus || "Applied",
        notes: job.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [job, open]);

  const handleSubmit = async () => {
    if (!form.employer || !form.title) return;

    setLoading(true);
    try {
      const structuralPayload = job ? { ...job, ...form } : { ...form };

      await onSubmit(structuralPayload);
      onOpenChange(false);
    } catch (err) {
      console.error("Mutation failure inside form submission wrapper:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-800 border-zinc-700 text-white sm:max-w-3xl overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {job ? "Edit Job" : "Add Job"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Company / Employer *
            </Label>
            <Input
              disabled={loading}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. Google"
              value={form.employer}
              onChange={(e) => setForm({ ...form, employer: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Job Title *
            </Label>
            <Input
              disabled={loading}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. Senior Site Reliability Engineer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Location
            </Label>
            <Input
              disabled={loading}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. Mountain View, CA or Remote"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Job Posting URL
            </Label>
            <Input
              disabled={loading}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="https://..."
              value={form.postingLink}
              onChange={(e) =>
                setForm({ ...form, postingLink: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Application Status
            </Label>
            <Select
              disabled={loading}
              value={form.applicationStatus}
              onValueChange={(val) =>
                setForm({ ...form, applicationStatus: val as JobStatus })
              }
            >
              <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                {statusOptions.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Job Description
            </Label>
            <Textarea
              disabled={loading}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500 min-h-28"
              placeholder="Paste the job description here..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Notes
            </Label>
            <Textarea
              disabled={loading}
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="Interview notes, internal tracking context..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              disabled={loading}
              className="text-zinc-400 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : job ? "Save Changes" : "Add Job"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
