"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FlaskConical,
  MessageSquareQuote,
  UserRound,
  Images,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/lab", label: "Lab", icon: FlaskConical },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* wordmark */}
      <div className="flex items-center justify-between px-6 pb-6 pt-7">
        <Link href="/admin" className="flex items-baseline gap-[3px] text-[17px] font-semibold tracking-[-0.02em]">
          CIPHER
          <span className="inline-block h-[7px] w-[7px] rounded-[2px] bg-[#4D6BFF]" aria-hidden />
        </Link>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-[#999999] lg:block">
          Portfolio CMS
        </span>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-[#111111] text-[#F5F3EE]"
                  : "text-[#555555] hover:bg-white hover:text-[#111111]"
              )}
            >
              <Icon
                className={cn("h-4 w-4", active ? "text-[#4D6BFF]" : "text-[#999999] group-hover:text-[#4D6BFF]")}
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[#11111114] px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] text-[#555555] transition-colors hover:bg-white hover:text-[#111111]"
        >
          <ExternalLink className="h-4 w-4 text-[#999999]" aria-hidden />
          View public site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[13px] text-[#555555] transition-colors hover:bg-white hover:text-[#c0392b]"
        >
          <LogOut className="h-4 w-4 text-[#999999]" aria-hidden />
          Sign out
        </button>
        <p className="px-4 pb-1 pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#aaaaaa]">
          Signed in as {username}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#111111]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-[#11111114] bg-[#F5F3EE] lg:block">
        {sidebar}
      </aside>

      {/* mobile topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#11111114] bg-[#F5F3EE]/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-baseline gap-[3px] text-[16px] font-semibold tracking-[-0.02em]">
          CIPHER
          <span className="inline-block h-[6px] w-[6px] rounded-[2px] bg-[#4D6BFF]" aria-hidden />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#111111]"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
          />
          <div className="absolute inset-y-0 left-0 w-[272px] border-r border-[#11111114] bg-[#F5F3EE] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-[#777777]"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </div>
        </div>
      ) : null}

      {/* content */}
      <main className="px-4 pb-16 pt-6 sm:px-6 lg:ml-[248px] lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
