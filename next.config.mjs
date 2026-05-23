/** @type {import('next').NextConfig} */

const repoName = "growlatics"
const isGitHubPages = process.env.GITHUB_ACTIONS === "true"

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isGitHubPages && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  }),
}

export default nextConfig
