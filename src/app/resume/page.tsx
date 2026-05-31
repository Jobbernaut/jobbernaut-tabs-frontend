"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pencil,
  Loader2,
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
import { useSession } from "next-auth/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "Present") return "Present";
  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;
  const [year, month] = parts;
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
  if (!text) return null;
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
        <p className="text-zinc-400 text-xs leading-relaxed pl-4 border-l border-zinc-700 whitespace-pre-wrap">
          {text}
        </p>
      )}
    </div>
  );
}

const defaultResumeStructure = {
  contact_info: {
    first_name: "Ash",
    last_name: "Manda",
    location: "Hyderabad, IN",
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  },
  education: [],
  work_experience: [],
  projects: [],
  skills: {},
};

export default function ResumePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [profileMetadata, setProfileMetadata] = useState<any>(null);
  const [resumeContent, setResumeContent] = useState<any>(null);

  const [resumeJsonTextarea, setResumeJsonTextarea] = useState("");
  const [jsonError, setJsonError] = useState("");

  const getHeaders = () => {
    const token = (session as any)?.idToken;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Safe seed: if profile exists but resume is null, we execute a PUT block
  const seedEmptyResumeOnBackend = async (
    currentProfile: any,
    method: "POST" | "PUT",
  ) => {
    try {
      const payload = {
        name: currentProfile?.name || session?.user?.name || "Ash Manda",
        email:
          currentProfile?.email ||
          session?.user?.email ||
          "srmanda.cs@gmail.com",
        masterResume: defaultResumeStructure, // Jackson maps this node dynamically
      };

      const res = await fetch(`${API_BASE}/profile`, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfileMetadata(updatedProfile);
        setResumeContent(updatedProfile.masterResume || defaultResumeStructure);
      }
    } catch (err) {
      console.error("Auto-initialization pass failed:", err);
    }
  };

  const loadProfile = async () => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (res.status === 200) {
        const profile = await res.json();
        setProfileMetadata(profile);

        if (profile.masterResume) {
          setResumeContent(profile.masterResume);
        } else {
          // Profile exists but masterResume is null -> update via PUT
          await seedEmptyResumeOnBackend(profile, "PUT");
        }
      } else if (res.status === 404) {
        // Complete structural baseline fallback -> build initial onboarding record via POST
        const fallbackMeta = {
          name: session.user?.name || "Ash Manda",
          email: session.user?.email || "srmanda.cs@gmail.com",
        };
        setProfileMetadata(fallbackMeta);
        await seedEmptyResumeOnBackend(fallbackMeta, "POST");
      }
    } catch (e) {
      console.error("Profile payload download failure:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadProfile();
    }
  }, [session]);

  const handleSave = async () => {
    try {
      const parsedNewResume = JSON.parse(resumeJsonTextarea);

      const payload = {
        name: profileMetadata?.name || session?.user?.name || "Ash Manda",
        email:
          profileMetadata?.email ||
          session?.user?.email ||
          "srmanda.cs@gmail.com",
        masterResume: parsedNewResume, // Raw json object structure mapping directly to DTO JsonNode
      };

      // Explicitly call PUT to bypass the POST idempotency check rule
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfileMetadata(updatedProfile);
        setResumeContent(updatedProfile.masterResume || defaultResumeStructure);
        setJsonError("");
        setEditOpen(false);
      } else {
        setJsonError(
          "Server rejected profile payload. Verify payload constraints.",
        );
      }
    } catch (e) {
      setJsonError(
        "Invalid JSON structure — verify commas and formatting maps.",
      );
    }
  };

  if (loading || !resumeContent) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh] gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <p className="text-zinc-400">Synchronizing master profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />

      <div className="px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {/* Header */}
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
                setResumeJsonTextarea(JSON.stringify(resumeContent, null, 2));
                setEditOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" /> Edit JSON
            </Button>
          </div>

          {/* Contact Info */}
          {resumeContent?.contact_info && (
            <Section title="Contact Information">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="pt-6 flex flex-col gap-3">
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      {resumeContent.contact_info.first_name}{" "}
                      {resumeContent.contact_info.last_name}
                    </h2>
                    {resumeContent.contact_info.location && (
                      <div className="flex items-center gap-1 text-zinc-400 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />{" "}
                        {resumeContent.contact_info.location}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {resumeContent.contact_info.email && (
                      <a
                        href={`mailto:${resumeContent.contact_info.email}`}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />{" "}
                        {resumeContent.contact_info.email}
                      </a>
                    )}
                    {resumeContent.contact_info.phone && (
                      <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                        <Phone className="w-3.5 h-3.5" />{" "}
                        {resumeContent.contact_info.phone}
                      </span>
                    )}
                    {resumeContent.contact_info.linkedin_url && (
                      <a
                        href={resumeContent.contact_info.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                      >
                        <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    )}
                    {resumeContent.contact_info.github_url && (
                      <a
                        href={resumeContent.contact_info.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                      >
                        <FaGithub className="w-3.5 h-3.5" /> GitHub
                      </a>
                    )}
                    {resumeContent.contact_info.portfolio_url && (
                      <a
                        href={resumeContent.contact_info.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
                      >
                        <FaGlobe className="w-3.5 h-3.5" /> Portfolio
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Section>
          )}

          {/* Education */}
          {resumeContent?.education?.length > 0 && (
            <Section title="Education">
              <div className="flex flex-wrap gap-4">
                {resumeContent.education.map((edu: any, i: number) => (
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
          )}

          {/* Work Experience */}
          {resumeContent?.work_experience?.length > 0 && (
            <Section title="Work Experience">
              <div className="flex flex-col gap-4">
                {resumeContent.work_experience.map((job: any, i: number) => (
                  <Card key={i} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="pt-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-white font-bold">
                            {job.job_title}
                          </h3>
                          <p className="text-zinc-400 text-sm">{job.company}</p>
                          {job.location && (
                            <div className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </div>
                          )}
                        </div>
                        <span className="text-zinc-500 text-xs whitespace-nowrap">
                          {formatDate(job.start_date)} —{" "}
                          {formatDate(job.end_date)}
                        </span>
                      </div>

                      {job.key_metrics && (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(job.key_metrics).map(
                            ([key, val]: [string, any]) => (
                              <Badge
                                key={key}
                                className="bg-zinc-700 text-zinc-300 border-zinc-600 text-xs font-normal"
                              >
                                {key.replace(/_/g, " ")}: {String(val)}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}

                      {job.narrative_context && (
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
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {resumeContent?.projects?.length > 0 && (
            <Section title="Projects">
              <div className="flex flex-col gap-4">
                {resumeContent.projects.map((project: any, i: number) => (
                  <Card key={i} className="bg-zinc-800 border-zinc-700">
                    <CardContent className="pt-6 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-white font-bold">
                          {project.project_name}
                        </h3>
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {project.technologies && (
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
                      )}

                      {project.key_metrics && (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(project.key_metrics).map(
                            ([key, val]: [string, any]) => (
                              <Badge
                                key={key}
                                className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-normal"
                              >
                                {key.replace(/_/g, " ")}: {String(val)}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}

                      {project.narrative_context && (
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
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {resumeContent?.skills &&
            Object.keys(resumeContent.skills).length > 0 && (
              <Section title="Skills">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardContent className="pt-6 flex flex-col gap-5">
                    {Object.entries(resumeContent.skills).map(
                      ([category, skills]: [string, any]) => (
                        <div key={category} className="flex flex-col gap-2">
                          <h3 className="text-zinc-400 text-xs font-semibold">
                            {category}
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {typeof skills === "string" &&
                              skills.split(", ").map((skill: string) => (
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
            )}
        </div>
      </div>

      {/* Edit JSON Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-800 border-zinc-700 text-white sm:max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">
              Edit Master Resume JSON
            </DialogTitle>
          </DialogHeader>

          <Textarea
            className="bg-zinc-900 border-zinc-700 text-zinc-300 text-xs font-mono flex-1 min-h-0 resize-none"
            value={resumeJsonTextarea}
            onChange={(e) => setResumeJsonTextarea(e.target.value)}
            spellCheck={false}
          />

          {jsonError && (
            <p className="text-red-400 text-xs font-semibold">{jsonError}</p>
          )}

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
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
