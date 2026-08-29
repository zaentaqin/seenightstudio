import { login } from "@/app/admin/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? decodeURIComponent(params.error) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tighter uppercase">
            See Night
          </h1>
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-ink/40 uppercase">
            Admin Dashboard
          </p>
        </div>

        <form action={login} className="space-y-4">
          {error && (
            <div className="border border-red-500/50 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-500">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-ink bg-ink py-3 text-xs font-bold tracking-[0.2em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
