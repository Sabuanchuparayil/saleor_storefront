import { redirect } from "next/navigation";
import { DefaultChannelSlug } from "@/app/config";

export default function EmptyPage() {
	// Use permanent redirect to avoid redirect loops
	// Next.js redirect() uses 307 by default, which is temporary
	// Using a client-side approach might be safer, but server-side redirect is more SEO-friendly
	redirect(`/${DefaultChannelSlug}`);
}
