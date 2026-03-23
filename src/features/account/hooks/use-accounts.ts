import { useCallback, useEffect, useState } from 'react';
import type { Account } from '../types';
import { fetchAccounts } from '../services/account-service';

export function useAccounts(sessionId: string | null) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setAccounts([]);
      setSelectedAccount(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchAccounts(sessionId)
      .then(data => {
        setAccounts(data.accounts);
        if (data.accounts.length === 1) {
          setSelectedAccount(data.accounts[0] ?? null);
        }
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load accounts'))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const selectAccount = useCallback((accountId: string) => {
    const account = accounts.find(item => item.id === accountId) ?? null;
    setSelectedAccount(account);
  }, [accounts]);

  return { accounts, selectedAccount, isLoading, error, selectAccount };
}
