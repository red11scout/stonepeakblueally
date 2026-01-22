/**
 * Home Page - StonePeak Impact-Feasibility Matrix Dashboard
 * Design: Financial Terminal Precision
 * - Supports both light and dark themes
 * - Fully responsive for mobile, tablet, and desktop
 * - BlueAllyAI branding in header and footer
 * - Executive Dashboard with charts and summaries
 * - Helpful tips and user guidance
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  List, 
  Moon, 
  Sun, 
  Menu,
  Filter,
  LogOut,
  BarChart3,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { IFMMatrix } from '@/components/IFMMatrix';
import { CompanyDetail } from '@/components/CompanyDetail';
import { FilterPanel } from '@/components/FilterPanel';
import { PortfolioStats } from '@/components/PortfolioStats';
import { MethodologyPanel } from '@/components/MethodologyPanel';
import { CompanyList } from '@/components/CompanyList';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { WelcomeModal } from '@/components/HelpTips';
import { cn } from '@/lib/utils';

type ViewMode = 'matrix' | 'list' | 'dashboard' | 'summary';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const isDark = theme === 'dark';
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
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('stonepeak-ifm-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('stonepeak-ifm-visited', 'true');
    }
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when selecting a company on mobile
  useEffect(() => {
    if (selectedCompany && isMobile) {
      setSidebarOpen(false);
    }
  }, [selectedCompany, isMobile]);

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

  const hasActiveFilters = filters.quadrants.length > 0 || filters.categories.length > 0 || filters.tiers.length > 0 || filters.searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Welcome Modal for first-time users */}
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* BlueAllyAI Branding */}
            <div className="flex items-center gap-0.5">
              <img 
                src={isDark ? "/images/blueally-logo-white.png" : "/images/blueally-logo-color.png"}
                alt="BlueAlly" 
                className="h-6 sm:h-7 object-contain"
              />
              <span className={cn(
                "text-lg sm:text-xl font-bold tracking-tight",
                isDark ? "text-white" : "text-[#001B5E]"
              )}>
                AI
              </span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-border mx-1" />
            <div className="hidden sm:block">
              <h1 className="font-mono text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                STONEPEAK PARTNERS
              </h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">
                Impact-Feasibility Matrix
              </p>
            </div>
          </div>

          {/* Center - Stats (hidden on mobile/tablet) */}
          <div className="hidden lg:block">
            <PortfolioStats summary={data.summary} />
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View toggle - visible on tablet+ */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="hidden sm:block">
              <TabsList className="h-8">
                <TabsTrigger value="matrix" className="h-7 px-2 text-xs gap-1" title="Matrix View">
                  <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">Matrix</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="h-7 px-2 text-xs gap-1" title="List View">
                  <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">List</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="h-7 px-2 text-xs gap-1" title="Analytics Dashboard">
                  <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="h-7 px-2 text-xs gap-1" title="Executive Summary">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">Summary</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Methodology - hidden on very small screens */}
            <div className="hidden xs:block">
              <MethodologyPanel methodology={data.methodology} />
            </div>

            {/* Theme toggle */}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => toggleTheme?.()}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>

            {/* Logout button - desktop */}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 hidden sm:flex"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            {/* Mobile menu / filter button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "h-8 w-8 lg:hidden relative",
                    hasActiveFilters && "border-primary"
                  )}
                >
                  <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        <img 
                          src={isDark ? "/images/blueally-logo-white.png" : "/images/blueally-logo-color.png"}
                          alt="BlueAlly" 
                          className="h-5 object-contain"
                        />
                        <span className={cn(
                          "text-base font-bold tracking-tight",
                          isDark ? "text-white" : "text-[#001B5E]"
                        )}>
                          AI
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={logout}
                        className="text-xs h-7"
                      >
                        <LogOut className="h-3.5 w-3.5 mr-1" />
                        Sign out
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      StonePeak Impact-Feasibility Matrix
                    </p>
                  </div>

                  {/* Mobile stats */}
                  <div className="p-4 border-b border-border lg:hidden">
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">
                      Portfolio Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-secondary/50 rounded p-2">
                        <div className="font-mono font-semibold text-foreground">{data.summary.totalCompanies}</div>
                        <div className="text-[10px] text-muted-foreground">Companies</div>
                      </div>
                      <div className="bg-secondary/50 rounded p-2">
                        <div className="font-mono font-semibold text-foreground">{data.summary.aum}</div>
                        <div className="text-[10px] text-muted-foreground">AUM</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile view toggle */}
                  <div className="p-4 border-b border-border sm:hidden">
                    <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-3">
                      View Mode
                    </h3>
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                      <TabsList className="w-full grid grid-cols-4">
                        <TabsTrigger value="matrix" className="flex-1 gap-1 text-xs">
                          <LayoutGrid className="h-3.5 w-3.5" />
                          Matrix
                        </TabsTrigger>
                        <TabsTrigger value="list" className="flex-1 gap-1 text-xs">
                          <List className="h-3.5 w-3.5" />
                          List
                        </TabsTrigger>
                        <TabsTrigger value="dashboard" className="flex-1 gap-1 text-xs">
                          <BarChart3 className="h-3.5 w-3.5" />
                          Stats
                        </TabsTrigger>
                        <TabsTrigger value="summary" className="flex-1 gap-1 text-xs">
                          <FileText className="h-3.5 w-3.5" />
                          Summary
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Mobile methodology - shown on very small screens */}
                  <div className="p-4 border-b border-border xs:hidden">
                    <MethodologyPanel methodology={data.methodology} />
                  </div>

                  {/* Filters */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      totalCount={data.companies.length}
                      filteredCount={filteredCompanies.length}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile stats bar - visible on tablet, hidden on desktop */}
        <div className="hidden sm:flex lg:hidden items-center justify-center gap-4 px-4 py-2 border-t border-border bg-secondary/20">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Portfolio:</span>
            <span className="font-mono font-semibold text-foreground">{data.summary.totalCompanies}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Employees:</span>
            <span className="font-mono font-semibold text-foreground">
              {(data.summary.totalEmployees / 1000).toFixed(1)}K
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">AUM:</span>
            <span className="font-mono font-semibold text-foreground">{data.summary.aum}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Filters (desktop only, not shown in dashboard/summary views) */}
        {viewMode !== 'dashboard' && viewMode !== 'summary' && (
          <aside className="hidden lg:block w-64 border-r border-border bg-card/50 p-4 overflow-y-auto">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={data.companies.length}
              filteredCount={filteredCompanies.length}
            />
          </aside>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Matrix/List/Dashboard/Summary view */}
          <div className={cn(
            "flex-1 overflow-hidden",
            (viewMode === 'matrix' || viewMode === 'list') && "p-2 sm:p-4",
            (viewMode === 'dashboard' || viewMode === 'summary') && "p-0",
            selectedCompany && isMobile && (viewMode === 'matrix' || viewMode === 'list') ? "hidden" : ""
          )}>
            <AnimatePresence>
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
              ) : viewMode === 'list' ? (
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
              ) : viewMode === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full overflow-y-auto"
                >
                  <ExecutiveDashboard
                    companies={data.companies}
                    onSelectCompany={(company) => {
                      setSelectedCompany(company);
                      setViewMode('matrix');
                    }}
                  />
                </motion.div>
              ) : viewMode === 'summary' ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full overflow-y-auto"
                >
                  <ExecutiveSummary companies={data.companies} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Company detail panel - desktop (not shown in dashboard view) */}
          <AnimatePresence>
            {selectedCompany && !isMobile && (viewMode === 'matrix' || viewMode === 'list') && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden shrink-0 hidden md:block"
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

      {/* Footer - BlueAllyAI Branding */}
      <footer className={cn(
        "border-t border-border py-2 px-4",
        isMobile && !selectedCompany && (viewMode === 'matrix' || viewMode === 'list') ? "hidden" : ""
      )}>
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>Powered by</span>
          <div className="flex items-center gap-0.5">
            <img 
              src={isDark ? "/images/blueally-logo-white.png" : "/images/blueally-logo-color.png"}
              alt="BlueAlly" 
              className="h-4 object-contain"
            />
            <span className={cn(
              "font-bold",
              isDark ? "text-white" : "text-[#001B5E]"
            )}>
              AI
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile company detail - full screen overlay */}
      <AnimatePresence>
        {selectedCompany && isMobile && viewMode !== 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background md:hidden flex flex-col"
          >
            <div className="flex-1 overflow-hidden">
              <CompanyDetail
                company={selectedCompany}
                onClose={() => setSelectedCompany(null)}
              />
            </div>
            {/* Mobile detail footer */}
            <div className="border-t border-border py-2 px-4">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <span>Powered by</span>
                <div className="flex items-center gap-0.5">
                  <img 
                    src={isDark ? "/images/blueally-logo-white.png" : "/images/blueally-logo-color.png"}
                    alt="BlueAlly" 
                    className="h-4 object-contain"
                  />
                  <span className={cn(
                    "font-bold",
                    isDark ? "text-white" : "text-[#001B5E]"
                  )}>
                    AI
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom navigation - quick filter indicator */}
      {isMobile && !selectedCompany && viewMode !== 'dashboard' && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <img 
                src={isDark ? "/images/blueally-logo-white.png" : "/images/blueally-logo-color.png"}
                alt="BlueAlly" 
                className="h-3.5 object-contain"
              />
              <span className={cn(
                "text-xs font-bold",
                isDark ? "text-white" : "text-[#001B5E]"
              )}>
                AI
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              • <span className="font-mono">{filteredCompanies.length}</span> of {data.companies.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs",
              hasActiveFilters && "border-primary text-primary"
            )}
            onClick={() => setSidebarOpen(true)}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px]">
                {filters.quadrants.length + filters.categories.length + filters.tiers.length}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Add bottom padding on mobile when bottom nav is visible */}
      {isMobile && !selectedCompany && viewMode !== 'dashboard' && <div className="h-14" />}
    </div>
  );
}
