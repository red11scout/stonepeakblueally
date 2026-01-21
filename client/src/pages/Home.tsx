/**
 * Home Page - StonePeak Impact-Feasibility Matrix Dashboard
 * Design: Financial Terminal Precision
 * - Dark theme with institutional seriousness
 * - Data-dense layout with clear hierarchy
 * - Interactive scatter plot matrix as centerpiece
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  List, 
  Moon, 
  Sun, 
  Menu,
  X,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { IFMMatrix } from '@/components/IFMMatrix';
import { CompanyDetail } from '@/components/CompanyDetail';
import { FilterPanel } from '@/components/FilterPanel';
import { PortfolioStats } from '@/components/PortfolioStats';
import { MethodologyPanel } from '@/components/MethodologyPanel';
import { CompanyList } from '@/components/CompanyList';
import { cn } from '@/lib/utils';

type ViewMode = 'matrix' | 'list';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { 
    data, 
    loading, 
    error, 
    filters, 
    setFilters, 
    filteredCompanies,
    selectedCompany,
    setSelectedCompany
  } = usePortfolioData();

  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="font-mono text-sm text-muted-foreground">
            Loading portfolio data...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-destructive text-4xl">⚠</div>
          <h1 className="font-mono text-lg font-semibold text-foreground">
            Failed to Load Data
          </h1>
          <p className="text-sm text-muted-foreground">
            {error || 'Unable to load portfolio data. Please try again.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/stonepeak-logo.png" 
              alt="StonePeak" 
              className="h-8 w-8 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-mono text-sm font-semibold text-foreground tracking-tight">
                STONEPEAK PARTNERS
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                AI Impact-Feasibility Matrix
              </p>
            </div>
          </div>

          {/* Center - Stats (hidden on mobile) */}
          <div className="hidden lg:block">
            <PortfolioStats summary={data.summary} />
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="hidden sm:block">
              <TabsList className="h-8">
                <TabsTrigger value="matrix" className="h-7 px-2">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="h-7 px-2">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Methodology */}
            <MethodologyPanel methodology={data.methodology} />

            {/* Theme toggle */}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => toggleTheme?.()}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-4">
                <div className="space-y-6">
                  {/* Mobile stats */}
                  <div className="lg:hidden">
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">
                      Portfolio Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-secondary/50 rounded p-2">
                        <div className="font-mono font-semibold">{data.summary.totalCompanies}</div>
                        <div className="text-[10px] text-muted-foreground">Companies</div>
                      </div>
                      <div className="bg-secondary/50 rounded p-2">
                        <div className="font-mono font-semibold">{data.summary.aum}</div>
                        <div className="text-[10px] text-muted-foreground">AUM</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile view toggle */}
                  <div className="sm:hidden">
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">
                      View Mode
                    </h3>
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                      <TabsList className="w-full">
                        <TabsTrigger value="matrix" className="flex-1 gap-2">
                          <LayoutGrid className="h-4 w-4" />
                          Matrix
                        </TabsTrigger>
                        <TabsTrigger value="list" className="flex-1 gap-2">
                          <List className="h-4 w-4" />
                          List
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Filters */}
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    totalCount={data.companies.length}
                    filteredCount={filteredCompanies.length}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Filters (desktop) */}
        <aside className="hidden lg:block w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={data.companies.length}
            filteredCount={filteredCompanies.length}
          />
        </aside>

        {/* Main area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Matrix/List view */}
          <div className={cn(
            "flex-1 p-4 overflow-hidden",
            selectedCompany ? "hidden md:block" : ""
          )}>
            <AnimatePresence mode="wait">
              {viewMode === 'matrix' ? (
                <motion.div
                  key="matrix"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <IFMMatrix
                    companies={filteredCompanies}
                    selectedCompany={selectedCompany}
                    onSelectCompany={setSelectedCompany}
                    threshold={data.methodology.quadrantThreshold}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <CompanyList
                    companies={filteredCompanies}
                    selectedCompany={selectedCompany}
                    onSelectCompany={setSelectedCompany}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Company detail panel */}
          <AnimatePresence>
            {selectedCompany && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden shrink-0 md:block"
              >
                <CompanyDetail
                  company={selectedCompany}
                  onClose={() => setSelectedCompany(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile company detail - full screen overlay */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <CompanyDetail
              company={selectedCompany}
              onClose={() => setSelectedCompany(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
