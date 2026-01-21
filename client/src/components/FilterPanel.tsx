/**
 * Filter Panel Component
 * Controls for filtering the IFM Matrix data
 * Design: Financial Terminal Precision - compact, data-focused
 */

import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Category, Quadrant, Tier } from '@/types/portfolio';
import { QUADRANT_CONFIG, CATEGORY_CONFIG, TIER_CONFIG } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface Filters {
  categories: Category[];
  quadrants: Quadrant[];
  tiers: Tier[];
  searchQuery: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

const ALL_CATEGORIES: Category[] = [
  'Digital Infrastructure',
  'Energy & Energy Transition',
  'Transport & Logistics',
  'Social Infrastructure',
  'Real Estate'
];

const ALL_QUADRANTS: Quadrant[] = ['Champions', 'Strategic', 'Quick Wins', 'Foundation'];
const ALL_TIERS: Tier[] = ['Tier 1', 'Tier 2', 'Tier 3'];

export function FilterPanel({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  filteredCount 
}: FilterPanelProps) {
  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.quadrants.length > 0 || 
    filters.tiers.length > 0 ||
    filters.searchQuery.length > 0;

  const toggleCategory = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleQuadrant = (quadrant: Quadrant) => {
    const newQuadrants = filters.quadrants.includes(quadrant)
      ? filters.quadrants.filter(q => q !== quadrant)
      : [...filters.quadrants, quadrant];
    onFiltersChange({ ...filters, quadrants: newQuadrants });
  };

  const toggleTier = (tier: Tier) => {
    const newTiers = filters.tiers.includes(tier)
      ? filters.tiers.filter(t => t !== tier)
      : [...filters.tiers, tier];
    onFiltersChange({ ...filters, tiers: newTiers });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      quadrants: [],
      tiers: [],
      searchQuery: ''
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="pl-9 pr-9 bg-secondary/50 border-border font-mono text-sm"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFiltersChange({ ...filters, searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter count & reset */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-muted-foreground">
          Showing <span className="text-foreground">{filteredCount}</span> of {totalCount} companies
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-7 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Quadrant Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-xs font-mono text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
          <span className="flex items-center gap-2">
            <Filter className="h-3 w-3" />
            Quadrant
          </span>
          {filters.quadrants.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {filters.quadrants.length}
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {ALL_QUADRANTS.map(quadrant => {
            const config = QUADRANT_CONFIG[quadrant];
            const isActive = filters.quadrants.includes(quadrant);
            return (
              <label
                key={quadrant}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                  isActive ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => toggleQuadrant(quadrant)}
                  className="border-border"
                />
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm text-foreground">{quadrant}</span>
              </label>
            );
          })}
        </CollapsibleContent>
      </Collapsible>

      {/* Category Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-xs font-mono text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
          <span className="flex items-center gap-2">
            <Filter className="h-3 w-3" />
            Category
          </span>
          {filters.categories.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {filters.categories.length}
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {ALL_CATEGORIES.map(category => {
            const config = CATEGORY_CONFIG[category];
            const isActive = filters.categories.includes(category);
            return (
              <label
                key={category}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                  isActive ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => toggleCategory(category)}
                  className="border-border"
                />
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm text-foreground truncate">{category}</span>
              </label>
            );
          })}
        </CollapsibleContent>
      </Collapsible>

      {/* Tier Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-xs font-mono text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors">
          <span className="flex items-center gap-2">
            <Filter className="h-3 w-3" />
            Priority Tier
          </span>
          {filters.tiers.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {filters.tiers.length}
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {ALL_TIERS.map(tier => {
            const config = TIER_CONFIG[tier];
            const isActive = filters.tiers.includes(tier);
            return (
              <label
                key={tier}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                  isActive ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                <Checkbox
                  checked={isActive}
                  onCheckedChange={() => toggleTier(tier)}
                  className="border-border"
                />
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm text-foreground">{tier}</span>
              </label>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default FilterPanel;
