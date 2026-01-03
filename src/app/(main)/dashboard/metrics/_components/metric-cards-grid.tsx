"use client";

import { useEffect, useState } from "react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import type { MetricCardData } from "@/lib/analytics-types";

import { MetricCard } from "./metric-card";

interface MetricCardsGridProps {
  cards: MetricCardData[];
  isEditMode: boolean;
}

export function MetricCardsGrid({ cards: initialCards, isEditMode }: MetricCardsGridProps) {
  const [cards, setCards] = useState(initialCards);

  // Sync cards state when initialCards changes (e.g., due to currency filter)
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <MetricCard key={card.id} card={card} isEditMode={isEditMode} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
