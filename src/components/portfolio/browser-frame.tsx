import type { ReactNode } from "react";

/**
 * Minimal editorial browser chrome for case-study previews.
 * `dark` flips the chrome for dark screenshots.
 */
export function BrowserFrame({
  url,
  children,
  dark = false,
  className = "",
}: {
  url: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        dark ? "border-white/10 bg-[#161616]" : "border-[#11111114] bg-white"
      } shadow-[0_24px_60px_-24px_rgba(17,17,17,0.28)] ${className}`}
    >
      {/* chrome bar */}
      <div
        className={`flex items-center gap-3 border-b px-4 py-[10px] ${
          dark ? "border-white/10 bg-[#1d1d1d]" : "border-[#1111110f] bg-[#faf9f6]"
        }`}
      >
        <div className="flex gap-[6px]" aria-hidden>
          <span className="h-[9px] w-[9px] rounded-full bg-[#1111111a]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#1111111a]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#1111111a]" />
        </div>
        <div
          className={`micro truncate rounded-md px-3 py-[5px] text-[9px] tracking-[0.14em] ${
            dark ? "bg-white/5 text-white/40" : "bg-[#11111108] text-[#999999]"
          }`}
        >
          {url}
        </div>
      </div>
      {/* viewport */}
      <div className="relative overflow-hidden">{children}</div>
    </div>
  );
}
