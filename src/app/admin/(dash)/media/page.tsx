"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AdminHeader, EmptyState, ErrorState, ListSkeleton } from "@/components/admin/bits";
import { useAdminData, apiSend, type AdminMedia } from "@/components/admin/shared";
import { Upload, Loader2, Copy, Trash2, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const { data, loading, error, refetch } = useAdminData<{ assets: AdminMedia[] }>(
    "/api/admin/media"
  );
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminMedia | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const assets = data?.assets ?? [];

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: form });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `Upload failed for ${file.name}`);
      }
      toast.success(files.length === 1 ? "Image uploaded" : `${files.length} images uploaded`);
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

  async function remove() {
    if (!deleting) return;
    try {
      await apiSend(`/api/admin/media/${deleting.id}`, "DELETE");
      toast.success("Asset deleted");
      setDeleting(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
      setDeleting(null);
    }
  }

  return (
    <div>
      <AdminHeader
        title="Media"
        subtitle="Project screenshots, cover images, avatars and lab visuals. Uploads are validated and optimized to WebP."
        action={
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              multiple
              className="sr-only"
              id="media-page-upload"
              onChange={(e) => upload(e.target.files)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-11 items-center gap-2 rounded-full bg-[#111111] px-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF] disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Upload className="h-3.5 w-3.5" aria-hidden />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </>
        }
      />

      {loading ? (
        <ListSkeleton rows={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !assets.length ? (
        <EmptyState
          title="No assets yet"
          description="Upload images for project covers, screenshots, avatars and lab visuals."
          action={
            <button
              onClick={() => fileRef.current?.click()}
              className="h-11 rounded-full bg-[#111111] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5F3EE] hover:bg-[#4D6BFF]"
            >
              Upload image
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <figure
              key={asset.id}
              className="group overflow-hidden rounded-xl border border-[#11111114] bg-white"
            >
              <div className="relative aspect-[4/3] bg-[#F5F3EE]">
                <Image
                  src={asset.url}
                  alt={asset.originalName}
                  fill
                  sizes="(max-width: 640px) 46vw, 220px"
                  className="object-cover"
                />
              </div>
              <figcaption className="space-y-1 border-t border-[#1111110f] p-3">
                <p className="truncate text-[11.5px] font-medium" title={asset.originalName}>
                  {asset.originalName}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#999999]">
                  {asset.width}×{asset.height} · {formatBytes(asset.size)}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => copyUrl(asset.url)}
                    className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1111111f] font-mono text-[9px] uppercase tracking-[0.14em] text-[#555555] transition-colors hover:border-[#111111] hover:text-[#111111]"
                  >
                    {copied === asset.url ? (
                      <>
                        <Check className="h-3 w-3 text-[#1d7c44]" aria-hidden /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden /> Copy URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleting(asset)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1111111f] text-[#777777] transition-colors hover:border-[#c0392b] hover:text-[#c0392b]"
                    aria-label={`Delete ${asset.originalName}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl border-[#11111114] bg-[#F5F3EE]">
          <AlertDialogHeader>
            <AlertDialogTitle className="h-editorial text-xl">
              Delete “{deleting?.originalName}”?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-relaxed text-[#555555]">
              This action cannot be undone. Assets currently used by portfolio content
              cannot be deleted until they are removed there first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-2">
            <AlertDialogCancel className="h-11 rounded-full border-[#11111126] bg-transparent font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={remove}
              className="h-11 rounded-full bg-[#c0392b] font-mono text-[10px] uppercase tracking-[0.18em] text-white hover:bg-[#a53125]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
