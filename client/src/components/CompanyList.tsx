/**
 * Company List Component
 * Sortable table view of portfolio companies
 * Design: Financial Terminal Precision - data-dense table with monospace numbers
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Company, Quadrant } from '@/types/portfolio';
import { QUADRANT_CONFIG, CATEGORY_CONFIG } from '@/types/portfolio';
import { formatRevenue, formatEmployees } from '@/hooks/usePortfolioData';
import { cn } from '@/lib/utils';

interface CompanyListProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
}

type SortField = 'name' | 'impactScore' | 'feasibilityScore' | 'priorityScore' | 'employees' | 'revenue';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function CompanyList({ companies, selectedCompany, onSelectCompany }: CompanyListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'priorityScore',
    direction: 'desc'
  });

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortConfig.field) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'revenue':
          aVal = a.revenue || 0;
          bVal = b.revenue || 0;
          break;
        default:
          aVal = a[sortConfig.field] as number;
          bVal = b[sortConfig.field] as number;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [companies, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'desc' 
      ? <ArrowDown className="h-3 w-3 text-primary" />
      : <ArrowUp className="h-3 w-3 text-primary" />;
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-border bg-secondary/30 text-xs font-mono text-muted-foreground">
        <button 
          className="flex-1 flex items-center gap-1 hover:text-foreground transition-colors text-left"
          onClick={() => handleSort('name')}
        >
          Company <SortIcon field="name" />
        </button>
        <button 
          className="w-20 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('impactScore')}
        >
          Impact <SortIcon field="impactScore" />
        </button>
        <button 
          className="w-20 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('feasibilityScore')}
        >
          Feas. <SortIcon field="feasibilityScore" />
        </button>
        <button 
          className="w-20 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('priorityScore')}
        >
          Priority <SortIcon field="priorityScore" />
        </button>
        <div className="w-8" />
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <AnimatePresence mode="popLayout">
          {sortedCompanies.map((company, index) => {
            const isSelected = selectedCompany?.name === company.name;
            const quadrantConfig = QUADRANT_CONFIG[company.quadrant];
            const categoryConfig = CATEGORY_CONFIG[company.category];

            return (
              <motion.div
                key={company.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.01, duration: 0.15 }}
              >
                <button
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 text-left transition-colors border-b border-border/50",
                    isSelected 
                      ? "bg-primary/10 border-l-2 border-l-primary" 
                      : "hover:bg-secondary/50"
                  )}
                  onClick={() => onSelectCompany(company)}
                >
                  {/* Company info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: quadrantConfig.color }}
                      />
                      {company.logoUrl && (
                        <img 
                          src={`${company.logoUrl}?size=64`}
                          alt={company.name}
                          className="w-5 h-5 rounded object-contain bg-white/10 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <span className="font-mono text-sm text-foreground truncate">
                        {company.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span 
                        className="text-[10px] truncate"
                        style={{ color: categoryConfig?.color }}
                      >
                        {company.category}
                      </span>
                      {company.revenue && company.revenue > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {formatRevenue(company.revenue)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="w-20 text-right font-mono text-sm tabular-nums text-foreground">
                    {company.impactScore.toFixed(1)}
                  </div>
                  <div className="w-20 text-right font-mono text-sm tabular-nums text-foreground">
                    {company.feasibilityScore.toFixed(1)}
                  </div>
                  <div 
                    className="w-20 text-right font-mono text-sm tabular-nums font-semibold"
                    style={{ color: quadrantConfig.color }}
                  >
                    {company.priorityScore.toFixed(1)}
                  </div>

                  {/* Arrow */}
                  <div className="w-8 flex justify-end">
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isSelected ? "text-primary rotate-90" : "text-muted-foreground"
                      )}
                    />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-secondary/30">
        <div className="text-xs font-mono text-muted-foreground">
          {companies.length} companies • Sorted by {sortConfig.field} ({sortConfig.direction})
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
