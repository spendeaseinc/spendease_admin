import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { ResetPasswordForm } from "../_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full items-center justify-center sm:w-[450px]">
      <Card>
        <CardContent className="space-y-3 text-left">
          <CardTitle className="text-3xl font-medium">Reset your password</CardTitle>
          <CardDescription className="text-sm">Set up a strong password to secure your account</CardDescription>
          <Suspense
            fallback={
              <div className="flex h-fit items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
