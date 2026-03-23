import { type ChangeEvent } from 'react';
import { Button } from '../../../components/button';
import { Card } from '../../../components/card';
import { Loader } from '../../../components/loader';
import { SelectField } from '../../../components/select-field';
import { StatusMessage } from '../../../components/status-message';
import type { Account } from '../types';

type AccountPickerProps = {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (accountId: string) => void;
  onConfirm: () => void;
};

export function AccountPicker({ accounts, selectedAccount, isLoading, error, onSelect, onConfirm }: AccountPickerProps) {
  if (isLoading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Loader label="Loading accounts..." />
      </Card>
    );
  }

  if (error) return <StatusMessage variant="error" message={error} />;

  const options = accounts.map(account => ({
    value: account.id,
    label: account.name,
  }));

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Select Account</h2>
      <p className="mb-6 text-sm text-gray-500">
        Choose the account to import this campaign into.
      </p>
      <div className="flex flex-col gap-4">
        <SelectField
          label="Account"
          options={options}
          value={selectedAccount?.id ?? ''}
          onChange={handleChange}
          placeholder="Select an account..."
        />
        <Button onClick={onConfirm} disabled={!selectedAccount}>
          Continue
        </Button>
      </div>
    </Card>
  );
}
