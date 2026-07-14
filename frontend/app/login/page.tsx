"use client"
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ChevronDown, Terminal, AlertCircle } from "lucide-react";
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
import { useLogin } from "../hooks/useLogin";
import Link from "next/link";

// import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const { mutateAsync: loginUser, isPending } = useLogin();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  const errors = {
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? "Enter a valid email"
      : "",
    password: form.password.length < 8 ? "Password must be at least 8 characters" : "",
  };

  const isValid = !errors.email && !errors.password;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBlur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!isValid) return;

    setServerError("");
    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
        role: form.role,
      });
      console.log(data)
  
    } catch (err) {
      console.error(err);
      setServerError(
        err?.response?.data?.message || err?.message || "Login failed. Check your credentials."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#141C26] border border-[#243040]">
            <Terminal className="h-4 w-4 text-[#4ADE9C]" />
          </div>
          <span className="font-mono text-sm text-[#7C8B9E]">
            <span className="text-[#4ADE9C]">$</span> login
          </span>
        </div>

        <Card className="border-[#1E2733] bg-[#101720] shadow-[0_0_0_1px_rgba(74,222,156,0.03)]">
          <CardHeader className="border-b border-[#1E2733]">
            <CardTitle className="font-mono text-base text-[#E7EDF3]">Log in</CardTitle>
            <CardDescription className="text-xs text-[#5B6B7F]">
              Welcome back. Pick your role and sign in.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {serverError && (
                <div className="flex items-start gap-2 rounded-md border border-[#4A2530] bg-[#1F1216] px-3 py-2">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F87171]" />
                  <p className="text-xs text-[#F87171]">{serverError}</p>
                </div>
              )}

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
              </Field>

              <div className="flex justify-end">
                <span className="text-xs text-[#4ADE9C] cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#4ADE9C] text-[#0B0F14] hover:bg-[#3FCB8C] disabled:opacity-60"
              >
                {isPending ? "Logging in…" : "Log in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-[#5B6B7F]">
          Don't have an account?{" "}
          <Link href={"/signup"} className="text-[#4ADE9C] cursor-pointer hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono text-[#7C8B9E]">
        {icon}
        {label}
      </Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-[#F87171]">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-md border bg-[#0C1117] px-3 py-2 text-sm text-[#E7EDF3] placeholder-[#3C4A5C] outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#4ADE9C] focus-visible:border-[#4ADE9C] ${
    hasError ? "border-[#F87171]" : "border-[#243040]"
  }`;
}