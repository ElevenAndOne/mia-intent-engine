import { useCallback, useEffect, useRef, useState } from 'react';

type UseGoogleSignInResult = {
  buttonRef: React.RefObject<HTMLDivElement | null>;
  error: string | null;
  isReady: boolean;
};

const GOOGLE_SCRIPT_SELECTOR = 'script[src*="accounts.google.com/gsi/client"]';

export function useGoogleSignIn(onCredential: (idToken: string) => void): UseGoogleSignInResult {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isInitializedRef = useRef(false);

  const handleCredentialResponse = useCallback(
    (response: GoogleCredentialResponse) => {
      setError(null);
      onCredential(response.credential);
    },
    [onCredential],
  );

  const initializeGoogle = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError('Google sign-in is not configured.');
      return;
    }

    if (typeof google === 'undefined' || isInitializedRef.current || !buttonRef.current) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 320,
    });

    isInitializedRef.current = true;
    setError(null);
    setIsReady(true);
  }, [handleCredentialResponse]);

  useEffect(() => {
    const script = document.querySelector<HTMLScriptElement>(GOOGLE_SCRIPT_SELECTOR);

    if (typeof google !== 'undefined') {
      initializeGoogle();
      return;
    }

    if (!script) {
      setError('Google sign-in is unavailable right now.');
      return;
    }

    const handleScriptError = () => {
      setError('Google sign-in failed to load.');
    };

    script.addEventListener('load', initializeGoogle);
    script.addEventListener('error', handleScriptError);

    return () => {
      script.removeEventListener('load', initializeGoogle);
      script.removeEventListener('error', handleScriptError);
    };
  }, [initializeGoogle]);

  return { buttonRef, error, isReady };
}
