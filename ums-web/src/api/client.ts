import axios, { type AxiosInstance } from 'axios';
import { getConfig } from '../config/env';

let client: AxiosInstance | undefined;

export function getApiClient(): AxiosInstance {
  if (!client) {
    const { apiBaseUrl, apiTimeoutMs } = getConfig();
    client = axios.create({
      baseURL: apiBaseUrl,
      timeout: apiTimeoutMs,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return client;
}
