import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createProject, deleteProject, getProjects, updateProject } from "@/data/projects";
import type { Project } from "@/data/schema";

export const Route = createFileRoute("/admin/_layout/projects")({
  component: AdminProjectsPage,
});

const projectFormSchema = z.object({
  title: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  live: z.boolean(),
  href: z.string().url("Must be a valid URL"),
  coverUrl: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  tech: z.string(),
  sortOrder: z.coerce.number().int(),
});
type ProjectFormValues = z.infer<typeof projectFormSchema>;

function toFormValues(project?: Project): ProjectFormValues {
  return {
    title: project?.title ?? "",
    status: project?.status ?? "All systems operational",
    live: project?.live ?? true,
    href: project?.href ?? "",
    coverUrl: project?.coverUrl ?? "",
    description: project?.description ?? "",
    tech: project?.tech.join(", ") ?? "",
    sortOrder: project?.sortOrder ?? 0,
  };
}

function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => getProjects(),
  });
  const [editing, setEditing] = useState<Project | null | undefined>(undefined);

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
  }

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormValues) =>
      createProject({ data: { ...data, tech: parseTech(data.tech) } }),
    onSuccess: async () => {
      await invalidate();
      toast.success("Project created");
      setEditing(undefined);
    },
    onError: () => toast.error("Failed to create project"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormValues & { id: string }) =>
      updateProject({ data: { ...data, tech: parseTech(data.tech) } }),
    onSuccess: async () => {
      await invalidate();
      toast.success("Project updated");
      setEditing(undefined);
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ data: { id } }),
    onSuccess: async () => {
      await invalidate();
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[1.4rem] font-bold tracking-[-0.02em] text-fg-strong">Projects</h1>
        <Dialog
          open={editing !== undefined}
          onOpenChange={(open) => setEditing(open ? null : undefined)}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>Add project</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit project" : "Add project"}</DialogTitle>
            </DialogHeader>
            {editing !== undefined && (
              <ProjectForm
                initial={editing ?? undefined}
                pending={createMutation.isPending || updateMutation.isPending}
                onSubmit={(values) => {
                  if (editing?.id) {
                    updateMutation.mutate({ ...values, id: editing.id });
                  } else {
                    createMutation.mutate(values);
                  }
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Live</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium text-fg-strong">{project.title}</TableCell>
                <TableCell>{project.live ? "Yes" : "No"}</TableCell>
                <TableCell>{project.sortOrder}</TableCell>
                <TableCell className="flex justify-end gap-2 text-right">
                  <Button variant="outline" size="sm" onClick={() => setEditing(project)}>
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{project.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This can't be undone. The project will be removed from the site
                          immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(project.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function parseTech(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function ProjectForm({
  initial,
  pending,
  onSubmit,
}: {
  initial?: Project;
  pending: boolean;
  onSubmit: (values: ProjectFormValues) => void;
}) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: toFormValues(initial),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
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
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tech"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech (comma-separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="React, TypeScript, Node.js" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="w-24" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="live"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormLabel>Live</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
