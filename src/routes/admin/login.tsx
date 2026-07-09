import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
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
import { getCurrentAdmin, login } from "@/data/auth";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const admin = await getCurrentAdmin();
    if (admin) throw redirect({ to: "/admin" });
  },
  component: AdminLoginPage,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      await login({ data });
      await navigate({ to: "/admin" });
    } catch {
      form.setError("password", { message: "Invalid email or password" });
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-95 flex-col justify-center px-5.5">
      <h1 className="mb-6 text-[1.6rem] font-bold tracking-[-0.035em] text-fg-strong">
        Admin login
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
