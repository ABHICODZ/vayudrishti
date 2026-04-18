/**
 * Production-grade API client with:
 * - Automatic retries (max 2)
 * - Request timeouts
 * - Debug logging
 * - Error handling
 * - Loading state tracking
 */

import { debugLog } from '../components/DebugPanel';

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  skipDebugLog?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  duration: number;
  metadata?: any;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout = 30000; // 30s
  private defaultRetries = 2;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an API request with retry logic and timeout
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      skipDebugLog = false,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const startTime = performance.now();

    if (!skipDebugLog) {
      debugLog.request(endpoint, fetchOptions.body);
    }

    let lastError: any = null;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const duration = Math.round(performance.now() - startTime);
        const data = await response.json();

        if (!skipDebugLog) {
          debugLog.response(endpoint, response.status, duration, data);
        }

        if (!response.ok) {
          return {
            data: null,
            error: data.detail || data.message || `HTTP ${response.status}`,
            status: response.status,
            duration,
            metadata: data.metadata,
          };
        }

        return {
          data: data.data || data,
          error: null,
          status: response.status,
          duration,
          metadata: data.metadata,
        };
      } catch (error: any) {
        lastError = error;

        if (error.name === 'AbortError') {
          lastError = new Error(`Request timeout after ${timeout}ms`);
        }

        // Don't retry on timeout or if it's the last attempt
        if (error.name === 'AbortError' || attempt === retries) {
          break;
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        attempt++;
      }
    }

    const duration = Math.round(performance.now() - startTime);

    if (!skipDebugLog) {
      debugLog.error(endpoint, lastError);
    }

    return {
      data: null,
      error: lastError?.message || 'Request failed',
      status: 0,
      duration,
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', {
        timeout: 5000,
        retries: 0,
        skipDebugLog: true,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse, RequestOptions };
