"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/navbar";
import resumeData from "@/data/master-resume.json";

function formatDate(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-zinc-500 text-xs font-semibold uppercase tracking-widest border-b border-zinc-700 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function CollapsibleText({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-xs transition-colors w-fit"
      >
        {open ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        {label}
      </button>
      {open && (
        <p className="text-zinc-400 text-xs leading-relaxed pl-4 border-l border-zinc-700">
          {text}
        </p>
      )}
    </div>
  );
}

export default function ResumePage() {
  const [editOpen, setEditOpen] = useState(false);
  const [resumeJson, setResumeJson] = useState(
    JSON.stringify(resumeData, null, 2),
  );
  const [resume, setResume] = useState<any>(resumeData);
  const [jsonError, setJsonError] = useState("");

  const handleSave = () => {
    try {
      const parsed = JSON.parse(resumeJson);
      setResume(parsed);
      setJsonError("");
      setEditOpen(false);
    } catch (e) {
      setJsonError("Invalid JSON — check your syntax and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold tracking-tight">
                Master Resume
              </h1>
              <p className="text-zinc-500 text-sm mt-1">
                Your single source of truth for Jobbernaut Tailor
              </p>
            </div>
            <Button
              className="bg-zinc-700 hover:bg-zinc-600 text-white flex items-center gap-2"
              onClick={() => {
                setResumeJson(JSON.stringify(resume, null, 2));
                setEditOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" /> Edit JSON
            </Button>
          </div>

          {/* Contact Info */}
          <Section title="Contact Information">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6 flex flex-col gap-3">
                <div>
                  <h2 className="text-white text-2xl font-bold">
                    {resume.contact_info.first_name}{" "}
                    {resume.contact_info.last_name}
                  </h2>
                  <div className="flex items-center gap-1 text-zinc-400 text-sm mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />{" "}
                    {resume.contact_info.location}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${resume.contact_info.email}`}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> {resume.contact_info.email}
                  </a>
                  <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                    <Phone className="w-3.5 h-3.5" />{" "}
                    {resume.contact_info.phone}
                  </span>
                  <a
                    href={resume.contact_info.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a
                    href={resume.contact_info.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    <FaGithub className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <a
                    href={resume.contact_info.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    <FaGlobe className="w-3.5 h-3.5" /> Portfolio
                  </a>
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Education */}
          <Section title="Education">
            <div className="flex flex-wrap gap-4">
              {resume.education.map((edu: any, i: number) => (
                <Card
                  key={i}
                  className="bg-zinc-800 border-zinc-700 flex-1 min-w-64"
                >
                  <CardContent className="pt-6 flex flex-col gap-1">
                    <h3 className="text-white font-semibold text-sm">
                      {edu.institution}
                    </h3>
                    <p className="text-zinc-400 text-sm">{edu.degree}</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      {formatDate(edu.start_date)} —{" "}
                      {formatDate(edu.graduation_date)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          {/* Work Experience */}
          <Section title="Work Experience">
            <div className="flex flex-col gap-4">
              {resume.work_experience.map((job: any, i: number) => (
                <Card key={i} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="pt-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-white font-bold">
                          {job.job_title}
                        </h3>
                        <p className="text-zinc-400 text-sm">{job.company}</p>
                        <div className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </div>
                      </div>
                      <span className="text-zinc-500 text-xs whitespace-nowrap">
                        {formatDate(job.start_date)} —{" "}
                        {job.end_date === "Present"
                          ? "Present"
                          : formatDate(job.end_date)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(job.key_metrics)
                        .slice(0, 6)
                        .map(([key, val]: [string, any]) => (
                          <Badge
                            key={key}
                            className="bg-zinc-700 text-zinc-300 border-zinc-600 text-xs font-normal"
                          >
                            {key.replace(/_/g, " ")}: {String(val)}
                          </Badge>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <CollapsibleText
                        label="Technical Story"
                        text={job.narrative_context.technical_story}
                      />
                      <CollapsibleText
                        label="Impact Story"
                        text={job.narrative_context.impact_story}
                      />
                      <CollapsibleText
                        label="Leadership Story"
                        text={job.narrative_context.leadership_story}
                      />
                      <CollapsibleText
                        label="Challenges"
                        text={job.narrative_context.challenges_overcome}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          {/* Projects */}
          <Section title="Projects">
            <div className="flex flex-col gap-4">
              {resume.projects.map((project: any, i: number) => (
                <Card key={i} className="bg-zinc-800 border-zinc-700">
                  <CardContent className="pt-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-white font-bold">
                        {project.project_name}
                      </h3>
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech: string) => (
                        <Badge
                          key={tech}
                          className="bg-zinc-700 text-zinc-300 border-zinc-600 text-xs font-normal"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(project.key_metrics)
                        .slice(0, 5)
                        .map(([key, val]: [string, any]) => (
                          <Badge
                            key={key}
                            className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-normal"
                          >
                            {key.replace(/_/g, " ")}: {String(val)}
                          </Badge>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      <CollapsibleText
                        label="Technical Story"
                        text={project.narrative_context.technical_story}
                      />
                      <CollapsibleText
                        label="Impact Story"
                        text={project.narrative_context.impact_story}
                      />
                      <CollapsibleText
                        label="Challenges"
                        text={project.narrative_context.challenges_overcome}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6 flex flex-col gap-5">
                {Object.entries(resume.skills).map(
                  ([category, skills]: [string, any]) => (
                    <div key={category} className="flex flex-col gap-2">
                      <h3 className="text-zinc-400 text-xs font-semibold">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.split(", ").map((skill: string) => (
                          <Badge
                            key={skill}
                            className="bg-zinc-700 text-zinc-300 border-zinc-600 text-xs font-normal"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>

      {/* Edit JSON Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-800 border-zinc-700 text-white sm:max-w-6xl h-screen flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Master Resume</DialogTitle>
            <p className="text-zinc-500 text-xs">
              Edit the raw JSON directly. Hit Save when done.
            </p>
          </DialogHeader>

          <Textarea
            className="bg-zinc-900 border-zinc-700 text-zinc-300 text-xs font-mono flex-1 min-h-0 resize-none"
            value={resumeJson}
            onChange={(e) => setResumeJson(e.target.value)}
            spellCheck={false}
          />

          {jsonError && <p className="text-red-400 text-xs">{jsonError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
