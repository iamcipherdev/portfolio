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
import { TestimonialEditor } from "@/components/admin/testimonial-editor";
import { useAdminData, apiSend, type AdminTestimonial } from "@/components/admin/shared";
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

export default function AdminTestimonialsPage() {
  const { data, loading, error, refetch, setData } = useAdminData<{ testimonials: AdminTestimonial[] }>(
    "/api/admin/testimonials"
  );
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [deleting, setDeleting] = useState<AdminTestimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const testimonials = data?.testimonials ?? [];
  const filtered = testimonials.filter((t) =>
    `${t.clientLabel} ${t.role} ${t.quote} ${t.relatedProject}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  async function save(formData: unknown) {
    setSaving(true);
    try {
      if (editing) {
        await apiSend(`/api/admin/testimonials/${editing.id}`, "PATCH", formData);
        toast.success("Testimonial updated");
      } else {
        await apiSend("/api/admin/testimonials", "POST", formData);
        toast.success("Testimonial added");
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
      await apiSend(`/api/admin/testimonials/${deleting.id}`, "DELETE");
      toast.success("Testimonial deleted");
      setDeleting(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  async function togglePublished(t: AdminTestimonial, published: boolean) {
    setBusyId(t.id);
    try {
      await apiSend(`/api/admin/testimonials/${t.id}`, "PATCH", { published });
      toast.success(published ? "Published" : "Hidden");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function reorder(next: AdminTestimonial[]) {
    setData((prev) => (prev ? { ...prev, testimonials: next } : prev));
    try {
      await apiSend("/api/admin/testimonials/reorder", "POST", { ids: next.map((t) => t.id) });
      toast.success("Order saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed.");
      refetch();
    }
  }

  return (
    <div>
      <AdminHeader
        title="Testimonials"
        subtitle="Client notes shown in the public section. The current entries are anonymous reconstructed samples — replace each one with a genuine quote and mark it VERIFIED."
        action={
          <button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#111111] px-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add testimonial
          </button>
        }
      />

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search testimonials…"
          className={`${inputCls} pl-10`}
          aria-label="Search testimonials"
        />
      </div>

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !testimonials.length ? (
        <EmptyState
          title="No testimonials"
          description="Add client feedback here — it appears in the public testimonials section."
          action={
            <button
              onClick={() => {
                setEditing(null);
                setEditorOpen(true);
              }}
              className="h-11 rounded-full bg-[#111111] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F5F3EE] hover:bg-[#4D6BFF]"
            >
              Add testimonial
            </button>
          }
        />
      ) : !filtered.length ? (
        <EmptyState title="No matches" description={`Nothing matches “${query}”.`} />
      ) : (
        <SortableList
          items={filtered}
          onReorder={reorder}
          renderItem={(t, _i, dragHandle) => (
            <article
              className={`rounded-xl border bg-white ${
                t.published
                  ? "border-[#11111114]"
                  : "border-dashed border-[#11111126] opacity-75"
              }`}
            >
              <div className="flex items-start gap-2 p-4 sm:gap-4 sm:p-5">
                {dragHandle}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h2 className="text-[13px] font-semibold tracking-[0.02em]">{t.clientLabel}</h2>
                    <AdminBadge label={t.status} />
                    {t.relatedProject ? (
                      <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-[#aaaaaa] sm:inline">
                        {t.relatedProject}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] italic leading-relaxed text-[#555555]">
                    “{t.quote}”
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#999999]">
                    {t.role}
                    {t.dateLabel ? ` · ${t.dateLabel}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <div className="mr-1 hidden items-center gap-2 sm:flex">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#999999]">
                      {t.published ? "Live" : "Hidden"}
                    </span>
                    <Switch
                      checked={t.published}
                      disabled={busyId === t.id}
                      onCheckedChange={(v) => togglePublished(t, v)}
                      aria-label={`Publish testimonial from ${t.clientLabel}`}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditing(t);
                      setEditorOpen(true);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#111111]"
                    aria-label={`Edit testimonial from ${t.clientLabel}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(t)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#c0392b10] hover:text-[#c0392b]"
                    aria-label={`Delete testimonial from ${t.clientLabel}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#1111110f] px-4 py-2.5 sm:hidden">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#999999]">
                  {t.published ? "Published" : "Hidden"}
                </span>
                <Switch
                  checked={t.published}
                  disabled={busyId === t.id}
                  onCheckedChange={(v) => togglePublished(t, v)}
                  aria-label={`Publish testimonial from ${t.clientLabel}`}
                />
              </div>
            </article>
          )}
        />
      )}

      <TestimonialEditor
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
              Delete this testimonial?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-relaxed text-[#555555]">
              Feedback from “{deleting?.clientLabel}” will be removed from the public
              section. This action cannot be undone.
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
