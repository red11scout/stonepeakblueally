/**
 * Company Detail Panel
 * Displays detailed information about a selected company
 * Design: Financial Terminal Precision - data-dense with clear hierarchy
 */

import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Users, DollarSign, TrendingUp, Target, Shield, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Company, Category } from '@/types/portfolio';

// Category colors for avatar backgrounds
const CATEGORY_AVATAR_COLORS: Record<Category, string> = {
  'Digital Infrastructure': '3B82F6',
  'Energy & Energy Transition': '10B981',
  'Transport & Logistics': 'F59E0B',
  'Social Infrastructure': '8B5CF6',
  'Real Estate': 'EC4899'
};

// Generate avatar URL using UI Avatars API
function getAvatarUrl(name: string, category: Category): string {
  const initials = name
    .split(/[\s\-\(\)]+/)
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  const bgColor = CATEGORY_AVATAR_COLORS[category] || '6B7280';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=128&bold=true&format=png`;
}
import { QUADRANT_CONFIG, CATEGORY_CONFIG, TIER_CONFIG } from '@/types/portfolio';
import { formatRevenue, formatEmployees } from '@/hooks/usePortfolioData';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface CompanyDetailProps {
  company: Company;
  onClose: () => void;
}

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
}

function ScoreBar({ label, value, maxValue = 10, icon }: ScoreBarProps) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <Progress value={percentage} className="h-1.5" />
    </div>
  );
}

export function CompanyDetail({ company, onClose }: CompanyDetailProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const quadrantConfig = QUADRANT_CONFIG[company.quadrant];
  const categoryConfig = CATEGORY_CONFIG[company.category];
  const tierConfig = TIER_CONFIG[company.tier];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col bg-card border-l border-border"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <img 
                src={getAvatarUrl(company.name, company.category)}
                alt={company.name}
                className={cn(
                  "w-10 h-10 rounded-lg object-contain shrink-0",
                  isDark ? "bg-white/10" : "bg-slate-100"
                )}
              />
              <h2 className="font-mono text-lg font-semibold text-foreground truncate">
                {company.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{ 
                  backgroundColor: categoryConfig?.color + '20',
                  color: categoryConfig?.color
                }}
              >
                {company.category}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="shrink-0 -mr-2 -mt-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-secondary/50 rounded">
            <div className="text-lg font-mono font-bold text-foreground">
              {company.impactScore.toFixed(1)}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Impact</div>
          </div>
          <div className="text-center p-2 bg-secondary/50 rounded">
            <div className="text-lg font-mono font-bold text-foreground">
              {company.feasibilityScore.toFixed(1)}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Feasibility</div>
          </div>
          <div className="text-center p-2 bg-secondary/50 rounded">
            <div className="text-lg font-mono font-bold text-foreground">
              {company.priorityScore.toFixed(1)}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Priority</div>
          </div>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Quadrant & Tier */}
        <div className="space-y-3">
          <div 
            className="p-3 rounded-lg border"
            style={{ 
              backgroundColor: quadrantConfig.bgColor,
              borderColor: quadrantConfig.color + '40'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="font-mono font-semibold"
                  style={{ color: quadrantConfig.color }}
                >
                  {quadrantConfig.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {quadrantConfig.description}
                </div>
              </div>
              <div 
                className="text-xs font-mono px-2 py-1 rounded"
                style={{ 
                  backgroundColor: tierConfig.color + '20',
                  color: tierConfig.color
                }}
              >
                {company.tier}
              </div>
            </div>
          </div>

          {/* Action & Timeline */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Recommended Action
            </div>
            <div className="text-sm text-foreground">
              {company.action || 'No specific action defined'}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{company.timeline || tierConfig.timeline}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Company Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
            Company Information
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {company.revenue && company.revenue > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-mono text-foreground">{formatRevenue(company.revenue)}</div>
                  <div className="text-[10px] text-muted-foreground">
                    Revenue {company.revenueEst === 'Est.' ? '(Est.)' : ''}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-mono text-foreground">{formatEmployees(company.employees)}</div>
                <div className="text-[10px] text-muted-foreground">Employees</div>
              </div>
            </div>

            {company.hqCity && (
              <div className="flex items-center gap-2 col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-foreground">
                    {[company.hqCity, company.hqState, company.hqCountry].filter(Boolean).join(', ')}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Headquarters</div>
                </div>
              </div>
            )}

            {company.industry && (
              <div className="flex items-center gap-2 col-span-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-foreground">{company.industry}</div>
                  <div className="text-[10px] text-muted-foreground">Industry</div>
                </div>
              </div>
            )}

            {company.investmentDate && (
              <div className="flex items-center gap-2 col-span-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-foreground">{company.investmentDate}</div>
                  <div className="text-[10px] text-muted-foreground">Investment Date</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Impact Score Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
            Impact Score Components
          </h3>
          <div className="space-y-3">
            {company.revenueImpact !== undefined && (
              <ScoreBar 
                label="Revenue/EBITDA (40%)" 
                value={company.revenueImpact} 
                icon={<TrendingUp className="h-3 w-3" />}
              />
            )}
            {company.competitiveDiff !== undefined && (
              <ScoreBar 
                label="Competitive Diff (30%)" 
                value={company.competitiveDiff}
                icon={<Target className="h-3 w-3" />}
              />
            )}
            {company.customerExp !== undefined && (
              <ScoreBar 
                label="Customer Exp (20%)" 
                value={company.customerExp}
                icon={<Users className="h-3 w-3" />}
              />
            )}
            {company.riskReduction !== undefined && (
              <ScoreBar 
                label="Risk Reduction (10%)" 
                value={company.riskReduction}
                icon={<Shield className="h-3 w-3" />}
              />
            )}
          </div>
        </div>

        <Separator />

        {/* Feasibility Score Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
            Feasibility Score Components
          </h3>
          <div className="space-y-3">
            {company.dataAvailability !== undefined && (
              <ScoreBar 
                label="Data Availability (30%)" 
                value={company.dataAvailability}
              />
            )}
            {company.techInfrastructure !== undefined && (
              <ScoreBar 
                label="Tech Infrastructure (25%)" 
                value={company.techInfrastructure}
              />
            )}
            {company.orgTalent !== undefined && (
              <ScoreBar 
                label="Org & Talent (20%)" 
                value={company.orgTalent}
              />
            )}
            {company.industryMaturity !== undefined && (
              <ScoreBar 
                label="Industry Maturity (15%)" 
                value={company.industryMaturity}
              />
            )}
            {company.timelineFit !== undefined && (
              <ScoreBar 
                label="Timeline Fit (10%)" 
                value={company.timelineFit}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CompanyDetail;
