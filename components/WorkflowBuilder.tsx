'use client';

import { useState } from 'react';
import { WorkflowStep, toolDetails } from './WorkflowStep';
import { ToolSelectionModal } from './ToolSelectionModal';
import { WorkflowStepState } from '@/lib/workflow-runner';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface WorkflowBuilderProps {
  steps: WorkflowStepState[];
  setSteps: React.Dispatch<React.SetStateAction<WorkflowStepState[]>>;
}

// A unique ID for each step
let nextId = 0;

export function WorkflowBuilder({ steps, setSteps }: WorkflowBuilderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTool = (toolId: string) => {
    const initialOptions = toolDetails[toolId]?.defaultOptions ? { ...toolDetails[toolId].defaultOptions } : {};
    setSteps([...steps, { id: nextId++, type: toolId, options: initialOptions }]); // Initialize options
    setIsModalOpen(false);
  };

  const handleOptionChange = (stepId: number, newOptions: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, options: newOptions } : step
    ));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-4">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={steps.map(step => step.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
              {steps.length > 0 ? (
                  steps.map(step => (
                      <WorkflowStep 
                          key={step.id} 
                          id={step.id} // Pass id for dnd-kit
                          step={step} 
                          onOptionChange={handleOptionChange} 
                      />
                  ))
              ) : (
                  <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                      <p className="text-gray-500">Click &ldquo;Add Step&rdquo; to begin building your workflow.</p>
                  </div>
              )}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
      >
        Add Step
      </button>

      <ToolSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
