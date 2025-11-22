import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Next.js App Starter</h1>
        <p className="mt-2 text-gray-600">
          You’re looking at a clean Next.js 14 project using the App Router, TypeScript, TailwindCSS, ESLint and Prettier.
        </p>
      </header>

      <section className="grid gap-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Try the API route</h2>
          <p className="mt-1 text-gray-600">
            A simple healthcheck endpoint is available.
          </p>
          <Link
            href="/api/health"
            className="mt-3 inline-block rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            GET /api/health
          </Link>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Environment variables</h2>
          <p className="mt-1 text-gray-600">
            Duplicate <code>.env.example</code> to <code>.env.local</code> and set your keys.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Where to edit</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
            <li><code>app/page.tsx</code> for this page</li>
            <li><code>app/layout.tsx</code> for the layout shell</li>
            <li><code>app/api/health/route.ts</code> for the API example</li>
          </ul>
        </div>
      </section>

      <footer className="mt-10 text-sm text-gray-500">
        Built with ❤️ — Happy hacking!
      </footer>
    </main>
  );
}
