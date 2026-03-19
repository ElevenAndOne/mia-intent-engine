import { type ChangeEvent } from 'react';
import { Card } from '../../../components/card';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import { Loader } from '../../../components/loader';
import { StatusMessage } from '../../../components/status-message';
import { PhaseEditor } from './phase-editor';
import type { ParsedCampaign, Campaign, Phase, Kpi } from '../../../types/campaign';

type ReviewViewProps = {
  data: ParsedCampaign;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  onUpdateCampaign: (field: keyof Campaign, value: string | number) => void;
  onUpdatePhase: (phaseIndex: number, field: keyof Phase, value: string | number) => void;
  onUpdateKpi: (phaseIndex: number, kpiIndex: number, field: keyof Kpi, value: string | number) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function ReviewView({ data, isSubmitting, isSubmitted, error, onUpdateCampaign, onUpdatePhase, onUpdateKpi, onSubmit, onBack }: ReviewViewProps) {
  if (isSubmitted) {
    return (
      <Card className="text-center">
        <StatusMessage
          variant="success"
          title="Campaign submitted"
          message="Your campaign data has been submitted successfully."
        />
        <Button variant="secondary" onClick={onBack} className="mt-4">
          Upload Another
        </Button>
      </Card>
    );
  }

  const handleStringChange = (field: keyof Campaign) => (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateCampaign(field, e.target.value);
  };

  const handleNumberChange = (field: keyof Campaign) => (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateCampaign(field, Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Campaign Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Campaign Name" value={data.campaign.campaign_name} onChange={handleStringChange('campaign_name')} />
          <Input label="Client Name" value={data.campaign.client_name} onChange={handleStringChange('client_name')} />
          <Input label="Start Date" type="date" value={data.campaign.start_date} onChange={handleStringChange('start_date')} />
          <Input label="End Date" type="date" value={data.campaign.end_date} onChange={handleStringChange('end_date')} />
          <Input label="Total Budget" type="number" value={data.campaign.budget_total} onChange={handleNumberChange('budget_total')} />
          <Input label="Monthly Budget" type="number" value={data.campaign.budget_monthly} onChange={handleNumberChange('budget_monthly')} />
          <Input label="Currency" value={data.campaign.budget_currency} onChange={handleStringChange('budget_currency')} />
          <Input label="Status" value={data.campaign.status} onChange={handleStringChange('status')} />
        </div>
      </Card>

      {data.campaign.channels.length > 0 && (
        <Card>
          <h3 className="mb-2 text-sm font-medium text-gray-700">Channels</h3>
          <div className="flex flex-wrap gap-2">
            {data.campaign.channels.map(channel => (
              <span key={channel} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {channel.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Phases ({data.phases.length})
        </h2>
        {data.phases.map((phase, index) => (
          <PhaseEditor
            key={phase.sort_order}
            phase={phase}
            phaseIndex={index}
            onUpdatePhase={onUpdatePhase}
            onUpdateKpi={onUpdateKpi}
          />
        ))}
      </div>

      {error && <StatusMessage variant="error" message={error} />}

      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Campaign'}
        </Button>
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
      </div>

      {isSubmitting && <Loader label="Submitting campaign..." />}
    </div>
  );
}
