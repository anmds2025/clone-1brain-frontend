import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnectorStore, ConnectorType } from '@/stores/connectorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ConnectorsPage() {
  const { t } = useTranslation();
  const { connectors, createConnector } = useConnectorStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<ConnectorType>('s3');

  const handleCreate = () => {
    if (name.trim()) {
      createConnector(name, type);
      setName('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{t('connectors.title')}</h2>

      <Card className="p-4">
        <div className="flex gap-3">
          <Input
            placeholder={t('connectors.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
          <Select value={type} onValueChange={(v) => setType(v as ConnectorType)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="s3">S3</SelectItem>
              <SelectItem value="gdrive">Google Drive</SelectItem>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="database">Database</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreate}>{t('connectors.create')}</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {connectors.map((connector) => (
          <Card key={connector.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{connector.name}</h3>
                <p className="text-sm text-muted-foreground">{connector.type}</p>
              </div>
              <Badge variant={connector.status === 'connected' ? 'default' : 'secondary'}>
                {t(`connectors.${connector.status}`)}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
