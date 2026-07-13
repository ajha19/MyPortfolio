import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { getSiteContent, updateSiteContent } from "@/data/content";
import type { SiteContent } from "@/data/schema";

export const Route = createFileRoute("/admin/_layout/content")({
  component: AdminContentPage,
});

const contentFormSchema = z.object({
  heroName: z.string().min(1, "Required"),
  heroTagline: z.string().min(1, "Required"),
  heroBio: z.string().min(1, "Required"),
  aboutParagraphsText: z.string(),
  linkedinUrl: z.string().url("Must be a valid URL"),
  githubUrl: z.string().url("Must be a valid URL"),
  email: z.string().min(1, "Required"),
  githubChartUsername: z.string().min(1, "Required"),
  calendlyUrl: z.string().url("Must be a valid URL"),
});
type ContentFormValues = z.infer<typeof contentFormSchema>;

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
    linkedinUrl: content.linkedinUrl,
    githubUrl: content.githubUrl,
    email: content.email,
    githubChartUsername: content.githubChartUsername,
    calendlyUrl: content.calendlyUrl,
  };
}

function toPayload(values: ContentFormValues) {
  return {
    heroName: values.heroName,
    heroTagline: values.heroTagline,
    heroBio: values.heroBio,
    aboutParagraphs: parseLines(values.aboutParagraphsText),
    linkedinUrl: values.linkedinUrl,
    githubUrl: values.githubUrl,
    email: values.email,
    githubChartUsername: values.githubChartUsername,
    calendlyUrl: values.calendlyUrl,
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
