import { useState, type ChangeEvent } from 'react';
import { Card } from '../../../components/card';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import type { Phase, Kpi } from '../../../types/campaign';

type PhaseEditorProps = {
  phase: Phase;
  phaseIndex: number;
  onUpdatePhase: (phaseIndex: number, field: keyof Phase, value: string | number) => void;
  onUpdateKpi: (phaseIndex: number, kpiIndex: number, field: keyof Kpi, value: string | number) => void;
};

export function PhaseEditor({ phase, phaseIndex, onUpdatePhase, onUpdateKpi }: PhaseEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  const handleFieldChange = (field: 'phase_name' | 'objective' | 'strategy') => (e: ChangeEvent<HTMLInputElement>) => {
    onUpdatePhase(phaseIndex, field, e.target.value);
  };

  const handleKpiChange = (kpiIndex: number, field: keyof Kpi) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'target_numeric' ? Number(e.target.value) : e.target.value;
    onUpdateKpi(phaseIndex, kpiIndex, field, value);
  };

  return (
    <Card padding="sm">
      <Button
        variant="ghost"
        onClick={handleToggle}
        className="w-full justify-between rounded-none px-0 hover:bg-transparent"
      >
        <span>
          <span className="font-medium text-gray-900">{phase.phase_name}</span>
          <span className="ml-2 text-sm text-gray-500">
            {phase.channel_actions.length} channels, {phase.kpis.length} KPIs
          </span>
        </span>
        <span className="text-gray-400">{isExpanded ? '\u2212' : '+'}</span>
      </Button>

      {isExpanded && (
        <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4">
          <Input label="Phase Name" value={phase.phase_name} onChange={handleFieldChange('phase_name')} />
          <Input label="Objective" value={phase.objective} onChange={handleFieldChange('objective')} />
          <Input label="Strategy" value={phase.strategy} onChange={handleFieldChange('strategy')} />

          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700">KPIs</h4>
            <div className="mb-2 grid grid-cols-4 gap-2 text-xs font-medium text-gray-500">
              <span>KPI</span>
              <span>Target</span>
              <span>Value</span>
              <span>Unit</span>
            </div>
            {phase.kpis.map((kpi, kpiIndex) => (
              <div key={kpiIndex} className="mb-2 grid grid-cols-4 gap-2">
                <Input value={kpi.kpi_name} onChange={handleKpiChange(kpiIndex, 'kpi_name')} />
                <Input value={kpi.target_value} onChange={handleKpiChange(kpiIndex, 'target_value')} />
                <Input type="number" value={kpi.target_numeric} onChange={handleKpiChange(kpiIndex, 'target_numeric')} />
                <Input value={kpi.unit} onChange={handleKpiChange(kpiIndex, 'unit')} />
              </div>
            ))}
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Channels</h4>
            <div className="flex flex-col gap-2">
              {phase.channel_actions.map((action, actionIndex) => (
                <div key={actionIndex} className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {action.channel.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {action.assets.length} asset{action.assets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{action.objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
