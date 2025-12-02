"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newsletterSchema, type NewsletterFormData } from "@/lib/validations/newsletter";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("Thanks for subscribing! Check your email for updates.");
      reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section id="newsletter" className="py-20 sm:py-32">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 -z-10 opacity-50" />

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get Early Access
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Be the first to know when FlatWP launches. Get exclusive early
              access, updates, and resources.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                <div className="flex-1">
                  <Label htmlFor="email" className="sr-only">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12"
                    {...register("email")}
                    disabled={status === "loading"}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-2 text-sm text-destructive"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 group"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>

              {status === "success" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              {status === "error" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              )}
            </form>

            <p className="mt-4 text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
