"use client"
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ChevronDown, Terminal, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: form.name.trim().length === 0 ? "Name is required" : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Enter a valid email"
      : "",
    password:
      form.password.length < 8 ? "Password must be at least 8 characters" : "",
  };

  const isValid = !errors.name && !errors.email && !errors.password;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (isValid) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-sm border-[#1E2733] bg-[#101720] text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1C3A33]">
              <Check className="h-6 w-6 text-[#4ADE9C]" strokeWidth={2.5} />
            </div>
            <h2 className="font-mono text-lg text-[#E7EDF3]">Account created</h2>
            <p className="mt-2 text-sm text-[#7C8B9E]">
              {form.name}, you're registered as{" "}
              <span className="text-[#4ADE9C]">
                {form.role === "problem_setter" ? "Problem Setter" : "Candidate"}
              </span>
              .
            </p>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="mt-6 w-full border-[#243040] bg-transparent text-[#9FB0C3] hover:border-[#4ADE9C] hover:text-[#4ADE9C] hover:bg-transparent"
            >
              Back to form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#141C26] border border-[#243040]">
            <Terminal className="h-4 w-4 text-[#4ADE9C]" />
          </div>
          <span className="font-mono text-sm text-[#7C8B9E]">
            <span className="text-[#4ADE9C]">$</span> create-account
          </span>
        </div>

        <Card className="border-[#1E2733] bg-[#101720] shadow-[0_0_0_1px_rgba(74,222,156,0.03)]">
          <CardHeader className="border-b border-[#1E2733]">
            <CardTitle className="font-mono text-base text-[#E7EDF3]">Sign up</CardTitle>
            <CardDescription className="text-xs text-[#5B6B7F]">
              Join as a problem setter or a candidate.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <Field
                label="Full name"
                icon={<User className="h-4 w-4" />}
                error={touched.name && errors.name}
              >
                <Input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder="Ada Lovelace"
                  className={inputClass(touched.name && errors.name)}
                />
              </Field>

              {/* Email */}
              <Field
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                error={touched.email && errors.email}
              >
                <Input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder="ada@domain.com"
                  className={inputClass(touched.email && errors.email)}
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                error={touched.password && errors.password}
                hint={!touched.password || !errors.password ? "Minimum 8 characters" : ""}
              >
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="••••••••"
                    className={inputClass(touched.password && errors.password) + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5B6B7F] hover:text-[#9FB0C3]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          form.password.length >= 8 + i * 2
                            ? "bg-[#4ADE9C]"
                            : form.password.length >= 8
                            ? "bg-[#2A5C4A]"
                            : "bg-[#1E2733]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Field>

              {/* Role */}
              <Field label="Role" icon={<ChevronDown className="h-4 w-4" />}>
                <Select
                  value={form.role}
                  onValueChange={(value) => setForm((f) => ({ ...f, role: value }))}
                >
                  <SelectTrigger className={inputClass(false) + " justify-between"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#243040] bg-[#0C1117] text-[#E7EDF3]">
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="problem_setter">Problem Setter</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1.5 text-xs text-[#5B6B7F]">
                  {form.role === "problem_setter"
                    ? "Author and manage problems on the platform."
                    : "Solve problems and submit solutions."}
                </p>
              </Field>

              <Button
                type="submit"
                className="mt-2 w-full bg-[#4ADE9C] text-[#0B0F14] hover:bg-[#3FCB8C]"
              >
                Create account
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-[#5B6B7F]">
          Already have an account?{" "}
          <Link href={"/login"} className="text-[#4ADE9C] cursor-pointer hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, error, hint, children }) {
  return (
    <div>
      <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono text-[#7C8B9E]">
        {icon}
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-[#F87171]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-[#5B6B7F]">{hint}</p>
      ) : null}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-md border bg-[#0C1117] px-3 py-2 text-sm text-[#E7EDF3] placeholder-[#3C4A5C] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#4ADE9C] focus-visible:border-[#4ADE9C] ${
    hasError ? "border-[#F87171]" : "border-[#243040]"
  }`;
}