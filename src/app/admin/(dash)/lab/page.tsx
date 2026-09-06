"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import {
  AdminHeader,
  EmptyState,
  ErrorState,
  ListSkeleton,
  AdminBadge,
  inputCls,
} from "@/components/admin/bits";
import { SortableList } from "@/components/admin/sortable";
import { LabEditor } from "@/components/admin/lab-editor";
import { useAdminData, apiSend, type AdminLab } from "@/components/admin/shared";
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

export default function AdminLabPage() {
  const { data, loading, error, refetch, setData } = useAdminData<{ experiments: AdminLab[] }>(
    "/api/admin/lab"
  );
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminLab | null>(null);
  const [deleting, setDeleting] = useState<AdminLab | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const experiments = data?.experiments ?? [];
  const filtered = experiments.filter((l) =>
    `${l.experimentId} ${l.title} ${l.tags} ${l.status}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  async function save(formData: unknown) {
    setSaving(true);
    try {
      if (editing) {
        await apiSend(`/api/admin/lab/${editing.id}`, "PATCH", formData);
        toast.success("Experiment updated");
      } else {
        await apiSend("/api/admin/lab", "POST", formData);
        toast.success("Experiment added");
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
      await apiSend(`/api/admin/lab/${deleting.id}`, "DELETE");
      toast.success(`Deleted ${deleting.experimentId}`);
      setDeleting(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  async function togglePublished(l: AdminLab, published: boolean) {
    setBusyId(l.id);
    try {
      await apiSend(`/api/admin/lab/${l.id}`, "PATCH", { published });
      toast.success(published ? "Published" : "Hidden");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function reorder(next: AdminLab[]) {
    setData((prev) => (prev ? { ...prev, experiments: next } : prev));
    try {
      await apiSend("/api/admin/lab/reorder", "POST", { ids: next.map((l) => l.id) });
      toast.success("Order saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed.");
      refetch();
    }
  }

  return (
    <div>
      <AdminHeader
        title="Lab"
        subtitle="Experiments, research and ideas in progress — shown in The Lab section as explicitly unfinished work."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#111111] px-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add experiment
          </button>
        }
      />

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search experiments…"
          className={`${inputCls} pl-10`}
          aria-label="Search experiments"
        />
      </div>

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !experiments.length ? (
        <EmptyState
          title="The Lab is empty"
          description="Add an experiment you're exploring, researching or building — it shows up in The Lab with a status dot."
          action={
            <button
              onClick={() => {
                setEditing(null);
                setEditorOpen(true);
              }}
              className="h-11 rounded-full bg-[#111111] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5F3EE] hover:bg-[#4D6BFF]"
            >
              Add experiment
            </button>
          }
        />
      ) : !filtered.length ? (
        <EmptyState title="No matches" description={`Nothing matches “${query}”.`} />
      ) : (
        <SortableList
          items={filtered}
          onReorder={reorder}
          renderItem={(l, _i, dragHandle) => (
            <article
              className={`rounded-xl border bg-white ${
                l.published
                  ? "border-[#11111114]"
                  : "border-dashed border-[#11111126] opacity-75"
              }`}
            >
              <div className="flex items-center gap-2 p-4 sm:gap-4 sm:p-5">
                {dragHandle}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4D6BFF]">
                      {l.experimentId}
                    </span>
                    <h2 className="truncate text-[14.5px] font-semibold tracking-[-0.01em]">
                      {l.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[12.5px] text-[#777777]">{l.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <AdminBadge label={l.status} />
                    {l.dateLabel ? (
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#aaaaaa]">
                        {l.dateLabel}
                      </span>
                    ) : null}
                    {!l.published ? <AdminBadge label="DRAFT" /> : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <div className="mr-1 hidden items-center gap-2 sm:flex">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#999999]">
                      {l.published ? "Live" : "Hidden"}
                    </span>
                    <Switch
                      checked={l.published}
                      disabled={busyId === l.id}
                      onCheckedChange={(v) => togglePublished(l, v)}
                      aria-label={`Publish ${l.title}`}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditing(l);
                      setEditorOpen(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#111111]"
                    aria-label={`Edit ${l.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(l)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#c0392b10] hover:text-[#c0392b]"
                    aria-label={`Delete ${l.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#1111110f] px-4 py-2.5 sm:hidden">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#999999]">
                  {l.published ? "Published" : "Hidden"}
                </span>
                <Switch
                  checked={l.published}
                  disabled={busyId === l.id}
                  onCheckedChange={(v) => togglePublished(l, v)}
                  aria-label={`Publish ${l.title}`}
                />
              </div>
            </article>
          )}
        />
      )}

      <LabEditor
        open={editorOpen}
        onOpenChange={(v) => {
          setEditorOpen(v);
          if (!v) setEditing(null);
        }}
        initial={editing}
        onSave={save}
        saving={saving}
      />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl border-[#11111114] bg-[#F5F3EE]">
          <AlertDialogHeader>
            <AlertDialogTitle className="h-editorial text-xl">
              Delete {deleting?.experimentId}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-relaxed text-[#555555]">
              “{deleting?.title}” will be removed from The Lab. This action cannot be
              undone.
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
