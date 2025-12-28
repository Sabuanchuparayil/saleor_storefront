import Link from "next/link";
import { getServerAuthClient } from "@/app/config";

export async function LoginForm({
	searchParams,
}: {
	searchParams: Promise<{ registered?: string; confirmation?: string; email?: string }>;
}) {
	const params = await searchParams;
	const showSuccessMessage = params?.registered === "true";
	const requiresConfirmation = params?.confirmation === "required";
	const email = params?.email;

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			{showSuccessMessage && !requiresConfirmation && (
				<div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">
					Account created successfully! Please log in with your credentials.
				</div>
			)}
			{showSuccessMessage && requiresConfirmation && (
				<div className="mb-4 rounded border border-blue-200 bg-blue-50 p-4">
					<div className="mb-2 flex items-center">
						<svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<h3 className="font-semibold text-blue-900">Email Confirmation Required</h3>
					</div>
					<p className="text-sm text-blue-800">
						{email
							? `We've sent a confirmation email to ${email}. Please check your inbox and click the confirmation link to activate your account before logging in.`
							: "Please check your email and click the confirmation link to activate your account before logging in."}
					</p>
				</div>
			)}
			<form
				className="rounded border p-8 shadow-md"
				action={async (formData) => {
					"use server";

					const email = formData.get("email")?.toString();
					const password = formData.get("password")?.toString();

					if (!email || !password) {
						throw new Error("Email and password are required");
					}

					const { data } = await (
						await getServerAuthClient()
					).signIn({ email, password }, { cache: "no-store" });

					if (data.tokenCreate.errors.length > 0) {
						// setErrors(data.tokenCreate.errors.map((error) => error.message));
						// setFormValues(DefaultValues);
					}
				}}
			>
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
					/>
				</div>
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Password
					</label>
					<input
						required
						type="password"
						name="password"
						placeholder="Password"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>

				<button
					className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
					type="submit"
				>
					Log In
				</button>
			</form>
			<div className="mt-4 text-center text-sm">
				<span className="text-neutral-600">Don&apos;t have an account? </span>
				<Link href="/default-channel/register" className="text-neutral-800 underline hover:text-neutral-600">
					Create one
				</Link>
			</div>
		</div>
	);
}
