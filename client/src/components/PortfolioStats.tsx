/**
 * Portfolio Stats Component
 * Displays key portfolio metrics in a compact header bar
 * Design: Financial Terminal Precision - data pills with monospace numbers
 */

import { Building2, Users, DollarSign, Briefcase } from 'lucide-react';
import type { Summary } from '@/types/portfolio';
import { formatRevenue, formatEmployees } from '@/hooks/usePortfolioData';
import { QUADRANT_CONFIG } from '@/types/portfolio';

interface PortfolioStatsProps {
  summary: Summary;
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

function StatPill({ icon, label, value, subValue }: StatPillProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md border border-border/50">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
          {subValue && (
            <span className="text-[10px] text-muted-foreground">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PortfolioStats({ summary }: PortfolioStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatPill
        icon={<Building2 className="h-4 w-4" />}
        label="Portfolio"
        value={summary.totalCompanies.toString()}
        subValue="companies"
      />
      
      <StatPill
        icon={<Users className="h-4 w-4" />}
        label="Employees"
        value={formatEmployees(summary.totalEmployees)}
        subValue="total"
      />
      
      <StatPill
        icon={<DollarSign className="h-4 w-4" />}
        label="Revenue"
        value={formatRevenue(summary.totalRevenue)}
        subValue="combined"
      />
      
      <StatPill
        icon={<Briefcase className="h-4 w-4" />}
        label="AUM"
        value={summary.aum}
      />

      {/* Quadrant breakdown - compact */}
      <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-border">
        {Object.entries(summary.quadrants).map(([quadrant, count]) => {
          const config = QUADRANT_CONFIG[quadrant as keyof typeof QUADRANT_CONFIG];
          return (
            <div 
              key={quadrant}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono"
              style={{ 
                backgroundColor: config.bgColor,
                color: config.color
              }}
              title={quadrant}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioStats;
