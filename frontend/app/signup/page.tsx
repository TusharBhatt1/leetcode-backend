"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Header } from "@/components/common/Header";
import { useSignup } from "../hooks/useSignup";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
	const { mutateAsync: signupUser, isPending } = useSignup();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"candidate" | "problem_setter" | "admin">(
		"admin",
	);
	const [error, setError] = useState("");

	const router = useRouter();

	const isValid = name && email && password && password.length >= 8 && role;

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValid) return;

		setError("");
		try {
			const response = await signupUser({
				name,
				email,
				password,
				role,
			});

			// Store user info in localStorage
			if (response?.user) {
				localStorage.setItem(
					"user",
					JSON.stringify({
						id: response.user.id,
						name,
						email: response.user.email,
						role,
					}),
				);
			}

			toast.success("Account created successfully!", {
				description: "Welcome to CodeChallenge!",
			});
			router.push("/");
		} catch (err: unknown) {
			const errorMsg = "Signup failed. Please try again.";
			setError(errorMsg);
			toast.error("Signup failed", { description: errorMsg });
		}
	};

	return (
		<>
			<Header />
			<main className="min-h-screen flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-sm">
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold">Create account</h1>
						<p className="text-muted-foreground mt-2">
							Join CodeChallenge and start solving
						</p>
					</div>

					<Card>
						<CardContent className="pt-6">
							<form onSubmit={handleSignup} className="space-y-4">
								{error && (
									<div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
										{error}
									</div>
								)}

								<div className="space-y-2">
									<Label htmlFor="name">name</Label>
									<Input
										id="name"
										type="text"
										placeholder="Your name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										disabled={isPending}
									/>
								</div>

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
										placeholder="At least 8 characters"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={isPending}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="role">Role</Label>
									<Select
										value={role}
										//@ts-expect-error todo
										onValueChange={(val) => setRole(val)}
										disabled={isPending}
									>
										<SelectTrigger id="role">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="admin">Admin (Recommended)</SelectItem>
											<SelectItem value="problem_setter">
												Problem Setter
											</SelectItem>
											<SelectItem value="candidate">Candidate</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										{role === "admin"
											? "Create problems, add solutions, and manage the platform"
											: role === "problem_setter"
												? "Create and manage coding problems"
												: "Solve coding challenges and improve your skills"}
									</p>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={!isValid || isPending}
								>
									{isPending ? "Creating account..." : "Create account"}
								</Button>
							</form>

							<div className="mt-4 text-center text-sm">
								<span className="text-muted-foreground">
									Already have an account?{" "}
								</span>
								<Link href="/login" className="text-primary hover:underline">
									Log in
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</>
	);
}
