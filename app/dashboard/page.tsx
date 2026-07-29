import { verifySession } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import GeneratorFlow from "./generator-flow";

export default async function DashboardPage() {
  await verifySession();

  return (
    <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10 flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">Social AI</p>
        <form action={logout}>
          <button type="submit" className="btn-secondary text-xs px-3 py-1.5">
            Log out
          </button>
        </form>
      </header>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Content Generator
        </h1>
        <p className="text-sm text-text-secondary">
          Create social media posts for your business.
        </p>
      </div>

      <GeneratorFlow />
    </main>
  );
}
