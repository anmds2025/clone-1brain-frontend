import { create } from 'zustand';

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface Job {
  id: string;
  workflowId: string;
  status: JobStatus;
  createdAt: string;
}

interface JobState {
  jobs: Job[];
  retryJob: (id: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [
    { id: '1', workflowId: '1', status: 'succeeded', createdAt: '2025-10-01T10:30:00Z' },
    { id: '2', workflowId: '1', status: 'running', createdAt: '2025-10-01T11:00:00Z' },
    { id: '3', workflowId: '1', status: 'failed', createdAt: '2025-10-01T11:30:00Z' },
  ],
  retryJob: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, status: 'queued' as JobStatus } : job
      ),
    })),
}));
