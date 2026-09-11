import { useState } from "react";
import { supabase } from "../lib/supabase";

interface LoginPageProps {
  onAuthenticated: () => void;
}

export default function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              username: username || email.split("@")[0],
            });

          if (profileError) throw profileError;
        }

        onAuthenticated();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        onAuthenticated();
      }
    }  catch (err) {
  console.error("AUTH ERROR:", err);
  console.error("AUTH ERROR JSON:", JSON.stringify(err));

  setError(
    err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : String(err)
  );
} finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="text-3xl font-black tracking-tight text-emerald-400">
            LAGLOOP
          </div>
          <p className="mt-3 text-slate-400">
            Recover the connection you almost lost.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="mb-6 flex rounded-lg bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${
                mode === "login"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400"
              }`}
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold ${
                mode === "signup"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
            >
              {loading
                ? "Working..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}