"use client";

import { useState } from "react";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import type { ChartData, CurrencyFilter } from "@/lib/analytics-types";

import { ChartCard } from "./chart-card";

interface ChartsGridProps {
  charts: ChartData[];
  isEditMode: boolean;
  currencyFilter: CurrencyFilter;
}

export function ChartsGrid({ charts: initialCharts, isEditMode, currencyFilter }: ChartsGridProps) {
  const [charts, setCharts] = useState(initialCharts);

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
      setCharts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={charts.map((chart) => chart.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
          {charts.map((chart) => (
            <ChartCard key={chart.id} chart={chart} isEditMode={isEditMode} currencyFilter={currencyFilter} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
