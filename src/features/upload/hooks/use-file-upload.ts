import { useState, useCallback } from 'react';
import type { ParseResponse } from '../types';
import { uploadAndParse } from '../services/upload-service';

export function useFileUpload(tenantId: string, accountId: string) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null);

  const selectFile = useCallback((selectedFile: File) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF files are supported');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setParseResult(null);
  }, []);

  const upload = useCallback(async () => {
    if (!file) {
      return;
    }

    if (!accountId) {
      setError('Select an account before uploading a file.');
      return;
    }

    if (!tenantId) {
      setError('Your session is missing a tenant ID. Refresh the page or sign in again.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadAndParse(file, tenantId, accountId);
      setParseResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [accountId, file, tenantId]);

  const reset = useCallback(() => {
    setFile(null);
    setIsUploading(false);
    setError(null);
    setParseResult(null);
  }, []);

  return {
    file,
    isUploading,
    error,
    parseResult,
    parsedData: parseResult?.parsed_data ?? null,
    selectFile,
    upload,
    reset,
  };
}
