import { Card } from '../../../components/card';
import { Button } from '../../../components/button';
import { Loader } from '../../../components/loader';
import { StatusMessage } from '../../../components/status-message';
import { FileDropzone } from '../../../components/file-dropzone';

type UploadViewProps = {
  file: File | null;
  isUploading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  onReset: () => void;
};

export function UploadView({ file, isUploading, error, onFileSelect, onUpload, onReset }: UploadViewProps) {
  if (isUploading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Loader label="Parsing campaign brief..." size="lg" />
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
