/**
 * Company List Component
 * Redesigned table view with filters, logos, rank, and sortable columns
 * Design: Clean data table with inline filters and tier badges
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Company, Quadrant, Category } from '@/types/portfolio';
import { QUADRANT_CONFIG, CATEGORY_CONFIG } from '@/types/portfolio';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface CompanyListProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company) => void;
}

type SortField = 'rank' | 'name' | 'tier' | 'impactScore' | 'feasibilityScore' | 'priorityScore' | 'category' | 'quadrant';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Define sort order for quadrants
const QUADRANT_ORDER: Record<Quadrant, number> = {
  'Champions': 1,
  'Strategic': 2,
  'Quick Wins': 3,
  'Foundation': 4
};

// Define sort order for categories (cohorts)
const CATEGORY_ORDER: Record<Category, number> = {
  'Digital Infrastructure': 1,
  'Energy & Energy Transition': 2,
  'Transport & Logistics': 3,
  'Social Infrastructure': 4,
  'Real Estate': 5
};

// Tier badge colors
const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Tier 1': { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  'Tier 2': { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  'Tier 3': { bg: 'bg-slate-50 dark:bg-slate-800/30', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' }
};

// Short category names for display
const SHORT_CATEGORY: Record<Category, string> = {
  'Digital Infrastructure': 'Digital',
  'Energy & Energy Transition': 'Energy',
  'Transport & Logistics': 'Transport',
  'Social Infrastructure': 'Social',
  'Real Estate': 'Real Estate'
};

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
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=64&bold=true&format=png`;
}

// Company Logo component with fallback
function CompanyLogo({ company, size = 'sm', isDark }: { company: Company; size?: 'sm' | 'md'; isDark: boolean }) {
  const [hasError, setHasError] = useState(false);
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const imgSizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  
  const avatarUrl = getAvatarUrl(company.name, company.category);
  
  return (
    <div className={cn(
      sizeClasses,
      "rounded-lg flex items-center justify-center shrink-0 overflow-hidden",
      isDark ? "bg-white/10" : "bg-slate-100"
    )}>
      <img 
        src={hasError ? avatarUrl : avatarUrl}
        alt={company.name}
        className={cn(imgSizeClasses, "object-contain rounded")}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export function CompanyList({ companies, selectedCompany, onSelectCompany }: CompanyListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'priorityScore',
    direction: 'desc'
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string[]>([]);
  const [quadrantFilter, setQuadrantFilter] = useState<Quadrant[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category[]>([]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.quadrant.toLowerCase().includes(query)
      );
    }
    
    // Apply tier filter
    if (tierFilter.length > 0) {
      result = result.filter(c => tierFilter.includes(c.tier));
    }
    
    // Apply quadrant filter
    if (quadrantFilter.length > 0) {
      result = result.filter(c => quadrantFilter.includes(c.quadrant));
    }
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      result = result.filter(c => categoryFilter.includes(c.category));
    }
    
    // Sort
    result.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortConfig.field) {
        case 'rank':
        case 'priorityScore':
          aVal = a.priorityScore;
          bVal = b.priorityScore;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'tier':
          aVal = a.tier;
          bVal = b.tier;
          break;
        case 'impactScore':
          aVal = a.impactScore;
          bVal = b.impactScore;
          break;
        case 'feasibilityScore':
          aVal = a.feasibilityScore;
          bVal = b.feasibilityScore;
          break;
        case 'quadrant':
          aVal = QUADRANT_ORDER[a.quadrant];
          bVal = QUADRANT_ORDER[b.quadrant];
          break;
        case 'category':
          aVal = CATEGORY_ORDER[a.category];
          bVal = CATEGORY_ORDER[b.category];
          break;
        default:
          aVal = a.priorityScore;
          bVal = b.priorityScore;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [companies, searchQuery, tierFilter, quadrantFilter, categoryFilter, sortConfig]);

  // Calculate ranks based on priority score
  const rankedCompanies = useMemo(() => {
    const sorted = [...companies].sort((a, b) => b.priorityScore - a.priorityScore);
    const rankMap = new Map<string, number>();
    sorted.forEach((c, i) => rankMap.set(c.name, i + 1));
    return rankMap;
  }, [companies]);

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

  const tiers = ['Tier 1', 'Tier 2', 'Tier 3'];
  const quadrants: Quadrant[] = ['Champions', 'Strategic', 'Quick Wins', 'Foundation'];
  const categories: Category[] = ['Digital Infrastructure', 'Energy & Energy Transition', 'Transport & Logistics', 'Social Infrastructure', 'Real Estate'];

  const hasActiveFilters = tierFilter.length > 0 || quadrantFilter.length > 0 || categoryFilter.length > 0;

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-3 md:p-4 border-b border-border space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, industry, or cohort..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-background"
          />
        </div>
        
        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mr-1">Filters:</span>
          
          {/* Tier Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "h-8 text-xs gap-1",
                  tierFilter.length > 0 && "border-primary text-primary"
                )}
              >
                {tierFilter.length > 0 ? `${tierFilter.length} Tiers` : 'All Tiers'}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {tiers.map(tier => (
                <DropdownMenuCheckboxItem
                  key={tier}
                  checked={tierFilter.includes(tier)}
                  onCheckedChange={(checked) => {
                    setTierFilter(prev => 
                      checked ? [...prev, tier] : prev.filter(t => t !== tier)
                    );
                  }}
                >
                  {tier}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Quadrant Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "h-8 text-xs gap-1",
                  quadrantFilter.length > 0 && "border-primary text-primary"
                )}
              >
                {quadrantFilter.length > 0 ? `${quadrantFilter.length} Quadrants` : 'All Quadrants'}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {quadrants.map(q => (
                <DropdownMenuCheckboxItem
                  key={q}
                  checked={quadrantFilter.includes(q)}
                  onCheckedChange={(checked) => {
                    setQuadrantFilter(prev => 
                      checked ? [...prev, q] : prev.filter(x => x !== q)
                    );
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: QUADRANT_CONFIG[q].color }}
                  />
                  {q}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Industry/Cohort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "h-8 text-xs gap-1",
                  categoryFilter.length > 0 && "border-primary text-primary"
                )}
              >
                {categoryFilter.length > 0 ? `${categoryFilter.length} Cohorts` : 'All Cohorts'}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {categories.map(cat => (
                <DropdownMenuCheckboxItem
                  key={cat}
                  checked={categoryFilter.includes(cat)}
                  onCheckedChange={(checked) => {
                    setCategoryFilter(prev => 
                      checked ? [...prev, cat] : prev.filter(c => c !== cat)
                    );
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: CATEGORY_CONFIG[cat].color }}
                  />
                  {SHORT_CATEGORY[cat]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setTierFilter([]);
                setQuadrantFilter([]);
                setCategoryFilter([]);
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden md:flex items-center px-4 py-2 bg-secondary/30 border-b border-border text-xs font-medium text-muted-foreground">
        <button 
          className="w-16 flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('rank')}
        >
          Rank <SortIcon field="rank" />
        </button>
        <button 
          className="flex-1 flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('name')}
        >
          Company <SortIcon field="name" />
        </button>
        <button 
          className="w-20 flex items-center justify-center gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('tier')}
        >
          Tier <SortIcon field="tier" />
        </button>
        <button 
          className="w-20 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('impactScore')}
        >
          Impact <SortIcon field="impactScore" />
        </button>
        <button 
          className="w-24 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('feasibilityScore')}
        >
          Feasibility <SortIcon field="feasibilityScore" />
        </button>
        <button 
          className="w-20 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('priorityScore')}
        >
          Priority <SortIcon field="priorityScore" />
        </button>
        <button 
          className="w-28 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('category')}
        >
          Industry <SortIcon field="category" />
        </button>
        <button 
          className="w-24 flex items-center justify-end gap-1 hover:text-foreground transition-colors"
          onClick={() => handleSort('quadrant')}
        >
          Quadrant <SortIcon field="quadrant" />
        </button>
        <div className="w-8" />
      </div>

      {/* Mobile Sort Options */}
      <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-secondary/30 border-b border-border overflow-x-auto">
        <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
        <button 
          className={cn(
            "text-xs px-2 py-1 rounded-full shrink-0 flex items-center gap-1",
            sortConfig.field === 'priorityScore' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}
          onClick={() => handleSort('priorityScore')}
        >
          Priority <SortIcon field="priorityScore" />
        </button>
        <button 
          className={cn(
            "text-xs px-2 py-1 rounded-full shrink-0 flex items-center gap-1",
            sortConfig.field === 'name' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}
          onClick={() => handleSort('name')}
        >
          Name <SortIcon field="name" />
        </button>
        <button 
          className={cn(
            "text-xs px-2 py-1 rounded-full shrink-0 flex items-center gap-1",
            sortConfig.field === 'quadrant' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}
          onClick={() => handleSort('quadrant')}
        >
          Quadrant <SortIcon field="quadrant" />
        </button>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/50">
        Showing {filteredAndSortedCompanies.length} of {companies.length} companies
      </div>

      {/* Company List */}
      <ScrollArea className="flex-1">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedCompanies.map((company, index) => {
            const isSelected = selectedCompany?.name === company.name;
            const quadrantConfig = QUADRANT_CONFIG[company.quadrant];
            const tierColors = TIER_COLORS[company.tier] || TIER_COLORS['Tier 3'];
            const rank = rankedCompanies.get(company.name) || index + 1;

            return (
              <motion.div
                key={company.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: Math.min(index * 0.01, 0.3), duration: 0.15 }}
              >
                {/* Desktop Row */}
                <button
                  className={cn(
                    "hidden md:flex w-full items-center px-4 py-3 text-left transition-colors border-b border-border/50",
                    isSelected 
                      ? "bg-primary/5 border-l-2 border-l-primary" 
                      : "hover:bg-secondary/50"
                  )}
                  onClick={() => onSelectCompany(company)}
                >
                  {/* Rank */}
                  <div className="w-16 font-mono text-sm text-muted-foreground">
                    #{rank}
                  </div>
                  
                  {/* Company with Logo */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <CompanyLogo company={company} size="sm" isDark={isDark} />
                    <span className="font-medium text-sm text-foreground truncate">
                      {company.name}
                    </span>
                  </div>
                  
                  {/* Tier Badge */}
                  <div className="w-20 flex justify-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium border",
                      tierColors.bg,
                      tierColors.text,
                      tierColors.border
                    )}>
                      {company.tier}
                    </span>
                  </div>
                  
                  {/* Impact Score */}
                  <div className="w-20 text-right font-mono text-sm tabular-nums">
                    {company.impactScore.toFixed(1)}
                  </div>
                  
                  {/* Feasibility Score */}
                  <div className="w-24 text-right font-mono text-sm tabular-nums">
                    {company.feasibilityScore.toFixed(1)}
                  </div>
                  
                  {/* Priority Score */}
                  <div className="w-20 text-right font-mono text-sm tabular-nums font-bold">
                    {company.priorityScore.toFixed(1)}
                  </div>
                  
                  {/* Industry */}
                  <div className="w-28 text-right text-xs text-muted-foreground truncate">
                    {SHORT_CATEGORY[company.category]}
                  </div>
                  
                  {/* Quadrant */}
                  <div 
                    className="w-24 text-right text-xs font-medium truncate"
                    style={{ color: quadrantConfig.color }}
                  >
                    {company.quadrant}
                  </div>
                  
                  {/* Arrow */}
                  <div className="w-8 flex justify-end">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>

                {/* Mobile Row */}
                <button
                  className={cn(
                    "md:hidden w-full p-3 text-left transition-colors border-b border-border/50",
                    isSelected 
                      ? "bg-primary/5 border-l-2 border-l-primary" 
                      : "hover:bg-secondary/50"
                  )}
                  onClick={() => onSelectCompany(company)}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="font-mono text-xs text-muted-foreground w-8">
                      #{rank}
                    </div>
                    
                    {/* Logo */}
                    <CompanyLogo company={company} size="sm" isDark={isDark} />
                    
                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {company.name}
                        </span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-medium border shrink-0",
                          tierColors.bg,
                          tierColors.text,
                          tierColors.border
                        )}>
                          {company.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-[10px] font-medium"
                          style={{ color: quadrantConfig.color }}
                        >
                          {company.quadrant}
                        </span>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <span className="text-[10px] text-muted-foreground">
                          {SHORT_CATEGORY[company.category]}
                        </span>
                      </div>
                    </div>
                    
                    {/* Priority Score */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm font-bold tabular-nums">
                        {company.priorityScore.toFixed(1)}
                      </div>
                      <div className="text-[9px] text-muted-foreground">Priority</div>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
