/**
 * Hook to load and manage AI Assessment data from JSON files
 */

import { useState, useEffect, useMemo } from 'react';
import type { CompanyAssessment, AIUseCase, FrictionPoint, BenefitQuantification, EffortModel, PriorityRoadmap, BusinessKPI, StrategicTheme } from '@shared/assessmentTypes';

// List of all assessment files
const ASSESSMENT_FILES = [
  'BlueAlly_AI_Assessment_ATSG.json',
  'BlueAlly_AI_Assessment_Akumin.json',
  'BlueAlly_AI_Assessment_Astound_Broadband.json',
  'BlueAlly_AI_Assessment_Clean_Energy_Fuels.json',
  'BlueAlly_AI_Assessment_Cologix.json',
  'BlueAlly_AI_Assessment_CoreSite.json',
  'BlueAlly_AI_Assessment_Delta_Fiber.json',
  'BlueAlly_AI_Assessment_Extenet.json',
  'BlueAlly_AI_Assessment_Forgital.json',
  'BlueAlly_AI_Assessment_Inspired_Education.json',
  'BlueAlly_AI_Assessment_Intrado.json',
  'BlueAlly_AI_Assessment_Lineage.json',
  'BlueAlly_AI_Assessment_The_AA.json',
  'BlueAlly_AI_Assessment_Venture_Global.json',
  'BlueAlly_AI_Assessment_euNetworks.json',
];

export interface AssessmentDataState {
  assessments: CompanyAssessment[];
  loading: boolean;
  error: string | null;
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void;
}

export interface AggregatedMetrics {
  totalAnnualValue: number;
  totalCostBenefit: number;
  totalRevenueBenefit: number;
  totalRiskBenefit: number;
  totalUseCases: number;
  totalFrictionPoints: number;
  avgPriorityScore: number;
  companiesCount: number;
}

export interface CrossCompanyPattern {
  pattern: string;
  companies: string[];
  frequency: number;
  avgValue: number;
}

export function useAssessmentData(): AssessmentDataState & {
  selectedAssessment: CompanyAssessment | null;
  aggregatedMetrics: AggregatedMetrics;
  crossCompanyPatterns: {
    functions: CrossCompanyPattern[];
    frictionTypes: CrossCompanyPattern[];
    aiPrimitives: CrossCompanyPattern[];
  };
} {
  const [assessments, setAssessments] = useState<CompanyAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // Load all assessment files
  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoading(true);
        const loadedAssessments: CompanyAssessment[] = [];

        for (const file of ASSESSMENT_FILES) {
          try {
            const response = await fetch(`/data/${file}`);
            if (response.ok) {
              const data = await response.json();
              loadedAssessments.push(data);
            }
          } catch (err) {
            console.warn(`Failed to load ${file}:`, err);
          }
        }

        setAssessments(loadedAssessments);
        setError(null);
      } catch (err) {
        setError('Failed to load assessment data');
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, []);

  // Get selected assessment
  const selectedAssessment = useMemo(() => {
    if (!selectedCompany) return null;
    return assessments.find(a => a.companyName === selectedCompany) || null;
  }, [assessments, selectedCompany]);

  // Calculate aggregated metrics across all companies
  const aggregatedMetrics = useMemo((): AggregatedMetrics => {
    if (assessments.length === 0) {
      return {
        totalAnnualValue: 0,
        totalCostBenefit: 0,
        totalRevenueBenefit: 0,
        totalRiskBenefit: 0,
        totalUseCases: 0,
        totalFrictionPoints: 0,
        avgPriorityScore: 0,
        companiesCount: 0,
      };
    }

    let totalAnnualValue = 0;
    let totalCostBenefit = 0;
    let totalRevenueBenefit = 0;
    let totalRiskBenefit = 0;
    let totalUseCases = 0;
    let totalFrictionPoints = 0;
    let totalPriorityScore = 0;
    let priorityCount = 0;

    assessments.forEach(assessment => {
      const dashboard = assessment.analysis.executiveDashboard;
      totalAnnualValue += dashboard.totalAnnualValue;
      totalCostBenefit += dashboard.totalCostBenefit;
      totalRevenueBenefit += dashboard.totalRevenueBenefit;
      totalRiskBenefit += dashboard.totalRiskBenefit;

      // Count use cases and friction points from steps
      assessment.analysis.steps.forEach(step => {
        if (step.title === 'AI Use Case Generation' && Array.isArray(step.data)) {
          totalUseCases += step.data.length;
        }
        if (step.title === 'Friction Point Mapping' && Array.isArray(step.data)) {
          totalFrictionPoints += step.data.length;
        }
        if (step.title === 'Priority Scoring & Roadmap' && Array.isArray(step.data)) {
          (step.data as PriorityRoadmap[]).forEach(item => {
            totalPriorityScore += item['Priority Score (0-100)'];
            priorityCount++;
          });
        }
      });
    });

    return {
      totalAnnualValue,
      totalCostBenefit,
      totalRevenueBenefit,
      totalRiskBenefit,
      totalUseCases,
      totalFrictionPoints,
      avgPriorityScore: priorityCount > 0 ? totalPriorityScore / priorityCount : 0,
      companiesCount: assessments.length,
    };
  }, [assessments]);

  // Analyze cross-company patterns
  const crossCompanyPatterns = useMemo(() => {
    const functionMap = new Map<string, { companies: Set<string>; totalValue: number; count: number }>();
    const frictionMap = new Map<string, { companies: Set<string>; totalCost: number; count: number }>();
    const primitiveMap = new Map<string, { companies: Set<string>; count: number }>();

    assessments.forEach(assessment => {
      const companyName = assessment.companyName;

      assessment.analysis.steps.forEach(step => {
        // Analyze functions from use cases
        if (step.title === 'AI Use Case Generation' && Array.isArray(step.data)) {
          (step.data as AIUseCase[]).forEach(useCase => {
            const func = useCase.Function;
            if (!functionMap.has(func)) {
              functionMap.set(func, { companies: new Set(), totalValue: 0, count: 0 });
            }
            const entry = functionMap.get(func)!;
            entry.companies.add(companyName);
            entry.count++;

            // Parse AI primitives
            if (useCase['AI Primitives']) {
              useCase['AI Primitives'].split(',').forEach(primitive => {
                const p = primitive.trim();
                if (!primitiveMap.has(p)) {
                  primitiveMap.set(p, { companies: new Set(), count: 0 });
                }
                const pEntry = primitiveMap.get(p)!;
                pEntry.companies.add(companyName);
                pEntry.count++;
              });
            }
          });
        }

        // Analyze friction point types
        if (step.title === 'Friction Point Mapping' && Array.isArray(step.data)) {
          (step.data as FrictionPoint[]).forEach(friction => {
            const severity = friction.Severity;
            if (!frictionMap.has(severity)) {
              frictionMap.set(severity, { companies: new Set(), totalCost: 0, count: 0 });
            }
            const entry = frictionMap.get(severity)!;
            entry.companies.add(companyName);
            entry.count++;
            // Parse cost
            const costStr = friction['Estimated Annual Cost ($)'].replace(/[$,M]/g, '');
            const cost = parseFloat(costStr) || 0;
            entry.totalCost += cost;
          });
        }
      });
    });

    // Convert to arrays
    const functions: CrossCompanyPattern[] = Array.from(functionMap.entries()).map(([pattern, data]) => ({
      pattern,
      companies: Array.from(data.companies),
      frequency: data.count,
      avgValue: data.totalValue / data.count || 0,
    })).sort((a, b) => b.frequency - a.frequency);

    const frictionTypes: CrossCompanyPattern[] = Array.from(frictionMap.entries()).map(([pattern, data]) => ({
      pattern,
      companies: Array.from(data.companies),
      frequency: data.count,
      avgValue: data.totalCost / data.count,
    })).sort((a, b) => b.frequency - a.frequency);

    const aiPrimitives: CrossCompanyPattern[] = Array.from(primitiveMap.entries()).map(([pattern, data]) => ({
      pattern,
      companies: Array.from(data.companies),
      frequency: data.count,
      avgValue: 0,
    })).sort((a, b) => b.frequency - a.frequency);

    return { functions, frictionTypes, aiPrimitives };
  }, [assessments]);

  return {
    assessments,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    selectedAssessment,
    aggregatedMetrics,
    crossCompanyPatterns,
  };
}

// Helper to extract specific step data from an assessment
export function getStepData<T>(assessment: CompanyAssessment, stepTitle: string): T[] {
  const step = assessment.analysis.steps.find(s => s.title === stepTitle);
  return (step?.data as T[]) || [];
}

// Helper to format currency values
export function formatCurrency(value: number, abbreviated = true): string {
  if (abbreviated) {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper to parse currency string to number
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[$,]/g, '');
  const multiplier = cleaned.includes('M') ? 1e6 : cleaned.includes('K') ? 1e3 : cleaned.includes('B') ? 1e9 : 1;
  return parseFloat(cleaned.replace(/[MKB]/g, '')) * multiplier;
}
