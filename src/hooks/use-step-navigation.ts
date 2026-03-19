import { useState, useCallback } from 'react';

export type Step = 'workspace' | 'upload' | 'review';

const STEP_ORDER: Step[] = ['workspace', 'upload', 'review'];

export function useStepNavigation(initialStep: Step = 'workspace') {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  const completeAndNext = useCallback(() => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    const nextIndex = currentIndex + 1;
    const nextStep = STEP_ORDER[nextIndex];
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  }, [currentStep, currentIndex]);

  const goBack = useCallback(() => {
    const prevIndex = currentIndex - 1;
    const prevStep = STEP_ORDER[prevIndex];
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  }, [currentIndex]);

  const reset = useCallback(() => {
    setCurrentStep('workspace');
    setCompletedSteps(new Set());
  }, []);

  return {
    currentStep,
    completedSteps,
    steps: STEP_ORDER,
    currentIndex,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === STEP_ORDER.length - 1,
    goToStep,
    completeAndNext,
    goBack,
    reset,
  };
}
