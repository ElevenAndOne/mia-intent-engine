import type { ParseResponse } from '../types';
import type { ParsedCampaign } from '../../../types/campaign';

const PARSER_URL = import.meta.env.VITE_PARSER_URL;
const PARSER_API_KEY = import.meta.env.VITE_PARSER_API_KEY;
const SAMPLE_PARSE_DATA_URL = '/dutoit_apple_pie_day.json';

function buildParsedData(parsedData: ParsedCampaign, fileName?: string): ParsedCampaign {
  return {
    ...parsedData,
    meta: {
      ...parsedData.meta,
      source_file: fileName || parsedData.meta.source_file,
    },
  };
}

function buildParseResponse(parsedData: ParsedCampaign, tenantId: string, accountId: string, source: 'sample', fileName?: string): ParseResponse {
  return {
    success: true,
    filename: fileName || parsedData.meta.source_file,
    tenant_id: tenantId,
    account_id: accountId,
    campaign_name: parsedData.campaign.campaign_name,
    client_name: parsedData.campaign.client_name,
    phases_count: parsedData.phases.length,
    parsed_data: buildParsedData(parsedData, fileName),
    source,
    message: 'Using the local Dutoit Apple Pie Day sample until the parser URL is configured.',
  };
}

function normalizeLiveParseResponse(result: ParseResponse, fileName: string): ParseResponse {
  return {
    ...result,
    filename: result.filename || fileName,
    parsed_data: buildParsedData(result.parsed_data, fileName),
    campaign_name: result.campaign_name || result.parsed_data.campaign.campaign_name,
    client_name: result.client_name || result.parsed_data.campaign.client_name,
    phases_count: result.phases_count || result.parsed_data.phases.length,
    source: 'live',
  };
}

async function loadSampleParseResponse(fileName: string, tenantId: string, accountId: string): Promise<ParseResponse> {
  const response = await fetch(SAMPLE_PARSE_DATA_URL);

  if (!response.ok) {
    throw new Error('Sample parse data is unavailable');
  }

  const parsedData = (await response.json()) as ParsedCampaign;
  return buildParseResponse(parsedData, tenantId, accountId, 'sample', fileName);
}

export async function uploadAndParse(file: File, tenantId: string, accountId: string): Promise<ParseResponse> {
  if (!PARSER_URL) {
    return loadSampleParseResponse(file.name, tenantId, accountId);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenant_id', tenantId);
  formData.append('account_id', accountId);

  const response = await fetch(`${PARSER_URL}/parse`, {
    method: 'POST',
    headers: {
      'X-API-Key': PARSER_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Upload failed');
    throw new Error(errorText);
  }

  const result = (await response.json()) as ParseResponse;
  return normalizeLiveParseResponse({ ...result, account_id: result.account_id ?? accountId }, file.name);
}
