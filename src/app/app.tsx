import { useEffect } from 'react';
import { AuthProvider, useAuthContext } from '../contexts/auth-context';
import { LoginView } from '../features/auth/components/login-view';
import { useGoogleSignIn } from '../features/auth/hooks/use-google-sign-in';
import { useStepNavigation } from '../hooks/use-step-navigation';
import { useWorkspaces } from '../features/workspace/hooks/use-workspaces';
import { useFileUpload } from '../features/upload/hooks/use-file-upload';
import { useReview } from '../features/review/hooks/use-review';
import { Stepper } from '../components/stepper';
import { Button } from '../components/button';
import { StatusMessage } from '../components/status-message';
import { WorkspacePicker } from '../features/workspace/components/workspace-picker';
import { UploadView } from '../features/upload/components/upload-view';
import { ReviewView } from '../features/review/components/review-view';
import type { ParsedCampaign } from '../types/campaign';

type ReviewStepProps = {
  initialData: ParsedCampaign;
  tenantId: string;
  filename: string;
  parseMessage: string | null;
  parseSource: 'live' | 'sample' | undefined;
  onBack: () => void;
};

const STEP_CONFIG = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'upload', label: 'Upload' },
  { id: 'review', label: 'Review' },
];

function ReviewStep({ initialData, tenantId, filename, parseMessage, parseSource, onBack }: ReviewStepProps) {
  const review = useReview(initialData, tenantId, filename);

  return (
    <ReviewView
      data={review.data}
      isSubmitting={review.isSubmitting}
      isSubmitted={review.isSubmitted}
      error={review.error}
      parseMessage={parseMessage}
      parseSource={parseSource}
      submissionResult={review.submissionResult}
      onUpdateCampaign={review.updateCampaignField}
      onUpdatePhase={review.updatePhaseField}
      onUpdateKpi={review.updateKpi}
      onSubmit={review.submit}
      onBack={onBack}
    />
  );
}

function AppContent() {
  const auth = useAuthContext();
  const googleSignIn = useGoogleSignIn(auth.login);
  const steps = useStepNavigation();
  const workspaces = useWorkspaces(auth.sessionId);
  const upload = useFileUpload(workspaces.selectedWorkspace?.tenant_id ?? '');
  const parseResult = upload.parseResult;

  if (!auth.isAuthenticated) {
    return (
      <LoginView
        buttonRef={googleSignIn.buttonRef}
        isGoogleReady={googleSignIn.isReady}
        isLoading={auth.isLoading}
        error={auth.error ?? googleSignIn.error}
      />
    );
  }

  const handleWorkspaceConfirm = () => {
    if (workspaces.selectedWorkspace) steps.completeAndNext();
  };

  const handleReviewBack = () => {
    steps.goBack();
  };

  useEffect(() => {
    if (steps.currentStep === 'upload' && upload.parsedData) {
      steps.completeAndNext();
    }
  }, [steps, upload.parsedData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">MIA Intent Engine</h1>
          <div className="flex items-center gap-4">
            <Stepper steps={STEP_CONFIG} currentIndex={steps.currentIndex} completedSteps={steps.completedSteps} />
            <Button variant="ghost" size="sm" onClick={auth.logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        {steps.currentStep === 'workspace' && (
          <WorkspacePicker
            workspaces={workspaces.workspaces}
            selectedWorkspace={workspaces.selectedWorkspace}
            isLoading={workspaces.isLoading}
            error={workspaces.error}
            onSelect={workspaces.selectWorkspace}
            onConfirm={handleWorkspaceConfirm}
          />
        )}

        {steps.currentStep === 'upload' && (
          <UploadView
            file={upload.file}
            isUploading={upload.isUploading}
            error={upload.error}
            onFileSelect={upload.selectFile}
            onUpload={upload.upload}
            onReset={upload.reset}
          />
        )}

        {steps.currentStep === 'review' && upload.parsedData && parseResult && (
          <ReviewStep
            initialData={upload.parsedData}
            tenantId={parseResult.tenant_id}
            filename={parseResult.filename}
            parseMessage={parseResult.message ?? null}
            parseSource={parseResult.source}
            onBack={handleReviewBack}
          />
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
