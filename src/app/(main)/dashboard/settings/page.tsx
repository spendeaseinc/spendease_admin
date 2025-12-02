"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateThemeMode, updateFontFamily } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { setValueToCookie } from "@/server/server-actions";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import type { FontFamily } from "@/types/preferences/theme";

type SettingsSection = "profile" | "appearance" | "security";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const fontFamily = usePreferencesStore((s) => s.fontFamily);
  const setFontFamily = usePreferencesStore((s) => s.setFontFamily);

  const handleThemeChange = async () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    updateThemeMode(newTheme);
    setThemeMode(newTheme);
    await setValueToCookie("theme_mode", newTheme);
  };

  const handleFontChange = async (font: FontFamily) => {
    updateFontFamily(font);
    setFontFamily(font);
    await setValueToCookie("font_family", font);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and set e-mail preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 space-y-1">
          <button
            onClick={() => setActiveSection("profile")}
            className={cn(
              "w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
              activeSection === "profile" ? "bg-muted" : "hover:bg-muted/50",
            )}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("appearance")}
            className={cn(
              "w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
              activeSection === "appearance" ? "bg-muted" : "hover:bg-muted/50",
            )}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveSection("security")}
            className={cn(
              "w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
              activeSection === "security" ? "bg-muted" : "hover:bg-muted/50",
            )}
          >
            Security
          </button>
        </aside>

        {/* Main Content */}
        <div className="max-w-2xl flex-1">
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Profile</h2>
                <p className="text-muted-foreground mt-1 text-sm">This is how others will see you on the site.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="picture">Picture</Label>
                  <Input id="picture" type="file" accept="image/*" className="cursor-pointer" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="shadcn" placeholder="Enter your username" />
                  <p className="text-muted-foreground text-xs">
                    This is your public display name. It can be your real name or a pseudonym. You can only change this
                    once every 30 days.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="Test@gmail.com" placeholder="Enter your email" />
                  <p className="text-muted-foreground text-xs">
                    You can manage verified email addresses in your email settings.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue="I own a computer." placeholder="Tell us about yourself" rows={4} />
                  <p className="text-muted-foreground text-xs">
                    You can @mention other users and organizations to link to them.
                  </p>
                </div>

                <Button>Update profile</Button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Appearance</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Customize the appearance of the app. Automatically switch between day and night themes.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="font">Font</Label>
                  <Select value={fontFamily} onValueChange={handleFontChange}>
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="geist">Geist</SelectItem>
                      <SelectItem value="geistsans">Geist Sans</SelectItem>
                      <SelectItem value="geistmono">Geist Mono</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">Set the font you want to use in the dashboard.</p>
                </div>

                <div className="space-y-3">
                  <Label>Theme</Label>
                  <p className="text-muted-foreground text-xs">Select the theme for the dashboard.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleThemeChange()}
                      className={cn(
                        "relative rounded-lg border-2 p-4 transition-colors",
                        themeMode === "light" ? "border-primary" : "border-muted hover:border-muted-foreground/50",
                      )}
                    >
                      <div className="space-y-2">
                        <div className="border-border h-20 space-y-2 rounded-md border bg-white p-2">
                          <div className="bg-muted h-2 w-3/4 rounded" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="bg-muted h-3 w-3 rounded-full" />
                              <div className="bg-muted h-2 w-full rounded" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-muted h-3 w-3 rounded-full" />
                              <div className="bg-muted h-2 w-full rounded" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-muted h-3 w-3 rounded-full" />
                              <div className="bg-muted h-2 w-full rounded" />
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-sm font-medium">Light</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange()}
                      className={cn(
                        "relative rounded-lg border-2 p-4 transition-colors",
                        themeMode === "dark" ? "border-primary" : "border-muted hover:border-muted-foreground/50",
                      )}
                    >
                      <div className="space-y-2">
                        <div className="h-20 space-y-2 rounded-md border border-slate-800 bg-slate-950 p-2">
                          <div className="h-2 w-3/4 rounded bg-slate-800" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-slate-700" />
                              <div className="h-2 w-full rounded bg-slate-800" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-slate-700" />
                              <div className="h-2 w-full rounded bg-slate-800" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-slate-700" />
                              <div className="h-2 w-full rounded bg-slate-800" />
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-sm font-medium">Dark</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Reset account password</h2>
                <p className="text-muted-foreground mt-1 text-sm">Reset your account password.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input id="current-password" type="password" placeholder="Enter current password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" placeholder="Enter new password" />
                </div>

                <Button>Update profile</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
