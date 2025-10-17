import { create } from 'zustand';

export type ConnectorType = 's3' | 'gdrive' | 'web' | 'database';
export type ConnectorStatus = 'connected' | 'pending';

export interface Connector {
  id: string;
  name: string;
  type: ConnectorType;
  status: ConnectorStatus;
}

interface ConnectorState {
  connectors: Connector[];
  createConnector: (name: string, type: ConnectorType) => void;
}

export const useConnectorStore = create<ConnectorState>((set) => ({
  connectors: [
    { id: '1', name: 'S3 Bucket', type: 's3', status: 'connected' },
    { id: '2', name: 'Google Drive', type: 'gdrive', status: 'pending' },
  ],
  createConnector: (name, type) =>
    set((state) => ({
      connectors: [
        ...state.connectors,
        {
          id: Date.now().toString(),
          name,
          type,
          status: 'pending',
        },
      ],
    })),
}));
