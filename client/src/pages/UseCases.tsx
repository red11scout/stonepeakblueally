/**
 * Use Cases Page - Comprehensive AI Assessment Analysis
 * Features:
 * - Company selector with 15 Tier 1 companies
 * - 7 sections: Overview, Strategic, KPIs, Friction, Use Cases, Benefits, Roadmap
 * - Cross-company analytics and pattern detection
 * - Interactive calculations with HyperFormula
 * - Visual storytelling with charts and tables
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Target,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  FileText,
  Filter,
  Search,
  Download,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTheme } from '@/contexts/ThemeContext';
import { useAssessmentData, getStepData, formatCurrency, parseCurrency } from '@/hooks/useAssessmentData';
import type { 
  StrategicTheme, 
  BusinessKPI, 
  FrictionPoint, 
  AIUseCase, 
  BenefitQuantification, 
  PriorityRoadmap 
} from '@shared/assessmentTypes';
import { cn } from '@/lib/utils';

// Section navigation items
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'strategic', label: 'Strategic', icon: Target },
  { id: 'kpis', label: 'KPIs', icon: BarChart3 },
  { id: 'friction', label: 'Friction', icon: AlertTriangle },
  { id: 'usecases', label: 'Use Cases', icon: Lightbulb },
  { id: 'benefits', label: 'Benefits', icon: DollarSign },
  { id: 'roadmap', label: 'Roadmap', icon: Calendar },
];

// Severity color mapping
const SEVERITY_COLORS = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

// Priority tier color mapping
const PRIORITY_COLORS = {
  Critical: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  High: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Medium: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

interface UseCasesProps {
  onBack?: () => void;
}

export default function UseCases({ onBack }: UseCasesProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {
    assessments,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    selectedAssessment,
    aggregatedMetrics,
    crossCompanyPatterns,
  } = useAssessmentData();

  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUseCases, setExpandedUseCases] = useState<Set<string>>(new Set());

  // Extract data from selected assessment
  const assessmentData = useMemo(() => {
    if (!selectedAssessment) return null;

    return {
      overview: selectedAssessment.analysis.steps.find(s => s.step === 0)?.content || '',
      strategic: getStepData<StrategicTheme>(selectedAssessment, 'Strategic Anchoring & Business Drivers'),
      kpis: getStepData<BusinessKPI>(selectedAssessment, 'Business Function Inventory & KPI Baselines'),
      friction: getStepData<FrictionPoint>(selectedAssessment, 'Friction Point Mapping'),
      useCases: getStepData<AIUseCase>(selectedAssessment, 'AI Use Case Generation'),
      benefits: getStepData<BenefitQuantification>(selectedAssessment, 'Benefits Quantification by Driver'),
      roadmap: getStepData<PriorityRoadmap>(selectedAssessment, 'Priority Scoring & Roadmap'),
      summary: selectedAssessment.analysis.summary,
      dashboard: selectedAssessment.analysis.executiveDashboard,
    };
  }, [selectedAssessment]);

  // Toggle use case expansion
  const toggleUseCase = (id: string) => {
    const newExpanded = new Set(expandedUseCases);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedUseCases(newExpanded);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="font-mono text-sm text-muted-foreground">
            Loading AI assessments...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-destructive text-4xl">⚠</div>
          <h1 className="font-mono text-lg font-semibold text-foreground">
            Failed to Load Assessments
          </h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="font-mono text-sm font-semibold text-foreground">
                AI USE CASE ANALYSIS
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Tier 1 Portfolio Companies
              </p>
            </div>
          </div>

          {/* Company Selector */}
          <div className="flex items-center gap-2">
            <Select value={selectedCompany || ''} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Select company..." />
              </SelectTrigger>
              <SelectContent>
                {assessments.map(a => (
                  <SelectItem key={a.companyName} value={a.companyName}>
                    {a.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="h-9 w-9" title="Export Report">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Section Navigation */}
        {selectedCompany && (
          <div className="border-t border-border">
            <ScrollArea className="w-full">
              <div className="flex items-center gap-1 px-4 py-2">
                {SECTIONS.map(section => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'h-8 gap-1.5 text-xs whitespace-nowrap',
                        activeSection === section.id && 'bg-primary/10 text-primary'
                      )}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {section.label}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {!selectedCompany ? (
          // Portfolio Overview when no company selected
          <PortfolioOverview
            assessments={assessments}
            aggregatedMetrics={aggregatedMetrics}
            crossCompanyPatterns={crossCompanyPatterns}
            onSelectCompany={setSelectedCompany}
            isDark={isDark}
          />
        ) : assessmentData ? (
          // Company Assessment View
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6 space-y-6">
              <AnimatePresence mode="wait">
                {activeSection === 'overview' && (
                  <OverviewSection
                    key="overview"
                    content={assessmentData.overview}
                    dashboard={assessmentData.dashboard}
                    companyName={selectedCompany}
                    isDark={isDark}
                  />
                )}
                {activeSection === 'strategic' && (
                  <StrategicSection
                    key="strategic"
                    data={assessmentData.strategic}
                    isDark={isDark}
                  />
                )}
                {activeSection === 'kpis' && (
                  <KPIsSection
                    key="kpis"
                    data={assessmentData.kpis}
                    isDark={isDark}
                  />
                )}
                {activeSection === 'friction' && (
                  <FrictionSection
                    key="friction"
                    data={assessmentData.friction}
                    isDark={isDark}
                  />
                )}
                {activeSection === 'usecases' && (
                  <UseCasesSection
                    key="usecases"
                    data={assessmentData.useCases}
                    benefits={assessmentData.benefits}
                    expandedUseCases={expandedUseCases}
                    toggleUseCase={toggleUseCase}
                    isDark={isDark}
                  />
                )}
                {activeSection === 'benefits' && (
                  <BenefitsSection
                    key="benefits"
                    data={assessmentData.benefits}
                    dashboard={assessmentData.dashboard}
                    isDark={isDark}
                  />
                )}
                {activeSection === 'roadmap' && (
                  <RoadmapSection
                    key="roadmap"
                    data={assessmentData.roadmap}
                    isDark={isDark}
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        ) : null}
      </main>
    </div>
  );
}

// Portfolio Overview Component
function PortfolioOverview({
  assessments,
  aggregatedMetrics,
  crossCompanyPatterns,
  onSelectCompany,
  isDark,
}: {
  assessments: any[];
  aggregatedMetrics: any;
  crossCompanyPatterns: any;
  onSelectCompany: (company: string) => void;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 space-y-6"
    >
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-2xl md:text-3xl font-bold text-emerald-400">
              {formatCurrency(aggregatedMetrics.totalAnnualValue)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total Annual Value</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-2xl md:text-3xl font-bold text-blue-400">
              {aggregatedMetrics.totalUseCases}
            </div>
            <div className="text-xs text-muted-foreground mt-1">AI Use Cases</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="text-2xl md:text-3xl font-bold text-orange-400">
              {aggregatedMetrics.totalFrictionPoints}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Friction Points</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-2xl md:text-3xl font-bold text-purple-400">
              {aggregatedMetrics.companiesCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Companies Analyzed</div>
          </CardContent>
        </Card>
      </div>

      {/* Company Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Select a Company</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessments.map(assessment => (
            <Card
              key={assessment.companyName}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelectCompany(assessment.companyName)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{assessment.companyName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assessment.analysis.executiveDashboard.topUseCases.length} top use cases
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatCurrency(assessment.analysis.executiveDashboard.totalAnnualValue)}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Progress
                    value={(assessment.analysis.executiveDashboard.totalAnnualValue / aggregatedMetrics.totalAnnualValue) * 100}
                    className="h-1.5"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {((assessment.analysis.executiveDashboard.totalAnnualValue / aggregatedMetrics.totalAnnualValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cross-Company Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Business Functions</CardTitle>
            <CardDescription>Most common functions across portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crossCompanyPatterns.functions.slice(0, 5).map((pattern: any, idx: number) => (
                <div key={pattern.pattern} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                    <span className="text-sm">{pattern.pattern}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {pattern.companies.length} companies
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Primitives Distribution</CardTitle>
            <CardDescription>Most used AI capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crossCompanyPatterns.aiPrimitives.slice(0, 5).map((pattern: any, idx: number) => (
                <div key={pattern.pattern} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                    <span className="text-sm">{pattern.pattern}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {pattern.frequency} uses
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// Overview Section Component
function OverviewSection({
  content,
  dashboard,
  companyName,
  isDark,
}: {
  content: string;
  dashboard: any;
  companyName: string;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Executive Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {formatCurrency(dashboard.totalAnnualValue)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Cost Savings</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {formatCurrency(dashboard.totalCostBenefit)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Revenue Growth</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {formatCurrency(dashboard.totalRevenueBenefit)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Risk Reduction</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {formatCurrency(dashboard.totalRiskBenefit)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {companyName} Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-sm text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Top 5 Use Cases by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboard.topUseCases.map((uc: any) => (
              <div key={uc.rank} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {uc.rank}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{uc.useCase}</div>
                  <div className="text-xs text-muted-foreground">
                    Priority Score: {uc.priorityScore}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-400">
                    {formatCurrency(uc.annualValue)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">annual value</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Strategic Section Component
function StrategicSection({ data, isDark }: { data: StrategicTheme[]; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Strategic Anchoring & Business Drivers</h2>
      </div>

      <div className="grid gap-4">
        {data.map((theme, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{theme['Strategic Theme']}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/10">
                    {theme['Primary Driver']}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {theme['Secondary Driver']}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="text-xs font-medium text-red-400 mb-1">Current State</div>
                  <div className="text-sm text-muted-foreground">{theme['Current State']}</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-xs font-medium text-emerald-400 mb-1">Target State</div>
                  <div className="text-sm text-muted-foreground">{theme['Target State']}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// KPIs Section Component
function KPIsSection({ data, isDark }: { data: BusinessKPI[]; isDark: boolean }) {
  // Group KPIs by function
  const groupedKPIs = useMemo(() => {
    const groups: Record<string, BusinessKPI[]> = {};
    data.forEach(kpi => {
      if (!groups[kpi.Function]) {
        groups[kpi.Function] = [];
      }
      groups[kpi.Function].push(kpi);
    });
    return groups;
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Business Function Inventory & KPI Baselines</h2>
      </div>

      {Object.entries(groupedKPIs).map(([func, kpis]) => (
        <Card key={func}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{func}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">KPI</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Baseline</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Target</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Benchmark</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.map((kpi, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-2 px-2">
                        <div className="font-medium">{kpi['KPI Name']}</div>
                        <div className="text-xs text-muted-foreground">{kpi['Sub-Function']}</div>
                      </td>
                      <td className="text-center py-2 px-2 font-mono text-xs">{kpi['Baseline Value']}</td>
                      <td className="text-center py-2 px-2">
                        <span className={cn(
                          'font-mono text-xs',
                          kpi.Direction === '↑' ? 'text-emerald-400' : 'text-blue-400'
                        )}>
                          {kpi.Direction} {kpi['Target Value']}
                        </span>
                      </td>
                      <td className="text-center py-2 px-2 text-xs text-muted-foreground">{kpi['Industry Benchmark']}</td>
                      <td className="text-center py-2 px-2 text-xs">{kpi.Timeframe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}

// Friction Section Component
function FrictionSection({ data, isDark }: { data: FrictionPoint[]; isDark: boolean }) {
  // Sort by severity and cost
  const sortedFriction = useMemo(() => {
    const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...data].sort((a, b) => {
      const severityDiff = severityOrder[a.Severity] - severityOrder[b.Severity];
      if (severityDiff !== 0) return severityDiff;
      return parseCurrency(b['Estimated Annual Cost ($)']) - parseCurrency(a['Estimated Annual Cost ($)']);
    });
  }, [data]);

  const totalCost = useMemo(() => {
    return data.reduce((sum, f) => sum + parseCurrency(f['Estimated Annual Cost ($)']), 0);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Friction Point Mapping</h2>
        </div>
        <Badge variant="destructive" className="text-sm">
          Total: {formatCurrency(totalCost)}
        </Badge>
      </div>

      <div className="grid gap-3">
        {sortedFriction.map((friction, idx) => (
          <Card key={idx} className={cn('border-l-4', SEVERITY_COLORS[friction.Severity].replace('bg-', 'border-l-'))}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn('text-xs', SEVERITY_COLORS[friction.Severity])}>
                      {friction.Severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{friction.Function} → {friction['Sub-Function']}</span>
                  </div>
                  <p className="text-sm text-foreground">{friction['Friction Point']}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {friction['Primary Driver Impact']}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">
                    {friction['Estimated Annual Cost ($)']}
                  </div>
                  <div className="text-[10px] text-muted-foreground">annual cost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// Use Cases Section Component
function UseCasesSection({
  data,
  benefits,
  expandedUseCases,
  toggleUseCase,
  isDark,
}: {
  data: AIUseCase[];
  benefits: BenefitQuantification[];
  expandedUseCases: Set<string>;
  toggleUseCase: (id: string) => void;
  isDark: boolean;
}) {
  // Map benefits to use cases
  const benefitMap = useMemo(() => {
    const map: Record<string, BenefitQuantification> = {};
    benefits.forEach(b => {
      map[b.ID] = b;
    });
    return map;
  }, [benefits]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Use Cases</h2>
        <Badge variant="secondary" className="ml-2">{data.length} use cases</Badge>
      </div>

      <div className="grid gap-3">
        {data.map(useCase => {
          const benefit = benefitMap[useCase.ID];
          const isExpanded = expandedUseCases.has(useCase.ID);

          return (
            <Collapsible key={useCase.ID} open={isExpanded} onOpenChange={() => toggleUseCase(useCase.ID)}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {useCase.ID}
                        </div>
                        <div>
                          <CardTitle className="text-base">{useCase['Use Case Name']}</CardTitle>
                          <CardDescription className="mt-1">
                            {useCase.Function} → {useCase['Sub-Function']}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {benefit && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">
                              {benefit['Total Annual Value ($)']}
                            </div>
                            <div className="text-[10px] text-muted-foreground">annual value</div>
                          </div>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Description</h4>
                        <p className="text-sm">{useCase.Description}</p>
                      </div>

                      {useCase['AI Primitives'] && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">AI Primitives</h4>
                          <div className="flex flex-wrap gap-2">
                            {useCase['AI Primitives'].split(',').map((primitive, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                {primitive.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Target Friction</h4>
                        <p className="text-sm text-orange-400">{useCase['Target Friction']}</p>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Human-in-the-Loop Checkpoint</h4>
                        <p className="text-sm text-blue-400">{useCase['Human-in-the-Loop Checkpoint']}</p>
                      </div>

                      {benefit && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="text-xs text-muted-foreground">Cost Benefit</div>
                            <div className="text-sm font-semibold text-blue-400">{benefit['Cost Benefit ($)']}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <div className="text-xs text-muted-foreground">Revenue Benefit</div>
                            <div className="text-sm font-semibold text-purple-400">{benefit['Revenue Benefit ($)']}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <div className="text-xs text-muted-foreground">Risk Benefit</div>
                            <div className="text-sm font-semibold text-orange-400">{benefit['Risk Benefit ($)']}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-xs text-muted-foreground">Success Probability</div>
                            <div className="text-sm font-semibold text-emerald-400">{(benefit['Probability of Success'] * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </motion.div>
  );
}

// Benefits Section Component
function BenefitsSection({
  data,
  dashboard,
  isDark,
}: {
  data: BenefitQuantification[];
  dashboard: any;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Benefits Quantification</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Cost Savings</div>
            <div className="text-xl font-bold text-blue-400">{formatCurrency(dashboard.totalCostBenefit)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((dashboard.totalCostBenefit / dashboard.totalAnnualValue) * 100).toFixed(0)}% of total
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Revenue Growth</div>
            <div className="text-xl font-bold text-purple-400">{formatCurrency(dashboard.totalRevenueBenefit)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((dashboard.totalRevenueBenefit / dashboard.totalAnnualValue) * 100).toFixed(0)}% of total
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Risk Reduction</div>
            <div className="text-xl font-bold text-orange-400">{formatCurrency(dashboard.totalRiskBenefit)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((dashboard.totalRiskBenefit / dashboard.totalAnnualValue) * 100).toFixed(0)}% of total
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Annual Value</div>
            <div className="text-xl font-bold text-emerald-400">{formatCurrency(dashboard.totalAnnualValue)}</div>
            <div className="text-xs text-muted-foreground mt-1">across all use cases</div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Use Case</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Cost</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Risk</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Success %</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((benefit, idx) => (
                  <tr key={benefit.ID} className="border-b border-border/50 hover:bg-secondary/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{benefit.ID}</span>
                        <span className="font-medium">{benefit['Use Case']}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-xs text-blue-400">
                      {benefit['Cost Benefit ($)']}
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-xs text-purple-400">
                      {benefit['Revenue Benefit ($)']}
                    </td>
                    <td className="text-right py-3 px-4 font-mono text-xs text-orange-400">
                      {benefit['Risk Benefit ($)']}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {(benefit['Probability of Success'] * 100).toFixed(0)}%
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4 font-mono font-semibold text-emerald-400">
                      {benefit['Total Annual Value ($)']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Roadmap Section Component
function RoadmapSection({ data, isDark }: { data: PriorityRoadmap[]; isDark: boolean }) {
  // Group by recommended phase
  const groupedByPhase = useMemo(() => {
    const groups: Record<string, PriorityRoadmap[]> = {};
    data.forEach(item => {
      const phase = item['Recommended Phase'];
      if (!groups[phase]) {
        groups[phase] = [];
      }
      groups[phase].push(item);
    });
    // Sort phases chronologically
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Priority Scoring & Roadmap</h2>
      </div>

      {/* Timeline View */}
      <div className="relative">
        {groupedByPhase.map(([phase, items], phaseIdx) => (
          <div key={phase} className="relative pl-8 pb-8 last:pb-0">
            {/* Timeline line */}
            {phaseIdx < groupedByPhase.length - 1 && (
              <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-border" />
            )}
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">{phaseIdx + 1}</span>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg">{phase}</h3>
              <p className="text-xs text-muted-foreground">{items.length} use cases</p>
            </div>

            <div className="grid gap-3">
              {items.sort((a, b) => b['Priority Score (0-100)'] - a['Priority Score (0-100)']).map(item => (
                <Card key={item.ID} className={cn('border-l-4', PRIORITY_COLORS[item['Priority Tier']].replace('bg-', 'border-l-'))}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">{item.ID}</span>
                          <Badge className={cn('text-xs', PRIORITY_COLORS[item['Priority Tier']])}>
                            {item['Priority Tier']}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{item['Use Case']}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{item['Priority Score (0-100)']}</div>
                        <div className="text-[10px] text-muted-foreground">priority score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Value Score</div>
                        <Progress value={(item['Value Score (0-40)'] / 40) * 100} className="h-2" />
                        <div className="text-xs mt-1">{item['Value Score (0-40)']}/40</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Effort Score</div>
                        <Progress value={(item['Effort Score (0-30)'] / 30) * 100} className="h-2" />
                        <div className="text-xs mt-1">{item['Effort Score (0-30)']}/30</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">TTV Score</div>
                        <Progress value={(item['TTV Score (0-30)'] / 30) * 100} className="h-2" />
                        <div className="text-xs mt-1">{item['TTV Score (0-30)']}/30</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
