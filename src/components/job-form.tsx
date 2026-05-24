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
  onSubmit: (job: Job) => void;
  job?: Job;
}

const statusOptions: JobStatus[] = [
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Archived",
];

const emptyForm = {
  jobTitle: "",
  company: "",
  location: "",
  jobPostingUrl: "",
  jobDescription: "",
  status: "Applied" as JobStatus,
  dateApplied: new Date().toISOString().split("T")[0],
  applicationMaterials: "",
  notes: "",
};

export default function JobForm({
  open,
  onOpenChange,
  onSubmit,
  job,
}: JobFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (job) {
      setForm({
        jobTitle: job.jobTitle,
        company: job.company,
        location: job.location,
        jobPostingUrl: job.jobPostingUrl,
        jobDescription: job.jobDescription ?? "",
        status: job.status,
        dateApplied: job.dateApplied,
        applicationMaterials: job.applicationMaterials ?? "",
        notes: job.notes ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [job, open]);

  const handleSubmit = () => {
    if (!form.company || !form.jobTitle || !form.jobPostingUrl) return;
    onSubmit({
      id: job?.id ?? crypto.randomUUID(),
      ...form,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-800 border-zinc-700 text-white max-w-lg overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="text-white">
            {job ? "Edit Job" : "Add Job"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Company *
            </Label>
            <Input
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. Anthropic"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Job Title *
            </Label>
            <Input
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. Senior Full Stack Engineer"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Location
            </Label>
            <Input
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. San Francisco, CA or Remote"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Job Posting URL *
            </Label>
            <Input
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="https://..."
              value={form.jobPostingUrl}
              onChange={(e) =>
                setForm({ ...form, jobPostingUrl: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(val) =>
                  setForm({ ...form, status: val as JobStatus })
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

            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                Date Applied
              </Label>
              <Input
                type="date"
                className="bg-zinc-700 border-zinc-600 text-white"
                value={form.dateApplied}
                onChange={(e) =>
                  setForm({ ...form, dateApplied: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Job Description
            </Label>
            <Textarea
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500 min-h-28"
              placeholder="Paste the job description here..."
              value={form.jobDescription}
              onChange={(e) =>
                setForm({ ...form, jobDescription: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Application Materials
            </Label>
            <Textarea
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="e.g. Resume, cover letter, portfolio"
              value={form.applicationMaterials}
              onChange={(e) =>
                setForm({ ...form, applicationMaterials: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Notes
            </Label>
            <Textarea
              className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500"
              placeholder="Interview notes, follow-ups, contacts..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleSubmit}
            >
              {job ? "Save Changes" : "Add Job"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
