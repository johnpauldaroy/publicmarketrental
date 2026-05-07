import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
import { getRoleLabel } from "@/lib/routing";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/domain";

interface PortalLayoutProps {
  navigation: NavItem[];
  portalName: string;
}

export function PortalLayout({ navigation, portalName }: PortalLayoutProps) {
  const [open, setOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const visibleNavigation = navigation.filter(
    (item) => !item.roles || (user ? item.roles.includes(user.role) : true),
  );

  const title =
    navigation.find((item) => pathname.startsWith(item.to))?.label ?? portalName;
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.14),_transparent_32%),linear-gradient(180deg,_rgba(255,251,235,0.92),_rgba(248,250,252,1))]" />

      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside
          className={cn(
            "hidden border-r border-border/70 bg-background/75 backdrop-blur transition-all duration-200 lg:block",
            desktopNavOpen ? "w-[310px] p-6" : "w-[96px] p-4",
          )}
        >
          <SidebarNav
            collapsed={!desktopNavOpen}
            items={visibleNavigation}
            portalName={portalName}
          />
        </aside>

        {open ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[310px] border-r border-border/70 bg-background p-6 shadow-soft transition-transform lg:hidden",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center justify-end">
            <Button onClick={() => setOpen(false)} size="icon" type="button" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarNav
            items={visibleNavigation}
            onNavigate={() => setOpen(false)}
            portalName={portalName}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 md:px-8 lg:px-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    className="lg:hidden"
                    onClick={() => setOpen(true)}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <Button
                    className="hidden lg:inline-flex"
                    onClick={() => setDesktopNavOpen((current) => !current)}
                    aria-label={desktopNavOpen ? "Collapse navigation" : "Expand navigation"}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    {desktopNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {crumbs.join(" / ") || "dashboard"}
                    </p>
                    <h1 className="font-display text-2xl text-foreground">{title}</h1>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                  {user ? (
                    <>
                      <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
                    </>
                  ) : null}
                  <Button
                    onClick={async () => {
                      await signOut();
                      navigate("/login");
                    }}
                    type="button"
                    variant="outline"
                  >
                    Sign out
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link className="font-medium text-foreground" to={visibleNavigation[0]?.to ?? "/"}>
                  Portal home
                </Link>
                <span>/</span>
                <span>{title}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
