// Portfolio data types for StonePeak IFM

export type Quadrant = 'Champions' | 'Strategic' | 'Quick Wins' | 'Foundation';
export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type Category = 
  | 'Digital Infrastructure' 
  | 'Energy & Energy Transition' 
  | 'Transport & Logistics' 
  | 'Social Infrastructure' 
  | 'Real Estate';

export interface Company {
  name: string;
  logoUrl?: string;
  category: Category;
  employees: number;
  impactScore: number;
  feasibilityScore: number;
  priorityScore: number;
  quadrant: Quadrant;
  tier: Tier;
  action: string;
  timeline: string;
  revenue?: number;
  revenueEst?: string;
  industry?: string;
  detailedSector?: string;
  hqCity?: string;
  hqState?: string;
  hqCountry?: string;
  investmentDate?: string;
  dataAvailability?: number;
  techInfrastructure?: number;
  orgTalent?: number;
  industryMaturity?: number;
  timelineFit?: number;
  revenueImpact?: number;
  competitiveDiff?: number;
  customerExp?: number;
  riskReduction?: number;
}

export interface MethodologyComponent {
  name: string;
  weight: number;
  description: string;
}

export interface TierDefinition {
  tier: string;
  criteria: string;
  threshold: string;
  timeline: string;
}

export interface Methodology {
  impactFormula: string;
  feasibilityFormula: string;
  priorityFormula: string;
  quadrantThreshold: number;
  impactComponents: MethodologyComponent[];
  feasibilityComponents: MethodologyComponent[];
  tierDefinitions: TierDefinition[];
}

export interface Summary {
  totalCompanies: number;
  totalEmployees: number;
  totalRevenue: number;
  aum: string;
  categories: Record<string, number>;
  tiers: Record<string, number>;
  quadrants: Record<string, number>;
}

export interface PortfolioData {
  summary: Summary;
  companies: Company[];
  methodology: Methodology;
}

// Quadrant configuration
export const QUADRANT_CONFIG: Record<Quadrant, { 
  color: string; 
  bgColor: string; 
  label: string;
  description: string;
}> = {
  'Champions': {
    color: '#238636',
    bgColor: 'rgba(35, 134, 54, 0.15)',
    label: 'Champions',
    description: 'High Impact, High Feasibility'
  },
  'Strategic': {
    color: '#1F6FEB',
    bgColor: 'rgba(31, 111, 235, 0.15)',
    label: 'Strategic',
    description: 'High Impact, Low Feasibility'
  },
  'Quick Wins': {
    color: '#F0883E',
    bgColor: 'rgba(240, 136, 62, 0.15)',
    label: 'Quick Wins',
    description: 'Low Impact, High Feasibility'
  },
  'Foundation': {
    color: '#6E7681',
    bgColor: 'rgba(110, 118, 129, 0.15)',
    label: 'Foundation',
    description: 'Low Impact, Low Feasibility'
  }
};

// Category configuration
export const CATEGORY_CONFIG: Record<Category, { 
  color: string; 
  icon: string;
}> = {
  'Digital Infrastructure': {
    color: '#00D4FF',
    icon: '🌐'
  },
  'Energy & Energy Transition': {
    color: '#00FF88',
    icon: '⚡'
  },
  'Transport & Logistics': {
    color: '#FF6B35',
    icon: '🚚'
  },
  'Social Infrastructure': {
    color: '#FFD93D',
    icon: '🏥'
  },
  'Real Estate': {
    color: '#A855F7',
    icon: '🏢'
  }
};

// Tier configuration
export const TIER_CONFIG: Record<Tier, {
  color: string;
  label: string;
  timeline: string;
}> = {
  'Tier 1': {
    color: '#238636',
    label: 'Tier 1 - Champions',
    timeline: 'Immediate - 18 months'
  },
  'Tier 2': {
    color: '#1F6FEB',
    label: 'Tier 2 - Strategic/Quick Wins',
    timeline: '6-24 months'
  },
  'Tier 3': {
    color: '#6E7681',
    label: 'Tier 3 - Foundation',
    timeline: '24-36 months'
  }
};
