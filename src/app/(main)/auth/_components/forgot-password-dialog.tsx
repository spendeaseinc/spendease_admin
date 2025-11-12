"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { forgotPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ForgotPasswordSchema } from "@/lib/schema";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    startTransition(async () => {
      const result = await forgotPassword(data);

      if (result.success) {
        setUserEmail(data.email);
        setShowSuccess(true);
      } else {
        form.setError("email", {
          message: result.message,
        });
      }
    });
  }

  function handleResend() {
    const email = form.getValues("email");
    if (email) {
      onSubmit({ email });
    }
  }

  function handleClose() {
    setShowSuccess(false);
    form.reset();
    onOpenChange(false);
  }

  function handleBackToLogin() {
    handleClose();
  }

  function handleProceed() {
    router.push("reset-password");
  }

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={handleClose}
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="flex flex-col items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold">Reset link sent!</DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                A password reset link has been sent to your email address{" "}
                <span className="text-foreground font-medium">&quot;{userEmail}&quot;</span>. If you don&apos;t see it
                in your inbox, please check your spam or junk folder
              </DialogDescription>
            </div>
            <div className="text-sm">
              Didn&apos;t get any mail?{" "}
              <button onClick={handleResend} className="font-medium underline hover:no-underline">
                Resend Link
              </button>
            </div>
            <div className="grid w-full grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleBackToLogin}>
                Back to Login
              </Button>
              <Button
                className="bg-[#FD6F01] text-white transition-all duration-300 hover:bg-[#FD6F01]/90"
                onClick={handleProceed}
              >
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">Forgot password</DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Enter your registered email address. A password reset link will be sent to your inbox.
          </DialogDescription>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={handleBackToLogin} disabled={isPending}>
                Back to Login
              </Button>
              <Button
                type="submit"
                className="bg-[#FD6F01] text-white transition-all duration-300 hover:bg-white hover:text-[#FD6F01]"
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "Proceed"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
