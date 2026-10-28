import { useState } from "react";

export function AuthPage({ onLogin, onRegister, error, isLoading }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(form.email, form.password);
    } else {
      onRegister(form.name, form.email, form.password);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mb-4 shadow-xl shadow-violet-900/40">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">NexusAI</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isLoginMode ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label
                  className="block text-sm text-zinc-400 mb-1.5"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required={!isLoginMode}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
                />
              </div>
            )}

            <div>
              <label
                className="block text-sm text-zinc-400 mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label
                className="block text-sm text-zinc-400 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isLoginMode ? "Your password" : "Min 6 characters"}
                required
                minLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
                <svg
                  className="w-4 h-4 text-red-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {isLoginMode ? "Signing in…" : "Creating account…"}
                </>
              ) : isLoginMode ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setForm({ name: "", email: "", password: "" });
              }}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              {isLoginMode ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
