"use client";

import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
	password: string;
}

type StrengthLevel = "weak" | "fair" | "good" | "strong";

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
	const strength = useMemo<StrengthLevel>(() => {
		if (!password) return "weak";

		let score = 0;

		// Length check
		if (password.length >= 8) score += 1;
		if (password.length >= 12) score += 1;

		// Character variety checks
		if (/[a-z]/.test(password)) score += 1; // lowercase
		if (/[A-Z]/.test(password)) score += 1; // uppercase
		if (/[0-9]/.test(password)) score += 1; // numbers
		if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special characters

		if (score <= 2) return "weak";
		if (score <= 4) return "fair";
		if (score <= 5) return "good";
		return "strong";
	}, [password]);

	const strengthConfig = {
		weak: {
			label: "Weak",
			color: "bg-red-500",
			textColor: "text-red-600",
			width: "25%",
		},
		fair: {
			label: "Fair",
			color: "bg-orange-500",
			textColor: "text-orange-600",
			width: "50%",
		},
		good: {
			label: "Good",
			color: "bg-yellow-500",
			textColor: "text-yellow-600",
			width: "75%",
		},
		strong: {
			label: "Strong",
			color: "bg-green-500",
			textColor: "text-green-600",
			width: "100%",
		},
	};

	const config = strengthConfig[strength];

	if (!password) {
		return null;
	}

	return (
		<div className="mt-1">
			<div className="flex items-center justify-between text-xs">
				<span className={config.textColor}>Password strength: {config.label}</span>
			</div>
			<div className="mt-1 h-1 w-full rounded-full bg-neutral-200">
				<div
					className={`h-1 rounded-full transition-all duration-300 ${config.color}`}
					style={{ width: config.width }}
				/>
			</div>
		</div>
	);
}
