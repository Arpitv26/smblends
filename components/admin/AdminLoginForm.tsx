"use client";

import { type FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

type LoginState =
  | {
      errorMessage: string | null;
      status: "idle";
    }
  | {
      errorMessage: null;
      status: "submitting";
    }
  | {
      errorMessage: string;
      status: "error";
    };

function readErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  return typeof candidate.error === "string" ? candidate.error : null;
}

export function AdminLoginForm(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginState, setLoginState] = useState<LoginState>({
    errorMessage: null,
    status: "idle"
  });

  async function submitLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoginState({
      errorMessage: null,
      status: "submitting"
    });

    try {
      const response = await fetch("/api/admin/login", {
        body: JSON.stringify({
          email,
          password
        }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setLoginState({
          errorMessage:
            readErrorMessage(payload) ??
            "Login failed. Check your email and password.",
          status: "error"
        });
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setLoginState({
        errorMessage: "Login failed. Check your connection and try again.",
        status: "error"
      });
    }
  }

  const isSubmitting = loginState.status === "submitting";

  return (
    <form autoComplete="off" className="space-y-4" onSubmit={submitLogin}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Admin email
        </span>
        <input
          autoComplete="off"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-200">
          Password
        </span>
        <input
          autoComplete="new-password"
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </label>

      {loginState.status === "error" ? (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {loginState.errorMessage}
        </div>
      ) : null}

      <button
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        <LogIn className="size-4" aria-hidden="true" />
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
