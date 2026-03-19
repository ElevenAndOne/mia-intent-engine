import { useState, useCallback } from 'react';
import type { ParsedCampaign } from '../../../types/campaign';
import type { ParseResponse } from '../types';
import { uploadAndParse } from '../services/upload-service';

export function useFileUpload(tenantId: string, sessionId: string) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCampaign | null>(null);
  const [importResult, setImportResult] = useState<ParseResponse['mia_import'] | null>(null);
  const [parseMessage, setParseMessage] = useState<string | null>(null);
  const [parseSource, setParseSource] = useState<ParseResponse['source'] | undefined>(undefined);

  const selectFile = useCallback((selectedFile: File) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF files are supported');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setParsedData(null);
    setImportResult(null);
    setParseMessage(null);
    setParseSource(undefined);
  }, []);

  const upload = useCallback(async () => {
    if (!file || !tenantId || !sessionId) return;

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadAndParse(file, tenantId, sessionId);
      setParsedData(result.parsed_data);
      setImportResult(result.mia_import);
      setParseMessage(result.message ?? null);
      setParseSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [file, tenantId, sessionId]);

  const reset = useCallback(() => {
    setFile(null);
    setIsUploading(false);
    setError(null);
    setParsedData(null);
    setImportResult(null);
    setParseMessage(null);
    setParseSource(undefined);
  }, []);

  return { file, isUploading, error, parsedData, importResult, parseMessage, parseSource, selectFile, upload, reset };
}
