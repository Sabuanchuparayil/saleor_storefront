/**
 * Health check endpoint for Railway and other monitoring services
 * Returns 200 OK if the application is running
 */

export async function GET() {
	return new Response("OK", {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}

