import { useTranslation } from 'react-i18next';
import { useJobStore } from '@/stores/jobStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function JobsPage() {
  const { t } = useTranslation();
  const { jobs, retryJob } = useJobStore();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{t('jobs.title')}</h2>

      <div className="space-y-3">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{job.id}</span>
                  <Badge variant={getStatusVariant(job.status)}>
                    {t(`jobs.${job.status}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(job.createdAt).toLocaleString()}
                </p>
              </div>
              {job.status === 'failed' && (
                <Button variant="outline" onClick={() => retryJob(job.id)}>
                  {t('jobs.retry')}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
