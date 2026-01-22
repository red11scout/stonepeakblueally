/**
 * Types for AI Assessment data from JSON files
 */

// Strategic Anchoring
export interface StrategicTheme {
  "Strategic Theme": string;
  "Primary Driver": string;
  "Secondary Driver": string;
  "Current State": string;
  "Target State": string;
}

// Business Function KPI
export interface BusinessKPI {
  Function: string;
  "Sub-Function": string;
  "KPI Name": string;
  "Baseline Value": string;
  "Target Value": string;
  Direction: string;
  Timeframe: string;
  "Industry Benchmark": string;
  "Measurement Method": string;
}

// Friction Point
export interface FrictionPoint {
  Function: string;
  "Sub-Function": string;
  "Friction Point": string;
  Severity: "Critical" | "High" | "Medium" | "Low";
  "Primary Driver Impact": string;
  "Estimated Annual Cost ($)": string;
}

// AI Use Case
export interface AIUseCase {
  ID: string;
  "Use Case Name": string;
  Function: string;
  "Sub-Function": string;
  Description: string;
  "AI Primitives"?: string;
  "Target Friction": string;
  "Human-in-the-Loop Checkpoint": string;
}

// Benefits Quantification
export interface BenefitQuantification {
  ID: string;
  "Use Case": string;
  "Cost Formula": string;
  "Cost Benefit ($)": string;
  "Revenue Formula": string;
  "Revenue Benefit ($)": string;
  "Risk Formula": string;
  "Risk Benefit ($)": string;
  "Cash Flow Formula": string;
  "Cash Flow Benefit ($)": string;
  "Probability of Success": number;
  "Total Annual Value ($)": string;
}

// Effort & Token Model
export interface EffortModel {
  ID: string;
  "Use Case": string;
  "Input Tokens/Run": number;
  "Output Tokens/Run": number;
  "Runs/Month": number;
  "Monthly Tokens": number;
  "Annual Token Cost ($)": string;
  "Data Readiness (1-5)": number;
  "Integration Complexity (1-5)": number;
  "Change Mgmt (1-5)": number;
  "Effort Score (1-5)": number;
  "Time-to-Value (months)": number;
}

// Priority Roadmap
export interface PriorityRoadmap {
  ID: string;
  "Use Case": string;
  "Value Score (0-40)": number;
  "Effort Score (0-30)": number;
  "TTV Score (0-30)": number;
  "Priority Score (0-100)": number;
  "Priority Tier": "Critical" | "High" | "Medium" | "Low";
  "Recommended Phase": string;
}

// Executive Dashboard Summary
export interface ExecutiveDashboardSummary {
  totalAnnualValue: number;
  totalCostBenefit: number;
  totalRevenueBenefit: number;
  totalRiskBenefit: number;
  totalCashFlowBenefit: number;
  totalMonthlyTokens: number;
  valuePerMillionTokens: number;
  topUseCases: Array<{
    rank: number;
    useCase: string;
    annualValue: number;
    monthlyTokens: number;
    priorityScore: number;
  }>;
}

// Analysis Step
export interface AnalysisStep {
  step: number;
  title: string;
  content: string;
  data: StrategicTheme[] | BusinessKPI[] | FrictionPoint[] | AIUseCase[] | BenefitQuantification[] | EffortModel[] | PriorityRoadmap[] | null;
}

// Complete Company Assessment
export interface CompanyAssessment {
  companyName: string;
  generatedAt: string;
  analysis: {
    steps: AnalysisStep[];
    summary: string;
    executiveDashboard: ExecutiveDashboardSummary;
  };
}

// User Scenario Modification
export interface ScenarioModification {
  useCaseId: string;
  field: string;
  originalValue: string | number;
  modifiedValue: string | number;
  calculatedImpact: number;
}
