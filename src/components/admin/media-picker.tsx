"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, ImageIcon, Check, Loader2 } from "lucide-react";
import { useAdminData, type AdminMedia } from "./shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Media picker — text field + "Browse library" dialog with
 * upload, preview, copy URL and selection.
 */
export function MediaPickerField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555]">
          {label}
        </span>
        {hint ? <span className="text-[10px] text-[#999999]">{hint}</span> : null}
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/… or https://…"
          className="h-10 w-full rounded-lg border border-[#1111111f] bg-white px-3 text-[13.5px] text-[#111111] outline-none transition-colors placeholder:text-[#aaaaaa] focus:border-[#4D6BFF]"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-10 shrink-0 gap-2 rounded-lg border-[#1111111f] px-3 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-[#111111]"
        >
          <ImageIcon className="h-3.5 w-3.5" aria-hidden />
          Browse
        </Button>
      </div>
      {value ? (
        <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-[#11111114] bg-white p-2">
          <img
            src={value}
            alt="Selected media preview"
            className="h-14 w-20 rounded-md border border-[#1111110f] object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#777777] transition-colors hover:text-[#c0392b]"
          >
            Remove
          </button>
        </div>
      ) : null}

      <MediaLibraryDialog
        open={open}
        onOpenChange={setOpen}
        selected={value}
        onSelect={(url) => {
          onChange(url);
          setOpen(false);
        }}
      />
    </div>
  );
}

/* ── Library dialog ─────────────────────────── */
export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  selected,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (url: string) => void;
  selected?: string;
}) {
  const { data, loading, error, refetch } = useAdminData<{ assets: AdminMedia[] }>(
    "/api/admin/media"
  );
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      toast.success("Image uploaded");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(url);
        toast.success("URL copied");
        setTimeout(() => setCopied(null), 1500);
      },
      () => toast.error("Could not copy URL")
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden rounded-2xl border-[#11111114] bg-[#F5F3EE] p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-[#11111114] px-6 py-4">
          <DialogTitle className="h-editorial text-lg">Media Library</DialogTitle>
          <DialogDescription className="text-[12px] text-[#777777]">
            Upload an image or pick an existing asset. Uploads are optimized to WebP.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 border-b border-[#11111114] px-6 py-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            id="media-upload-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="h-9 gap-2 rounded-full bg-[#111111] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F5F3EE] hover:bg-[#4D6BFF]"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-3.5 w-3.5" aria-hidden />
            )}
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          <span className="hidden text-[10px] text-[#999999] sm:block">
            JPG · PNG · WebP · GIF · AVIF — max 8 MB
          </span>
        </div>

        <div className="max-h-[46vh] overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-[#11111108]" />
              ))}
            </div>
          ) : error ? (
            <p className="py-10 text-center text-[13px] text-[#c0392b]">{error}</p>
          ) : !data?.assets.length ? (
            <p className="py-12 text-center text-[13px] text-[#777777]">
              No assets yet — upload your first image.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data.assets.map((asset) => (
                <div
                  key={asset.id}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border bg-white transition-colors",
                    selected === asset.url
                      ? "border-[#4D6BFF] ring-1 ring-[#4D6BFF]"
                      : "border-[#11111114] hover:border-[#1111113d]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(asset.url)}
                    className="block aspect-[4/3] w-full"
                    aria-label={`Select ${asset.originalName}`}
                  >
                    <img
                      src={asset.url}
                      alt={asset.originalName}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                  {selected === asset.url ? (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#4D6BFF] text-white">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                  ) : null}
                  <div className="flex items-center justify-between gap-1 border-t border-[#1111110f] px-2 py-1.5">
                    <span className="truncate text-[9px] text-[#999999]" title={asset.originalName}>
                      {asset.originalName}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyUrl(asset.url)}
                      className="shrink-0 font-mono text-[8px] uppercase tracking-[0.14em] text-[#777777] transition-colors hover:text-[#4D6BFF]"
                      aria-label={`Copy URL for ${asset.originalName}`}
                    >
                      {copied === asset.url ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
