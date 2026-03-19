import type { RefObject } from 'react';
import { Card } from '../../../components/card';
import { Loader } from '../../../components/loader';
import { StatusMessage } from '../../../components/status-message';

type LoginViewProps = {
  buttonRef: RefObject<HTMLDivElement | null>;
  isGoogleReady: boolean;
  isLoading: boolean;
  error: string | null;
};

export function LoginView({ buttonRef, isGoogleReady, isLoading, error }: LoginViewProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">MIA Intent Engine</h1>
        <p className="mb-8 text-sm text-gray-500">
          Sign in with Google to upload and manage campaign briefs.
        </p>
        {isLoading ? (
          <Loader label="Signing in..." />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`flex min-h-11 w-full max-w-xs items-center justify-center ${isGoogleReady ? '' : 'rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500'}`}>
              <div ref={buttonRef} className={isGoogleReady ? '' : 'hidden'} />
              {!isGoogleReady && <span>Loading Google Sign-In...</span>}
            </div>
            {error && <StatusMessage variant="error" message={error} />}
          </div>
        )}
      </Card>
    </div>
  );
}
