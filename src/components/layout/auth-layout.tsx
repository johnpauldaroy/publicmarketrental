import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.16),_transparent_28%),linear-gradient(180deg,_#fff8ef,_#f8fafc)]" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:items-center lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex h-fit flex-col gap-12 rounded-[2rem] border border-border/70 bg-slate-950 px-8 py-10 text-white shadow-soft">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-1">
                <img
                  alt="Municipality of Culasi seal"
                  className="h-full w-full rounded-xl object-cover"
                  src="/culasi-seal.png"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-teal-200">
                  Municipality of Culasi
                </p>
                <h1 className="font-display text-3xl">Public Market System</h1>
              </div>
            </div>

            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Access and operations</p>
              <h2 className="font-display text-2xl leading-tight sm:text-[2.35rem] lg:text-[2.8rem]">
                Secure entry for the Culasi Public Market System.
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-300">
                Sign in to continue to market administration, billing, and vendor services.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
            Municipal market records, collections, and vendor access in one portal.
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-soft backdrop-blur">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
