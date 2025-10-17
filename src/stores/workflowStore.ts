import { create } from 'zustand';

export type StepKind = 'extract' | 'transform' | 'load';

export interface WorkflowStep {
  id: string;
  kind: StepKind;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  lastRun?: string;
}

interface WorkflowState {
  workflows: Workflow[];
  createWorkflow: (name: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [
    {
      id: '1',
      name: 'Data Pipeline 1',
      steps: [
        { id: 's1', kind: 'extract', config: {} },
        { id: 's2', kind: 'transform', config: {} },
        { id: 's3', kind: 'load', config: {} },
      ],
      lastRun: '2025-10-01T10:30:00Z',
    },
  ],
  createWorkflow: (name) =>
    set((state) => ({
      workflows: [
        ...state.workflows,
        {
          id: Date.now().toString(),
          name,
          steps: [],
        },
      ],
    })),
}));
