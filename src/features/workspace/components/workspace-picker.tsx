import { type ChangeEvent } from 'react';
import { Card } from '../../../components/card';
import { SelectField } from '../../../components/select-field';
import { Button } from '../../../components/button';
import { Loader } from '../../../components/loader';
import { StatusMessage } from '../../../components/status-message';
import type { Workspace } from '../types';

type WorkspacePickerProps = {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  onSelect: (tenantId: string) => void;
  onConfirm: () => void;
};

export function WorkspacePicker({ workspaces, selectedWorkspace, isLoading, error, onSelect, onConfirm }: WorkspacePickerProps) {
  if (isLoading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Loader label="Loading workspaces..." />
      </Card>
    );
  }

  if (error) return <StatusMessage variant="error" message={error} />;

  const options = workspaces.map(w => ({
    value: w.tenant_id,
    label: `${w.name} (${w.role})`,
  }));

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Select Workspace</h2>
      <p className="mb-6 text-sm text-gray-500">
        Choose the workspace to upload your campaign brief to.
      </p>
      <div className="flex flex-col gap-4">
        <SelectField
          label="Workspace"
          options={options}
          value={selectedWorkspace?.tenant_id ?? ''}
          onChange={handleChange}
          placeholder="Select a workspace..."
        />
        <Button onClick={onConfirm} disabled={!selectedWorkspace}>
          Continue
        </Button>
      </div>
    </Card>
  );
}
