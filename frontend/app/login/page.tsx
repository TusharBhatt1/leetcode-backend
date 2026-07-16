"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Header } from "@/components/common/Header";
import { useLogin } from "../hooks/useLogin";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const { mutateAsync: loginUser, isPending } = useLogin();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"admin" | "candidate" | "problem_setter">(
		"admin",
	);
	const [serverError, setServerError] = useState("");

	const isValid = email && password && password.length >= 6 && role;

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValid) return;

		setServerError("");
		try {
			const response = await loginUser({
				email,
				password,
				role,
			} as any);

			if (!response?.user || !response?.token) {
				setServerError("Invalid response from server. Please try again.");
				return;
			}

			localStorage.setItem(
				"user",
				JSON.stringify({
					id: response.user.id,
					name: response.user.name,
					email: response.user.email,
					role,
				}),
			);
			localStorage.setItem("token", response.token);
			router.push("/");
		} catch (err: any) {
			const errorMsg =
			err?.message[0]?.message ??
			err?.message ??
			"Signup failed. Please try again.";
			setServerError(
				errorMsg || "Login failed. Check your credentials.",
			);
		}
	};

	return (
		<>
			<Header />
			<main className="min-h-screen flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-sm">
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold">Welcome back</h1>
						<p className="text-muted-foreground mt-2">
							Sign in to your account
						</p>
					</div>

					<Card>
						<CardContent className="pt-6">
							<form onSubmit={handleLogin} className="space-y-4">
								{serverError && (
									<div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
										{serverError}
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<Select
										value={role}
										onValueChange={(val: any) => setRole(val)}
									>
										<SelectTrigger id="role">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="admin">Admin</SelectItem>
											<SelectItem value="problem_setter">
												Problem Setter
											</SelectItem>
											<SelectItem value="candidate">Candidate</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={!isValid || isPending}
								>
									{isPending ? "Signing in..." : "Sign in"}
								</Button>
							</form>

							<div className="mt-4 text-center text-sm">
								<span className="text-muted-foreground">
									Don&apos;t have an account?{" "}
								</span>
								<Link href="/signup" className="text-primary hover:underline">
									Sign up
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</>
	);
}
