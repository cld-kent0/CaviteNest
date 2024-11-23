/** @type {import('next').NextConfig} */
const nextConfig = {
    swcPlugins: [
        ["next-superjson-plugin", {}]
    ]
};

export default nextConfig;
