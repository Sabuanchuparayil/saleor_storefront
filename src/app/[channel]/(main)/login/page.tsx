import { Suspense } from "react";
import { Loader } from "@/ui/atoms/Loader";
import { LoginForm } from "@/ui/components/LoginForm";

export default function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ registered?: string; confirmation?: string; email?: string }>;
}) {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<LoginForm searchParams={searchParams} />
			</section>
		</Suspense>
	);
}
