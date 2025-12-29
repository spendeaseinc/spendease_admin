import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { LoginForm } from "../_components/login-form";

export const metadata = {
  title: "Login - SpendEase Admin",
  description: "SpendEase Admin Login",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full items-center justify-center sm:w-[450px]">
      <Card>
        <CardContent className="space-y-3 text-left">
          <CardTitle className="text-3xl font-medium">Welcome Back</CardTitle>
          <CardDescription className="text-sm">
            Enter you email and password below to log into your account
          </CardDescription>
          <Suspense
            fallback={
              <div className="flex h-fit items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
