"use server";

import { executeGraphQL } from "@/lib/graphql";
import { UserRegisterDocument } from "@/gql/graphql";
import { DefaultChannelSlug } from "@/app/config";

export async function registerUser({
	email,
	password,
	firstName,
	lastName,
	channel = DefaultChannelSlug,
	redirectUrl,
}: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	channel?: string;
	redirectUrl?: string;
}) {
	try {
		const result = await executeGraphQL(UserRegisterDocument, {
			variables: {
				input: {
					email,
					password,
					firstName,
					lastName,
					channel,
					redirectUrl: redirectUrl || "",
				},
			},
			withAuth: false,
			cache: "no-store",
		});

		if (result.accountRegister?.errors && result.accountRegister.errors.length > 0) {
			const errorMessages = result.accountRegister.errors.map((e) => e.message || "Error").join(", ");
			return { error: errorMessages };
		}

		return {
			success: true,
			requiresConfirmation: result.accountRegister?.requiresConfirmation || false,
		};
	} catch (err) {
		return {
			error: err instanceof Error ? err.message : "Registration failed. Please try again.",
		};
	}
}
