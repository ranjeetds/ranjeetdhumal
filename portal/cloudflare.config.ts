import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  accountId: "4194da7f9650860bd1f6d964c9a26805",
  worker: defineWorker({
    name: "township-portal",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-20",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["mg.ranjeetdhumal.com"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      NEXT_PUBLIC_SUPABASE_URL: bindings.text('https://ldqqxmooiclkhfkorhtx.supabase.co'),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: bindings.text('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcXF4bW9vaWNsa2hma29yaHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxNjQzMzAsImV4cCI6MjExMDc0MDMzMH0.oYL6DgI8NjX6YQRuRMFVOLPUD85C7cJicnbbUoyibxM'),
      NEXT_PUBLIC_SITE_URL: bindings.text("https://mg.ranjeetdhumal.com"),
      SUPABASE_SERVICE_ROLE_KEY: bindings.secret(),
    },
  }),
});
