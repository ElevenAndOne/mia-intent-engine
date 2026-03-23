import { Button } from '../../../components/button';
import { Card } from '../../../components/card';
import { Loader } from '../../../components/loader';
import { StatusMessage } from '../../../components/status-message';

type LoginViewProps = {
  isLoading: boolean;
  error: string | null;
  onSignIn: () => void;
};

export function LoginView({ isLoading, error, onSignIn }: LoginViewProps) {
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
            <Button onClick={onSignIn} className="w-full max-w-xs">
              Continue with Google
            </Button>
            {error && <StatusMessage variant="error" message={error} />}
          </div>
        )}
      </Card>
    </div>
  );
}
