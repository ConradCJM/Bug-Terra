/**
 * Custom hook for managing drag and drop state in the bug pipeline
 */

import { useState, useCallback } from "react";
import { ColumnStatus, DraggedBugData } from "@/types/dragDrop";

interface DragDropState {
  isDragging: boolean;
  draggingBugId: string | null;
  dragOverColumn: ColumnStatus | null;
}

export function useBugDragDrop() {
  const [dragState, setDragState] = useState<DragDropState>({
    isDragging: false,
    draggingBugId: null,
    dragOverColumn: null,
  });

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, bugData: DraggedBugData) => {
      e.dataTransfer.effectAllowed = "move";
      // Store bug data as JSON in dataTransfer
      e.dataTransfer.setData("application/json", JSON.stringify(bugData));

      setDragState({
        isDragging: true,
        draggingBugId: bugData.id,
        dragOverColumn: null,
      });
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>, columnStatus: ColumnStatus) => {
      e.preventDefault();

      setDragState((prev) => ({
        ...prev,
        dragOverColumn: columnStatus,
      }));
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>, columnStatus: ColumnStatus) => {
      // Only clear dragOverColumn if we're leaving the column entirely
      // (not moving to a child element)
      if (e.currentTarget === e.target) {
        setDragState((prev) =>
          prev.dragOverColumn === columnStatus
            ? { ...prev, dragOverColumn: null }
            : prev
        );
      }
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggingBugId: null,
      dragOverColumn: null,
    });
  }, []);

  const resetDragState = useCallback(() => {
    setDragState({
      isDragging: false,
      draggingBugId: null,
      dragOverColumn: null,
    });
  }, []);

  return {
    ...dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    resetDragState,
  };
}
