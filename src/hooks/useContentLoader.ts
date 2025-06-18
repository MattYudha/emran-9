import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { CompanyInfo, ServiceDetail, TeamMember, PortfolioItem } from '../types/content';

interface UseContentLoaderResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for loading content from Supabase
 */
export function useContentLoader<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
): UseContentLoaderResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err: any) {
      console.error('Error loading content:', err);
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for loading company information
 */
export function useCompanyInfo(): UseContentLoaderResult<CompanyInfo> {
  return useContentLoader(() => contentService.fetchCompanyInfo());
}

/**
 * Hook for loading service details
 */
export function useServiceDetail(serviceKey: string): UseContentLoaderResult<ServiceDetail> {
  return useContentLoader(
    () => contentService.fetchServiceDetail(serviceKey),
    [serviceKey]
  );
}

/**
 * Hook for loading all services
 */
export function useAllServices(): UseContentLoaderResult<ServiceDetail[]> {
  return useContentLoader(() => contentService.fetchAllServices());
}

/**
 * Hook for loading team members
 */
export function useTeamMembers(): UseContentLoaderResult<TeamMember[]> {
  return useContentLoader(() => contentService.fetchTeamMembers());
}

/**
 * Hook for loading portfolio items
 */
export function usePortfolioItems(category?: string): UseContentLoaderResult<PortfolioItem[]> {
  return useContentLoader(
    () => contentService.fetchPortfolioItems(category),
    [category]
  );
}
