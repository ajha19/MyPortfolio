import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getSiteContent, updateSiteContent } from "@/data/content";
import type { EducationEntry, ExperienceEntry, SiteContent, SkillGroup } from "@/data/schema";

export const Route = createFileRoute("/admin/_layout/content")({
  component: AdminContentPage,
});

const contentFormSchema = z.object({
  heroName: z.string().min(1, "Required"),
  heroTagline: z.string().min(1, "Required"),
  heroBio: z.string().min(1, "Required"),
  aboutParagraphsText: z.string(),
  experience: z.array(
    z.object({
      company: z.string().min(1, "Required"),
      role: z.string().min(1, "Required"),
      period: z.string().min(1, "Required"),
      place: z.string().min(1, "Required"),
      current: z.boolean(),
      logoUrl: z.string(),
      techText: z.string(),
      bulletsText: z.string(),
    }),
  ),
  skills: z.array(
    z.object({
      category: z.string().min(1, "Required"),
      itemsText: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      title: z.string().min(1, "Required"),
      place: z.string().min(1, "Required"),
      period: z.string().min(1, "Required"),
    }),
  ),
  linkedinUrl: z.string().url("Must be a valid URL"),
  githubUrl: z.string().url("Must be a valid URL"),
  email: z.string().min(1, "Required"),
  githubChartUsername: z.string().min(1, "Required"),
  calendlyUrl: z.string().url("Must be a valid URL"),
  resumeDriveFileId: z.string().min(1, "Required"),
});
type ContentFormValues = z.infer<typeof contentFormSchema>;

function csv(items: string[]): string {
  return items.join(", ");
}
function parseCsv(text: string): string[] {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
function lines(items: string[]): string {
  return items.join("\n");
}
function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toFormValues(content: SiteContent): ContentFormValues {
  return {
    heroName: content.heroName,
    heroTagline: content.heroTagline,
    heroBio: content.heroBio,
    aboutParagraphsText: lines(content.aboutParagraphs),
    experience: content.experience.map((x: ExperienceEntry) => ({
      company: x.company,
      role: x.role,
      period: x.period,
      place: x.place,
      current: x.current ?? false,
      logoUrl: x.logoUrl ?? "",
      techText: csv(x.tech),
      bulletsText: lines(x.bullets),
    })),
    skills: content.skills.map((s: SkillGroup) => ({
      category: s.category,
      itemsText: csv(s.items),
    })),
    education: content.education.map((e: EducationEntry) => ({ ...e })),
    linkedinUrl: content.linkedinUrl,
    githubUrl: content.githubUrl,
    email: content.email,
    githubChartUsername: content.githubChartUsername,
    calendlyUrl: content.calendlyUrl,
    resumeDriveFileId: content.resumeDriveFileId,
  };
}

function toPayload(values: ContentFormValues) {
  return {
    heroName: values.heroName,
    heroTagline: values.heroTagline,
    heroBio: values.heroBio,
    aboutParagraphs: parseLines(values.aboutParagraphsText),
    experience: values.experience.map((x) => ({
      company: x.company,
      role: x.role,
      period: x.period,
      place: x.place,
      current: x.current,
      logoUrl: x.logoUrl || undefined,
      tech: parseCsv(x.techText),
      bullets: parseLines(x.bulletsText),
    })),
    skills: values.skills.map((s) => ({ category: s.category, items: parseCsv(s.itemsText) })),
    education: values.education,
    linkedinUrl: values.linkedinUrl,
    githubUrl: values.githubUrl,
    email: values.email,
    githubChartUsername: values.githubChartUsername,
    calendlyUrl: values.calendlyUrl,
    resumeDriveFileId: values.resumeDriveFileId,
  };
}

function AdminContentPage() {
  const { data: content, isLoading } = useQuery({
    queryKey: ["admin", "content"],
    queryFn: () => getSiteContent(),
  });

  if (isLoading || !content) return <p className="text-sm text-muted">Loading…</p>;

  return <ContentForm content={content} />;
}

function ContentForm({ content }: { content: SiteContent }) {
  const queryClient = useQueryClient();
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: toFormValues(content),
  });

  const experienceArray = useFieldArray({ control: form.control, name: "experience" });
  const skillsArray = useFieldArray({ control: form.control, name: "skills" });
  const educationArray = useFieldArray({ control: form.control, name: "education" });

  const mutation = useMutation({
    mutationFn: (values: ContentFormValues) => updateSiteContent({ data: toPayload(values) }),
    onSuccess: async (updated) => {
      queryClient.setQueryData(["admin", "content"], updated);
      toast.success("Content saved");
    },
    onError: () => toast.error("Failed to save content"),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="flex flex-col gap-10"
      >
        <section className="flex flex-col gap-4">
          <h2 className="text-[1.1rem] font-semibold text-fg-strong">Hero</h2>
          <FormField
            control={form.control}
            name="heroName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroTagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heroBio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutParagraphsText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About paragraphs (one per line, &lt;b&gt; allowed)</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.1rem] font-semibold text-fg-strong">Experience</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                experienceArray.append({
                  company: "",
                  role: "",
                  period: "",
                  place: "",
                  current: false,
                  logoUrl: "",
                  techText: "",
                  bulletsText: "",
                })
              }
            >
              Add experience
            </Button>
          </div>
          {experienceArray.fields.map((field, index) => (
            <div key={field.id} className="rounded-[14px] border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-fg-strong">Entry {index + 1}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => experienceArray.remove(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`experience.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.period`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.place`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.logoUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.current`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 self-end pb-1.5">
                      <FormLabel>Currently working here</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`experience.${index}.techText`}
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Tech (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.bulletsText`}
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Bullets (one per line, &lt;b&gt; allowed)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.1rem] font-semibold text-fg-strong">Skills</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => skillsArray.append({ category: "", itemsText: "" })}
            >
              Add group
            </Button>
          </div>
          {skillsArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <FormField
                control={form.control}
                name={`skills.${index}.category`}
                render={({ field }) => (
                  <FormItem className="w-40 shrink-0">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`skills.${index}.itemsText`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Items (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-6"
                onClick={() => skillsArray.remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[1.1rem] font-semibold text-fg-strong">Education</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => educationArray.append({ title: "", place: "", period: "" })}
            >
              Add entry
            </Button>
          </div>
          {educationArray.fields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <FormField
                control={form.control}
                name={`education.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.place`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Place</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.period`}
                render={({ field }) => (
                  <FormItem className="w-40">
                    <FormLabel>Period</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-6"
                onClick={() => educationArray.remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[1.1rem] font-semibold text-fg-strong">Links</h2>
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubChartUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub username (contribution chart)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (mailto: link)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calendlyUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calendly URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resumeDriveFileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume Google Drive file ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="sticky bottom-4">
          <Button type="submit" disabled={mutation.isPending} size="lg">
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
