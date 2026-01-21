import { useState, useEffect, useMemo } from 'react';
import type { PortfolioData, Company, Category, Quadrant, Tier } from '@/types/portfolio';

interface Filters {
  categories: Category[];
  quadrants: Quadrant[];
  tiers: Tier[];
  searchQuery: string;
}

interface UsePortfolioDataReturn {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredCompanies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
}

const defaultFilters: Filters = {
  categories: [],
  quadrants: [],
  tiers: [],
  searchQuery: ''
};

export function usePortfolioData(): UsePortfolioDataReturn {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Failed to load portfolio data');
        }
        const jsonData: PortfolioData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!data) return [];

    return data.companies.filter(company => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(company.category)) {
        return false;
      }

      // Quadrant filter
      if (filters.quadrants.length > 0 && !filters.quadrants.includes(company.quadrant)) {
        return false;
      }

      // Tier filter
      if (filters.tiers.length > 0 && !filters.tiers.includes(company.tier)) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          company.name,
          company.category,
          company.industry,
          company.hqCity,
          company.hqCountry
        ].filter(Boolean).map(s => s?.toLowerCase());
        
        if (!searchFields.some(field => field?.includes(query))) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters]);

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    filteredCompanies,
    selectedCompany,
    setSelectedCompany
  };
}

// Utility functions
export function formatRevenue(revenue: number): string {
  if (revenue >= 1e9) {
    return `$${(revenue / 1e9).toFixed(1)}B`;
  }
  if (revenue >= 1e6) {
    return `$${(revenue / 1e6).toFixed(0)}M`;
  }
  if (revenue >= 1e3) {
    return `$${(revenue / 1e3).toFixed(0)}K`;
  }
  return `$${revenue}`;
}

export function formatEmployees(employees: number): string {
  if (employees >= 1000) {
    return `${(employees / 1000).toFixed(1)}K`;
  }
  return employees.toString();
}

export function getQuadrantFromScores(impact: number, feasibility: number, threshold = 6.5): Quadrant {
  if (impact >= threshold && feasibility >= threshold) return 'Champions';
  if (impact >= threshold && feasibility < threshold) return 'Strategic';
  if (impact < threshold && feasibility >= threshold) return 'Quick Wins';
  return 'Foundation';
}
