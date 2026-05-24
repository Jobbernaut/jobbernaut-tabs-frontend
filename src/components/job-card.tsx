"use client";

import { useState } from "react";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Trash2,
  Archive,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type JobStatus =
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected"
  | "Archived";

export interface Job {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  jobPostingUrl: string;
  jobDescription?: string;
  status: JobStatus;
  dateApplied: string;
  applicationMaterials?: string;
  notes?: string;
}

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onArchive?: (job: Job) => void;
}

const statusStyles: Record<JobStatus, string> = {
  Applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Interviewing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Offer: "bg-green-500/20 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  Archived: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export default function JobCard({
  job,
  onEdit,
  onDelete,
  onArchive,
}: JobCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="bg-zinc-800 border-zinc-700 w-72">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-white font-bold text-xl leading-tight">
              {job.company}
            </h2>
            <p className="text-zinc-400 text-sm">{job.jobTitle}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-500 text-xs">{job.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              onClick={() => window.open(job.jobPostingUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-800 border-zinc-700 text-zinc-300"
              >
                <DropdownMenuItem
                  className="cursor-pointer hover:text-white"
                  onClick={() => onEdit?.(job)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:text-white"
                  onClick={() => onArchive?.(job)}
                >
                  <Archive className="w-3.5 h-3.5 mr-2" /> Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 hover:text-red-300"
                  onClick={() => onDelete?.(job)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardFooter className="flex items-center justify-between pt-0">
          <Badge className={`text-xs font-medium ${statusStyles[job.status]}`}>
            {job.status}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="text-zinc-400 hover:text-white text-xs h-7 px-2"
            onClick={() => setDialogOpen(true)}
          >
            View
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-800 border-zinc-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {job.company}
            </DialogTitle>
            <p className="text-zinc-400 text-sm">{job.jobTitle}</p>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-500 text-xs">{job.location}</span>
            </div>
          </DialogHeader>

          <div className="flex items-center justify-between">
            <Badge
              className={`text-xs font-medium ${statusStyles[job.status]}`}
            >
              {job.status}
            </Badge>
            <span className="text-zinc-500 text-xs">
              Applied {new Date(job.dateApplied).toLocaleDateString()}
            </span>
          </div>

          <div className="h-px bg-zinc-700" />

          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Job Posting
              </h3>
              <a
                href={job.jobPostingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:underline break-all"
              >
                {job.jobPostingUrl}
              </a>
            </div>

            {job.jobDescription && (
              <div>
                <h3 className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Job Description
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {job.jobDescription}
                </p>
              </div>
            )}

            {job.applicationMaterials && (
              <div>
                <h3 className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Application Materials
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {job.applicationMaterials}
                </p>
              </div>
            )}

            {job.notes && (
              <div>
                <h3 className="text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Notes
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {job.notes}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
