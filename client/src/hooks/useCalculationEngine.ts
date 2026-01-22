/**
 * HyperFormula Calculation Engine Hook
 * Provides deterministic, repeatable calculations for AI use case scenarios
 */

import { useState, useCallback } from 'react';
import HyperFormula from 'hyperformula';
import type { CompanyAssessment, AIUseCase, BenefitQuantification } from '@shared/assessmentTypes';

// Initialize HyperFormula with custom configuration
const hfInstance = HyperFormula.buildEmpty({
  licenseKey: 'gpl-v3',
  precisionRounding: 2,
  smartRounding: true,
});

export interface ScenarioModification {
  useCaseId: string;
  field: string;
  originalValue: number;
  modifiedValue: number;
  timestamp: number;
}

export interface UseCaseValue {
  annualValue: number;
  costSavings: number;
  revenueGrowth: number;
  riskReduction: number;
  probabilityAdjusted: number;
}

export interface CalculationResult {
  totalValue: number;
  costSavings: number;
  revenueGrowth: number;
  riskReduction: number;
  useCaseValues: Map<string, UseCaseValue>;
}

export interface UseCalculationEngineReturn {
  calculate: (assessment: CompanyAssessment, modifications?: ScenarioModification[]) => CalculationResult;
  applyModification: (mod: ScenarioModification) => void;
  clearModifications: () => void;
  modifications: ScenarioModification[];
  recalculateWithModifications: (assessment: CompanyAssessment) => CalculationResult;
}

// Parse currency string to number
function parseCurrency(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  // Remove $ and commas, handle M/K suffixes
  const cleaned = value.replace(/[$,]/g, '').trim();
  if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000_000;
  }
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000;
  }
  if (cleaned.endsWith('B')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000_000_000;
  }
  return parseFloat(cleaned) || 0;
}

export function useCalculationEngine(): UseCalculationEngineReturn {
  const [modifications, setModifications] = useState<ScenarioModification[]>([]);

  // Calculate benefits for a single use case
  const calculateUseCaseValue = useCallback((
    useCase: AIUseCase,
    benefits: BenefitQuantification | undefined,
    mods: ScenarioModification[]
  ): UseCaseValue => {
    if (!benefits) {
      return {
        annualValue: 0,
        costSavings: 0,
        revenueGrowth: 0,
        riskReduction: 0,
        probabilityAdjusted: 0,
      };
    }

    // Parse values from benefits
    let costSavings = parseCurrency(benefits["Cost Benefit ($)"]);
    let revenueGrowth = parseCurrency(benefits["Revenue Benefit ($)"]);
    let riskReduction = parseCurrency(benefits["Risk Benefit ($)"]);
    let probabilityOfSuccess = benefits["Probability of Success"] || 0.7;

    // Check for modifications
    const useCaseMods = mods.filter(m => m.useCaseId === useCase.ID);
    for (const mod of useCaseMods) {
      switch (mod.field) {
        case 'costSavings':
          costSavings = mod.modifiedValue;
          break;
        case 'revenueGrowth':
          revenueGrowth = mod.modifiedValue;
          break;
        case 'riskReduction':
          riskReduction = mod.modifiedValue;
          break;
        case 'probabilityOfSuccess':
          probabilityOfSuccess = mod.modifiedValue;
          break;
      }
    }

    const annualValue = costSavings + revenueGrowth + riskReduction;
    const probabilityAdjusted = annualValue * probabilityOfSuccess;

    return {
      annualValue,
      costSavings,
      revenueGrowth,
      riskReduction,
      probabilityAdjusted,
    };
  }, []);

  // Extract data from assessment steps
  const extractData = useCallback((assessment: CompanyAssessment) => {
    const useCases: AIUseCase[] = [];
    const benefits: BenefitQuantification[] = [];

    for (const step of assessment.analysis?.steps || []) {
      if (step.data) {
        // Check if it's use cases
        if (Array.isArray(step.data) && step.data.length > 0) {
          const first = step.data[0] as unknown as Record<string, unknown>;
          if ('Use Case Name' in first) {
            useCases.push(...(step.data as AIUseCase[]));
          }
          if ('Cost Benefit ($)' in first) {
            benefits.push(...(step.data as BenefitQuantification[]));
          }
        }
      }
    }

    return { useCases, benefits };
  }, []);

  // Main calculation function
  const calculate = useCallback((
    assessment: CompanyAssessment,
    mods: ScenarioModification[] = []
  ): CalculationResult => {
    const useCaseValues = new Map<string, UseCaseValue>();
    const { useCases, benefits } = extractData(assessment);

    let totalCostSavings = 0;
    let totalRevenueGrowth = 0;
    let totalRiskReduction = 0;

    // Calculate each use case
    for (const useCase of useCases) {
      const benefit = benefits.find(b => b.ID === useCase.ID);
      const values = calculateUseCaseValue(useCase, benefit, mods);
      useCaseValues.set(useCase.ID, values);

      totalCostSavings += values.costSavings;
      totalRevenueGrowth += values.revenueGrowth;
      totalRiskReduction += values.riskReduction;
    }

    return {
      totalValue: totalCostSavings + totalRevenueGrowth + totalRiskReduction,
      costSavings: totalCostSavings,
      revenueGrowth: totalRevenueGrowth,
      riskReduction: totalRiskReduction,
      useCaseValues,
    };
  }, [calculateUseCaseValue, extractData]);

  // Apply a modification
  const applyModification = useCallback((mod: ScenarioModification) => {
    setModifications(prev => {
      // Remove any existing modification for the same use case and field
      const filtered = prev.filter(
        m => !(m.useCaseId === mod.useCaseId && m.field === mod.field)
      );
      return [...filtered, mod];
    });
  }, []);

  // Clear all modifications
  const clearModifications = useCallback(() => {
    setModifications([]);
  }, []);

  // Recalculate with current modifications
  const recalculateWithModifications = useCallback((assessment: CompanyAssessment) => {
    return calculate(assessment, modifications);
  }, [calculate, modifications]);

  return {
    calculate,
    applyModification,
    clearModifications,
    modifications,
    recalculateWithModifications,
  };
}

// Utility functions for formatting
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
