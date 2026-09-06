"use client";

import type { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── One sortable row ───────────────────────── */
function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragHandleProps: Record<string, unknown>) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 30 : undefined,
        position: isDragging ? "relative" : undefined,
        opacity: isDragging ? 0.9 : undefined,
      }}
    >
      {children({
        ...attributes,
        ...listeners,
        style: { touchAction: "none" },
        className: cn(
          "flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#555555] active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        ),
        "aria-label": "Drag to reorder",
        title: "Drag to reorder",
      })}
    </div>
  );
}

/**
 * Fully-controlled vertical sortable list — drag-and-drop
 * (pointer + keyboard) plus up/down buttons as fallback.
 * The parent owns `items`; onReorder receives the new array.
 */
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  itemKey,
}: {
  items: T[];
  onReorder: (nextItems: T[]) => void | Promise<void>;
  renderItem: (item: T, index: number, dragHandle: ReactNode) => ReactNode;
  itemKey?: (item: T) => string;
}) {
  const keyOf = itemKey ?? ((i: T) => i.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => keyOf(i) === active.id);
    const newIndex = items.findIndex((i) => keyOf(i) === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    void onReorder(arrayMove(items, oldIndex, newIndex));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    void onReorder(arrayMove(items, index, target));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items.map(keyOf)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item, index) => (
            <SortableRow key={keyOf(item)} id={keyOf(item)}>
              {(handleProps) =>
                renderItem(
                  item,
                  index,
                  <>
                    <div className="hidden flex-col sm:flex">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="flex h-5 w-7 items-center justify-center rounded text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#111111] disabled:opacity-30"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label="Move down"
                        className="flex h-5 w-7 items-center justify-center rounded text-[#aaaaaa] transition-colors hover:bg-[#F5F3EE] hover:text-[#111111] disabled:opacity-30"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button type="button" {...handleProps}>
                      <GripVertical className="h-4 w-4" aria-hidden />
                    </button>
                  </>
                )
              }
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
