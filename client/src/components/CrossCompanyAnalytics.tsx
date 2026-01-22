/**
 * Cross-Company Analytics Component
 * Enables filtering use cases by business function, AI primitive, and priority tier
 * across all 15 portfolio companies with interactive visualizations
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  Building2,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { 
  CompanyAssessment,
  AIUseCase, 
  BenefitQuantification, 
  PriorityRoadmap 
} from '@shared/assessmentTypes';
import { formatCurrency, getStepData, parseCurrency } from '@/hooks/useAssessmentData';

// Filter state interface
interface FilterState {
  businessFunctions: string[];
  aiPrimitives: string[];
  priorityTiers: string[];
  companies: string[];
  searchQuery: string;
}

// Enriched use case with company context
interface EnrichedUseCase {
  company: string;
  useCase: AIUseCase;
  benefit: BenefitQuantification | null;
  priority: PriorityRoadmap | null;
  totalValue: number;
  priorityScore: number;
  priorityTier: string;
}

interface CrossCompanyAnalyticsProps {
  assessments: CompanyAssessment[];
  onSelectCompany: (company: string) => void;
  isDark: boolean;
}

// Priority tier colors
const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  High: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Medium: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function CrossCompanyAnalytics({
  assessments,
  onSelectCompany,
  isDark,
}: CrossCompanyAnalyticsProps) {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    businessFunctions: [],
    aiPrimitives: [],
    priorityTiers: [],
    companies: [],
    searchQuery: '',
  });

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Extract all use cases with enriched data
  const allUseCases = useMemo((): EnrichedUseCase[] => {
    const useCases: EnrichedUseCase[] = [];

    assessments.forEach(assessment => {
      const companyName = assessment.companyName;
      const useCaseData = getStepData<AIUseCase>(assessment, 'AI Use Case Generation');
      const benefitData = getStepData<BenefitQuantification>(assessment, 'Benefits Quantification by Driver');
      const priorityData = getStepData<PriorityRoadmap>(assessment, 'Priority Scoring & Roadmap');

      useCaseData.forEach(uc => {
        const benefit = benefitData.find(b => b.ID === uc.ID) || null;
        const priority = priorityData.find(p => p.ID === uc.ID) || null;

        useCases.push({
          company: companyName,
          useCase: uc,
          benefit,
          priority,
          totalValue: benefit ? parseCurrency(benefit['Total Annual Value ($)']) : 0,
          priorityScore: priority ? priority['Priority Score (0-100)'] : 0,
          priorityTier: priority ? priority['Priority Tier'] : 'Low',
        });
      });
    });

    return useCases;
  }, [assessments]);

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const functions = new Set<string>();
    const primitives = new Set<string>();
    const tiers = new Set<string>();
    const companies = new Set<string>();

    allUseCases.forEach(uc => {
      functions.add(uc.useCase.Function);
      companies.add(uc.company);
      if (uc.priorityTier) tiers.add(uc.priorityTier);
      
      if (uc.useCase['AI Primitives']) {
        uc.useCase['AI Primitives'].split(',').forEach(p => {
          primitives.add(p.trim());
        });
      }
    });

    return {
      functions: Array.from(functions).sort(),
      primitives: Array.from(primitives).sort(),
      tiers: ['Critical', 'High', 'Medium', 'Low'],
      companies: Array.from(companies).sort(),
    };
  }, [allUseCases]);

  // Apply filters
  const filteredUseCases = useMemo(() => {
    return allUseCases.filter(uc => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          uc.useCase['Use Case Name'].toLowerCase().includes(query) ||
          uc.useCase.Description.toLowerCase().includes(query) ||
          uc.company.toLowerCase().includes(query) ||
          uc.useCase.Function.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Business function filter
      if (filters.businessFunctions.length > 0) {
        if (!filters.businessFunctions.includes(uc.useCase.Function)) return false;
      }

      // AI primitive filter
      if (filters.aiPrimitives.length > 0) {
        const ucPrimitives = uc.useCase['AI Primitives']?.split(',').map(p => p.trim()) || [];
        const hasMatchingPrimitive = filters.aiPrimitives.some(p => ucPrimitives.includes(p));
        if (!hasMatchingPrimitive) return false;
      }

      // Priority tier filter
      if (filters.priorityTiers.length > 0) {
        if (!filters.priorityTiers.includes(uc.priorityTier)) return false;
      }

      // Company filter
      if (filters.companies.length > 0) {
        if (!filters.companies.includes(uc.company)) return false;
      }

      return true;
    });
  }, [allUseCases, filters]);

  // Calculate aggregated stats for filtered results
  const filteredStats = useMemo(() => {
    const totalValue = filteredUseCases.reduce((sum, uc) => sum + uc.totalValue, 0);
    const avgPriorityScore = filteredUseCases.length > 0
      ? filteredUseCases.reduce((sum, uc) => sum + uc.priorityScore, 0) / filteredUseCases.length
      : 0;
    const uniqueCompanies = new Set(filteredUseCases.map(uc => uc.company)).size;
    const tierCounts = {
      Critical: filteredUseCases.filter(uc => uc.priorityTier === 'Critical').length,
      High: filteredUseCases.filter(uc => uc.priorityTier === 'High').length,
      Medium: filteredUseCases.filter(uc => uc.priorityTier === 'Medium').length,
      Low: filteredUseCases.filter(uc => uc.priorityTier === 'Low').length,
    };

    return { totalValue, avgPriorityScore, uniqueCompanies, tierCounts, count: filteredUseCases.length };
  }, [filteredUseCases]);

  // Group by function for visualization
  const groupedByFunction = useMemo(() => {
    const groups = new Map<string, EnrichedUseCase[]>();
    filteredUseCases.forEach(uc => {
      const func = uc.useCase.Function;
      if (!groups.has(func)) groups.set(func, []);
      groups.get(func)!.push(uc);
    });
    return Array.from(groups.entries())
      .sort((a, b) => b[1].length - a[1].length);
  }, [filteredUseCases]);

  // Toggle filter
  const toggleFilter = (category: keyof Omit<FilterState, 'searchQuery'>, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      businessFunctions: [],
      aiPrimitives: [],
      priorityTiers: [],
      companies: [],
      searchQuery: '',
    });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.businessFunctions.length > 0 ||
    filters.aiPrimitives.length > 0 ||
    filters.priorityTiers.length > 0 ||
    filters.companies.length > 0 ||
    filters.searchQuery.length > 0;

  // Toggle card expansion
  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter panel content (reusable for both desktop sidebar and mobile sheet)
  const FilterPanelContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search use cases..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Priority Tier Filter */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Priority Tier
        </label>
        <div className="space-y-2">
          {filterOptions.tiers.map(tier => (
            <label key={tier} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.priorityTiers.includes(tier)}
                onCheckedChange={() => toggleFilter('priorityTiers', tier)}
              />
              <Badge className={cn('text-xs', PRIORITY_COLORS[tier])}>
                {tier}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                {allUseCases.filter(uc => uc.priorityTier === tier).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Business Function Filter */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Business Function
        </label>
        <ScrollArea className="h-40">
          <div className="space-y-2 pr-4">
            {filterOptions.functions.map(func => (
              <label key={func} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.businessFunctions.includes(func)}
                  onCheckedChange={() => toggleFilter('businessFunctions', func)}
                />
                <span className="text-sm truncate flex-1">{func}</span>
                <span className="text-xs text-muted-foreground">
                  {allUseCases.filter(uc => uc.useCase.Function === func).length}
                </span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* AI Primitive Filter */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          AI Primitive
        </label>
        <ScrollArea className="h-40">
          <div className="space-y-2 pr-4">
            {filterOptions.primitives.map(primitive => (
              <label key={primitive} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.aiPrimitives.includes(primitive)}
                  onCheckedChange={() => toggleFilter('aiPrimitives', primitive)}
                />
                <span className="text-sm truncate flex-1">{primitive}</span>
                <span className="text-xs text-muted-foreground">
                  {allUseCases.filter(uc => 
                    uc.useCase['AI Primitives']?.includes(primitive)
                  ).length}
                </span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Company Filter */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Company
        </label>
        <ScrollArea className="h-40">
          <div className="space-y-2 pr-4">
            {filterOptions.companies.map(company => (
              <label key={company} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.companies.includes(company)}
                  onCheckedChange={() => toggleFilter('companies', company)}
                />
                <span className="text-sm truncate flex-1">{company}</span>
                <span className="text-xs text-muted-foreground">
                  {allUseCases.filter(uc => uc.company === company).length}
                </span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-72 border-r border-border bg-card/50 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {filters.businessFunctions.length + filters.aiPrimitives.length + filters.priorityTiers.length + filters.companies.length} active
            </Badge>
          )}
        </div>
        <FilterPanelContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Stats Header */}
        <div className="p-4 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Cross-Company Use Case Analysis</h2>
              <p className="text-sm text-muted-foreground">
                {filteredStats.count} use cases across {filteredStats.uniqueCompanies} companies
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet open={filterPanelOpen} onOpenChange={setFilterPanelOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filters.businessFunctions.length + filters.aiPrimitives.length + filters.priorityTiers.length + filters.companies.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterPanelContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-3">
                <div className="text-lg md:text-xl font-bold text-emerald-400">
                  {formatCurrency(filteredStats.totalValue)}
                </div>
                <div className="text-[10px] text-muted-foreground">Total Value</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-3">
                <div className="text-lg md:text-xl font-bold text-blue-400">
                  {filteredStats.avgPriorityScore.toFixed(0)}
                </div>
                <div className="text-[10px] text-muted-foreground">Avg Priority</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-3">
                <div className="text-lg md:text-xl font-bold text-emerald-400">
                  {filteredStats.tierCounts.Critical}
                </div>
                <div className="text-[10px] text-muted-foreground">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-3">
                <div className="text-lg md:text-xl font-bold text-blue-400">
                  {filteredStats.tierCounts.High}
                </div>
                <div className="text-[10px] text-muted-foreground">High</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-3">
                <div className="text-lg md:text-xl font-bold text-purple-400">
                  {filteredStats.tierCounts.Medium + filteredStats.tierCounts.Low}
                </div>
                <div className="text-[10px] text-muted-foreground">Medium/Low</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.priorityTiers.map(tier => (
                <Badge
                  key={`tier-${tier}`}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleFilter('priorityTiers', tier)}
                >
                  {tier}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {filters.businessFunctions.map(func => (
                <Badge
                  key={`func-${func}`}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleFilter('businessFunctions', func)}
                >
                  {func}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {filters.aiPrimitives.map(primitive => (
                <Badge
                  key={`prim-${primitive}`}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleFilter('aiPrimitives', primitive)}
                >
                  {primitive}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {filters.companies.map(company => (
                <Badge
                  key={`comp-${company}`}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleFilter('companies', company)}
                >
                  {company}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {filters.searchQuery && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                >
                  "{filters.searchQuery}"
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {filteredUseCases.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-lg mb-2">No use cases match your filters</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filter criteria or clear all filters
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Grouped by Function */}
                {groupedByFunction.map(([func, useCases]) => (
                  <Collapsible
                    key={func}
                    open={expandedCards.has(func)}
                    onOpenChange={() => toggleCard(func)}
                  >
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-secondary/20 transition-colors py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {expandedCards.has(func) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <CardTitle className="text-sm font-medium">{func}</CardTitle>
                                <CardDescription className="text-xs">
                                  {useCases.length} use cases • {new Set(useCases.map(uc => uc.company)).size} companies
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {formatCurrency(useCases.reduce((sum, uc) => sum + uc.totalValue, 0))}
                              </Badge>
                              <div className="flex gap-1">
                                {useCases.filter(uc => uc.priorityTier === 'Critical').length > 0 && (
                                  <Badge className={cn('text-[10px] px-1.5', PRIORITY_COLORS['Critical'])}>
                                    {useCases.filter(uc => uc.priorityTier === 'Critical').length}
                                  </Badge>
                                )}
                                {useCases.filter(uc => uc.priorityTier === 'High').length > 0 && (
                                  <Badge className={cn('text-[10px] px-1.5', PRIORITY_COLORS['High'])}>
                                    {useCases.filter(uc => uc.priorityTier === 'High').length}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {useCases
                              .sort((a, b) => b.priorityScore - a.priorityScore)
                              .map(uc => (
                                <div
                                  key={`${uc.company}-${uc.useCase.ID}`}
                                  className={cn(
                                    'p-3 rounded-lg border-l-4 bg-secondary/20',
                                    PRIORITY_COLORS[uc.priorityTier].replace('bg-', 'border-l-')
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] cursor-pointer hover:bg-primary/20"
                                          onClick={() => onSelectCompany(uc.company)}
                                        >
                                          <Building2 className="h-3 w-3 mr-1" />
                                          {uc.company}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{uc.useCase.ID}</span>
                                        <Badge className={cn('text-[10px]', PRIORITY_COLORS[uc.priorityTier])}>
                                          {uc.priorityTier}
                                        </Badge>
                                      </div>
                                      <h4 className="font-medium text-sm">{uc.useCase['Use Case Name']}</h4>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {uc.useCase.Description}
                                      </p>
                                      {uc.useCase['AI Primitives'] && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {uc.useCase['AI Primitives'].split(',').map(p => (
                                            <Badge
                                              key={p.trim()}
                                              variant="secondary"
                                              className="text-[10px] cursor-pointer hover:bg-primary/20"
                                              onClick={() => {
                                                if (!filters.aiPrimitives.includes(p.trim())) {
                                                  toggleFilter('aiPrimitives', p.trim());
                                                }
                                              }}
                                            >
                                              <Zap className="h-2.5 w-2.5 mr-0.5" />
                                              {p.trim()}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="text-lg font-bold text-primary">{uc.priorityScore}</div>
                                      <div className="text-[10px] text-muted-foreground">priority</div>
                                      <div className="text-sm font-semibold text-emerald-400 mt-1">
                                        {formatCurrency(uc.totalValue)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
