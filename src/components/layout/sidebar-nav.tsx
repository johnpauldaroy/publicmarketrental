import { NavLink } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/auth-context";
import { getRoleLabel } from "@/lib/routing";
import type { NavItem } from "@/types/domain";

interface SidebarNavProps {
  items: NavItem[];
  portalName: string;
  onNavigate?: () => void;
  collapsed?: boolean;
}

export function SidebarNav({ items, portalName, onNavigate, collapsed = false }: SidebarNavProps) {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className={cn("px-2 pb-8", collapsed ? "flex justify-center" : "flex items-center gap-3")}>
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 p-1 shadow-soft">
          <img
            alt="Municipality of Culasi seal"
            className="h-full w-full rounded-xl object-cover"
            src="/culasi-seal.png"
          />
        </div>
        <div className={collapsed ? "hidden" : ""}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Municipality of Culasi
          </p>
          <h2 className="font-display text-xl text-foreground">{portalName}</h2>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex rounded-2xl py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center px-3" : "items-center gap-3 px-4",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground",
              )
            }
            key={item.to}
            onClick={onNavigate}
            title={item.label}
            to={item.to}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div
          className={cn(
            "mt-6 rounded-2xl border border-border/70 bg-muted/50 py-3",
            collapsed ? "flex justify-center px-2" : "flex items-center gap-3 px-4",
          )}
        >
          <UserCircle2 className="h-8 w-8 shrink-0 text-muted-foreground" />
          <div className={cn("min-w-0", collapsed ? "hidden" : "")}>
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
