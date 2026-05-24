"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard, { Job } from "@/components/job-card";
import JobForm from "@/components/job-form";
import Navbar from "@/components/navbar";
import jobsData from "@/data/jobs.json";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDateHeader(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const monthName = date.toLocaleDateString("en-US", { month: "long" });
  return `${monthName} ${ordinal(day)}`;
}

function groupByDate(jobs: Job[]): Record<string, Job[]> {
  return jobs.reduce(
    (acc, job) => {
      if (!acc[job.dateApplied]) acc[job.dateApplied] = [];
      acc[job.dateApplied].push(job);
      return acc;
    },
    {} as Record<string, Job[]>,
  );
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>(jobsData as Job[]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.company.toLowerCase().includes(q) ||
        j.jobTitle.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.status.toLowerCase().includes(q),
    );
  }, [jobs, search]);

  const grouped = groupByDate(filteredJobs);

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const handleAdd = () => {
    setEditingJob(undefined);
    setFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleDelete = (job: Job) => {
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleArchive = (job: Job) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "Archived" } : j)),
    );
  };

  const handleFormSubmit = (job: Job) => {
    setJobs((prev) => {
      const exists = prev.find((j) => j.id === job.id);
      if (exists) return prev.map((j) => (j.id === job.id ? job : j));
      return [job, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight">
                Your Applications
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                {filteredJobs.length} {search ? "results" : "jobs tracked"}
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4" /> Add Job
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-9"
              placeholder="Search by company, role, location, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Cards */}
          {filteredJobs.length > 0 ? (
            sortedDates.map((date) => (
              <div key={date} className="flex flex-col gap-4">
                <h2 className="text-zinc-500 text-sm font-semibold uppercase tracking-widest">
                  {formatDateHeader(date)}
                </h2>
                <div className="flex flex-wrap gap-4">
                  {grouped[date].map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onArchive={handleArchive}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-zinc-600 text-sm">
                {search
                  ? `No jobs matching "${search}"`
                  : "No jobs tracked yet. Add one above."}
              </p>
            </div>
          )}
        </div>
      </div>

      <JobForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        job={editingJob}
      />
    </div>
  );
}
