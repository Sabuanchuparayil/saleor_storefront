/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	typedRoutes: false,
	// used in the Dockerfile
	output: "standalone",
};

export default config;
