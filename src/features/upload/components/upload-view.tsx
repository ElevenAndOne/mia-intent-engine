import { Card } from '../../../components/card';
import { Button } from '../../../components/button';
import { Loader } from '../../../components/loader';
import { StatusMessage } from '../../../components/status-message';
import { FileDropzone } from '../../../components/file-dropzone';
import type { ParsedCampaign } from '../../../types/campaign';
import type { ParseResponse } from '../types';

type UploadViewProps = {
  file: File | null;
  isUploading: boolean;
  error: string | null;
  parsedData: ParsedCampaign | null;
  parseMessage?: string | null;
  parseSource?: ParseResponse['source'];
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  onContinue: () => void;
  onReset: () => void;
};

export function UploadView({ file, isUploading, error, parsedData, parseMessage, parseSource, onFileSelect, onUpload, onContinue, onReset }: UploadViewProps) {
  if (isUploading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Loader label="Parsing campaign brief..." size="lg" />
      </Card>
    );
  }

  if (parsedData) {
    return (
      <Card>
        <div className="flex flex-col gap-4">
          <StatusMessage
            variant="success"
            title="Campaign parsed successfully"
            message={`${parsedData.campaign.campaign_name} \u2014 ${parsedData.campaign.client_name} \u2014 ${parsedData.phases.length} phases`}
          />
          {parseSource === 'sample' && parseMessage && (
            <StatusMessage
              variant="warning"
              message={parseMessage}
            />
          )}
          <div className="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Client</p>
              <p>{parsedData.campaign.client_name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Dates</p>
              <p>{parsedData.campaign.start_date} to {parsedData.campaign.end_date}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Budget</p>
              <p>{parsedData.campaign.budget_currency} {parsedData.campaign.budget_total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Phase Count</p>
              <p>{parsedData.phases.length}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onContinue}>Review Data</Button>
            <Button variant="secondary" onClick={onReset}>Upload Different File</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Upload Campaign Brief</h2>
      <p className="mb-6 text-sm text-gray-500">
        Upload a PDF campaign brief to parse and import into MIA.
      </p>
      <div className="flex flex-col gap-4">
        <FileDropzone
          accept=".pdf,application/pdf"
          onFileSelect={onFileSelect}
          label="Drop your campaign brief here"
          hint="PDF files only"
        />
        {file && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-700">{file.name}</span>
            <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}
        {error && <StatusMessage variant="error" message={error} />}
        <Button onClick={onUpload} disabled={!file}>
          Upload & Parse
        </Button>
      </div>
    </Card>
  );
}
