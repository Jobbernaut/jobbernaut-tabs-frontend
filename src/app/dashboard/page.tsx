"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard, { Job } from "@/components/job-card";
import JobForm from "@/components/job-form";
import Navbar from "@/components/navbar";
import { useSession } from "next-auth/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function Dashboard() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [search, setSearch] = useState("");

  const getHeaders = () => {
    const token = (session as any)?.idToken;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchCollection = async () => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error("Failed downloading system tracking layout:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchCollection();
    }
  }, [session]);

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.employer?.toLowerCase().includes(q) ||
        j.title?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.applicationStatus?.toLowerCase().includes(q),
    );
  }, [jobs, search]);

  const handleAdd = () => {
    setEditingJob(undefined);
    setFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleDelete = async (job: Job) => {
    try {
      const res = await fetch(`${API_BASE}/job/${job.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.status === 204) {
        setJobs((prev) => prev.filter((j) => j.id !== job.id));
      }
    } catch (err) {
      console.error("Deletion operation error:", err);
    }
  };

  const handleArchive = async (job: Job) => {
    try {
      const updatedJob = { ...job, applicationStatus: "Archived" as const };
      const res = await fetch(`${API_BASE}/job/${job.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updatedJob),
      });
      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
      }
    } catch (err) {
      console.error("Archive status sync operation failed:", err);
    }
  };

  const handleFormSubmit = async (payload: any) => {
    const isEdit = !!payload.id;
    const url = isEdit ? `${API_BASE}/job/${payload.id}` : `${API_BASE}/job`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Backend write pipeline failure occurred.");

    // Refresh to guarantee server-rendered sequence order
    await fetchCollection();
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
                {loading
                  ? "Synchronizing..."
                  : `${filteredJobs.length} ${search ? "results" : "jobs tracked"}`}
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
              onClick={handleAdd}
              disabled={loading}
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

          {/* Cards Stack */}
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-2 text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span>Fetching from database...</span>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-zinc-500 text-sm font-semibold uppercase tracking-widest border-b border-zinc-800 pb-2">
                Pipeline Track Entries (Reverse Chronological)
              </h2>
              <div className="flex flex-wrap gap-4">
                {filteredJobs.map((job) => (
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
