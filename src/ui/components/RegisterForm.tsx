"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "./registerAction";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export function RegisterForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [password, setPassword] = useState("");
	const [requiresConfirmation, setRequiresConfirmation] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		setError(null);
		setRequiresConfirmation(false);

		const email = formData.get("email")?.toString();
		const passwordValue = formData.get("password")?.toString();
		const confirmPassword = formData.get("confirmPassword")?.toString();
		const firstName = formData.get("firstName")?.toString();
		const lastName = formData.get("lastName")?.toString();

		if (!email || !passwordValue || !confirmPassword || !firstName || !lastName) {
			setError("All fields are required");
			return;
		}

		if (passwordValue !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (passwordValue.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		startTransition(async () => {
			try {
				const result = await registerUser({
					email,
					password: passwordValue,
					firstName,
					lastName,
					redirectUrl: typeof window !== "undefined" ? window.location.origin : undefined,
				});

				if (result.error) {
					setError(result.error);
				} else if (result.requiresConfirmation) {
					setRequiresConfirmation(true);
					// Redirect after 3 seconds to show the confirmation message
					setTimeout(() => {
						router.push(
							`/default-channel/login?registered=true&confirmation=required&email=${encodeURIComponent(
								email,
							)}`,
						);
					}, 3000);
				} else {
					router.push("/default-channel/login?registered=true");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
			}
		});
	};

	if (requiresConfirmation) {
		return (
			<div className="mx-auto mt-16 w-full max-w-lg">
				<div className="rounded border border-blue-200 bg-blue-50 p-8 shadow-md">
					<div className="mb-4 flex items-center">
						<svg className="mr-3 h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<h2 className="text-2xl font-bold text-blue-900">Check Your Email</h2>
					</div>
					<p className="mb-4 text-blue-800">
						We&apos;ve sent a confirmation email to your address. Please check your inbox and click the
						confirmation link to activate your account.
					</p>
					<p className="text-sm text-blue-700">You&apos;ll be redirected to the login page shortly...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form action={handleSubmit} className="rounded border p-8 shadow-md">
				<h2 className="mb-6 text-2xl font-bold">Create Account</h2>

				{error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-800">{error}</div>}

				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						required
						type="email"
						name="email"
						placeholder="Email"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						disabled={isPending}
					/>
				</div>

				<div className="mb-2 grid grid-cols-2 gap-2">
					<div>
						<label className="sr-only" htmlFor="firstName">
							First Name
						</label>
						<input
							required
							type="text"
							name="firstName"
							placeholder="First Name"
							className="w-full rounded border bg-neutral-50 px-4 py-2"
							disabled={isPending}
						/>
					</div>
					<div>
						<label className="sr-only" htmlFor="lastName">
							Last Name
						</label>
						<input
							required
							type="text"
							name="lastName"
							placeholder="Last Name"
							className="w-full rounded border bg-neutral-50 px-4 py-2"
							disabled={isPending}
						/>
					</div>
				</div>

				<div className="mb-2">
					<label className="sr-only" htmlFor="password">
						Password
					</label>
					<input
						required
						type="password"
						name="password"
						placeholder="Password (minimum 8 characters)"
						autoCapitalize="off"
						autoComplete="new-password"
						minLength={8}
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						disabled={isPending}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<PasswordStrengthIndicator password={password} />
				</div>

				<div className="mb-4">
					<label className="sr-only" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						required
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						autoCapitalize="off"
						autoComplete="new-password"
						minLength={8}
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						disabled={isPending}
					/>
				</div>

				<button
					className="w-full rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50"
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Creating Account..." : "Create Account"}
				</button>

				<div className="mt-4 text-center text-sm">
					<span className="text-neutral-600">Already have an account? </span>
					<Link href="/default-channel/login" className="text-neutral-800 underline hover:text-neutral-600">
						Log in
					</Link>
				</div>
			</form>
		</div>
	);
}
