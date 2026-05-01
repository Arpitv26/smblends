import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin/auth";

export default async function AdminLoginPage(): Promise<JSX.Element> {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center px-4 py-8 sm:px-6">
      <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
          SMBLENDS Admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Sign in to manage bookings.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Use the admin account created in Supabase. This area is only for the
          barber.
        </p>

        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
