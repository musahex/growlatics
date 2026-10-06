// Preview build (GitHub Pages at /growlatics, noindex): NEXT_PUBLIC_SITE_ENV=preview. Unset = production. See docs/v2/PREVIEW.md.
const preview = process.env.NEXT_PUBLIC_SITE_ENV === 'preview'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(preview && { basePath: '/growlatics', env: { NEXT_PUBLIC_BASE_PATH: '/growlatics' } }),
}

export default nextConfig
