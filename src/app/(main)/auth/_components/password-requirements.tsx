"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One lower case",
      met: /[a-z]/.test(password),
    },
    {
      label: "A symbol or special character",
      met: /[^a-zA-Z0-9]/.test(password),
    },
    {
      label: "One upper case",
      met: /[A-Z]/.test(password),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2">
          {req.met ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Circle className="text-muted-foreground h-4 w-4" />
          )}
          <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
        </div>
      ))}
    </div>
  );
}
