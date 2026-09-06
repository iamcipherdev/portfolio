"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, ExternalLink, Star } from "lucide-react";
import {
  AdminHeader,
  EmptyState,
  ErrorState,
  ListSkeleton,
  AdminBadge,
  inputCls,
} from "@/components/admin/bits";
import { SortableList } from "@/components/admin/sortable";
import { ProjectEditor } from "@/components/admin/project-editor";
import {
  useAdminData,
  apiSend,
  type AdminProject,
} from "@/components/admin/shared";
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
import { Switch } from "@/components/ui/switch";

export default function AdminProjectsPage() {
  const { data, loading, error, refetch, setData } = useAdminData<{ projects: AdminProject[] }>(
    "/api/admin/projects"
  );
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [deleting, setDeleting] = useState<AdminProject | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const projects = data?.projects ?? [];
  const filtered = projects.filter((p) =>
    `${p.name} ${p.category} ${p.technologies}`.toLowerCase().includes(query.toLowerCase())
  );

  async function save(formData: unknown) {
    setSaving(true);
    try {
      if (editing) {
        await apiSend(`/api/admin/projects/${editing.id}`, "PATCH", formData);
        toast.success("Project updated");
      } else {
        await apiSend("/api/admin/projects", "POST", formData);
        toast.success("Project created");
      }
      setEditorOpen(false);
      setEditing(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");

    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleting) return;
    try {
      await apiSend(`/api/admin/projects/${deleting.id}`, "DELETE");
      toast.success(`Deleted “${deleting.name}”`);
      setDeleting(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  async function togglePublished(p: AdminProject, published: boolean) {
    setBusyId(p.id);
    try {
      await apiSend(`/api/admin/projects/${p.id}`, "PATCH", { published });
      toast.success(published ? "Published" : "Moved to drafts");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(p: AdminProject, featured: boolean) {
    setBusyId(p.id);
    try {
      await apiSend(`/api/admin/projects/${p.id}`, "PATCH", { featured });
      toast.success(featured ? "Marked as featured" : "Removed featured mark");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function reorder(next: AdminProject[]) {
    /* optimistic — parent owns the order */
    setData((prev) => (prev ? { ...prev, projects: next } : prev));
    try {
      await apiSend("/api/admin/projects/reorder", "POST", {
        ids: next.map((p) => p.id),
      });
      toast.success("Order saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed.");
      refetch();
    }
  }

  return (
    <div>
      <AdminHeader
        title="Projects"
        subtitle="Selected Work on the public portfolio — shipped products, experiences and real-world client work."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#111111] px-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            New project
          </button>
        }
      />

      {/* search */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          className={`${inputCls} pl-10`}
          aria-label="Search projects"
        />
      </div>

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !projects.length ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project — it will appear in the Selected Work grid on the public site."
          action={
            <button
              onClick={() => {
                setEditing(null);
                setEditorOpen(true);
              }}
              className="h-11 rounded-full bg-[#111111] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5F3EE] hover:bg-[#4D6BFF]"
            >
              Create project
            </button>
          }
        />
      ) : !filtered.length ? (
        <EmptyState title="No matches" description={`Nothing matches “${query}”.`} />
      ) : (
        <SortableList
          items={filtered}
          onReorder={reorder}
          renderItem={(p, _i, dragHandle) => (
            <article
              className={`rounded-xl border bg-white transition-shadow ${
                p.published
                  ? "border-[#11111114] hover:shadow-[0_16px_40px_-24px_rgba(17,17,17,0.35)]"
                  : "border-dashed border-[#11111126] opacity-75"
              }`}
            >
              <div className="flex items-center gap-2 p-4 sm:gap-4 sm:p-5">
                {dragHandle}

                {/* thumb */}
                <div className="relative hidden h-14 w-[88px] shrink-0 overflow-hidden rounded-lg border border-[#1111110f] bg-[#F5F3EE] sm:block">
                  {p.coverImage ? (
                    <Image src={p.coverImage} alt="" fill sizes="88px" className="object-cover object-top" />
                  ) : (
                    <span className="flex h-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.14em] text-[#aaaaaa]">
                      Mockup
                    </span>
                  )}
                </div>

                {/* info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4D6BFF]">
                      {p.projectNumber || "—"}
                    </span>
                    <h2 className="truncate text-[14.5px] font-semibold tracking-[-0.01em]">{p.name}</h2>
                    {p.featured ? (
                      <Star className="h-3.5 w-3.5 fill-[#F5B83D] text-[#F5B83D]" aria-label="Featured" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[12.5px] text-[#777777]">{p.shortDescription}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <AdminBadge label={p.published ? p.status : "DRAFT"} />
                    {p.category ? <AdminBadge label={p.category.split("·")[0].trim()} tone="CONCEPT" /> : null}
                  </div>
                </div>

                {/* actions */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <div className="mr-1 hidden items-center gap-2 sm:flex">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#999999]">
                      {p.published ? "Live" : "Draft"}
                    </span>
                    <Switch
                      checked={p.published}
                      disabled={busyId === p.id}
                      onCheckedChange={(v) => togglePublished(p, v)}
                      aria-label={`Publish ${p.name}`}
                    />
                  </div>
                  <button
                    onClick={() => toggleFeatured(p, !p.featured)}
                    disabled={busyId === p.id}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      p.featured
                        ? "bg-[#F5B83D]/15 text-[#F5B83D]"
                        : "text-[#aaaaaa] hover:bg-[#F5F3EE] hover:text-[#F5B83D]"
                    }`}
                    aria-label={p.featured ? "Unfeature project" : "Feature project"}
                    title={p.featured ? "Unfeature" : "Feature"}
                  >
                    <Star className={`h-4 w-4 ${p.featured ? "fill-current" : ""}`} />
                  </button>
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#111111] sm:flex"
                      aria-label={`Open ${p.name} live site`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                  <button
                    onClick={() => {
                      setEditing(p);
                      setEditorOpen(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#111111]"
                    aria-label={`Edit ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(p)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#c0392b10] hover:text-[#c0392b]"
                    aria-label={`Delete ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* mobile publish row */}
              <div className="flex items-center justify-between border-t border-[#1111110f] px-4 py-2.5 sm:hidden">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#999999]">
                  {p.published ? "Published" : "Draft"}
                </span>
                <Switch
                  checked={p.published}
                  disabled={busyId === p.id}
                  onCheckedChange={(v) => togglePublished(p, v)}
                  aria-label={`Publish ${p.name}`}
                />
              </div>
            </article>
          )}
        />
      )}

      {/* editor */}
      <ProjectEditor
        open={editorOpen}
        onOpenChange={(v) => {
          setEditorOpen(v);
          if (!v) setEditing(null);
        }}
        initial={editing}
        onSave={save}
        saving={saving}
      />

      {/* delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl border-[#11111114] bg-[#F5F3EE]">
          <AlertDialogHeader>
            <AlertDialogTitle className="h-editorial text-xl">
              Delete “{deleting?.name}”?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-relaxed text-[#555555]">
              This action cannot be undone. The project will be removed from the public
              portfolio immediately.
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
