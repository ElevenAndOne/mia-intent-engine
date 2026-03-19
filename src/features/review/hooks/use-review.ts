import { useState, useCallback } from 'react';
import type { ParsedCampaign, Campaign, Phase, Kpi } from '../../../types/campaign';
import { submitCampaign } from '../services/submission-service';

export function useReview(initialData: ParsedCampaign, sessionId: string) {
  const [data, setData] = useState<ParsedCampaign>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCampaignField = useCallback((field: keyof Campaign, value: string | number) => {
    setData(prev => ({
      ...prev,
      campaign: { ...prev.campaign, [field]: value },
    }));
  }, []);

  const updatePhaseField = useCallback((phaseIndex: number, field: keyof Phase, value: string | number) => {
    setData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, i) =>
        i === phaseIndex ? { ...phase, [field]: value } : phase,
      ),
    }));
  }, []);

  const updateKpi = useCallback((phaseIndex: number, kpiIndex: number, field: keyof Kpi, value: string | number) => {
    setData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, pi) =>
        pi === phaseIndex
          ? {
              ...phase,
              kpis: phase.kpis.map((kpi, ki) =>
                ki === kpiIndex ? { ...kpi, [field]: value } : kpi,
              ),
            }
          : phase,
      ),
    }));
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitCampaign(data, sessionId);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [data, sessionId]);

  return { data, isSubmitting, isSubmitted, error, updateCampaignField, updatePhaseField, updateKpi, submit };
}
