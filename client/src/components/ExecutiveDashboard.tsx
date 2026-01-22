/**
 * Executive Dashboard Component
 * Provides visual summary of portfolio AI readiness with charts, insights, and methodology
 * Design: Data-rich visualizations with clear explanations
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Building2,
  Info,
  ChevronRight,
  ChevronDown,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Calculator,
  Layers,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTheme } from '@/contexts/ThemeContext';
import { Company, QUADRANT_CONFIG, TIER_CONFIG } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface ExecutiveDashboardProps {
  companies: Company[];
  onSelectCompany?: (company: Company) => void;
}

// Quadrant colors
const QUADRANT_COLORS = {
  Champions: '#22C55E',
  Strategic: '#3B82F6',
  'Quick Wins': '#F59E0B',
  Foundation: '#6B7280'
};

// Category colors
const CATEGORY_COLORS = {
  'Digital Infrastructure': '#06B6D4',
  'Energy & Energy Transition': '#22C55E',
  'Transport & Logistics': '#F97316',
  'Social Infrastructure': '#EAB308',
  'Real Estate': '#A855F7'
};

export function ExecutiveDashboard({ companies, onSelectCompany }: ExecutiveDashboardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [methodologyOpen, setMethodologyOpen] = useState(true);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const quadrantCounts = companies.reduce((acc, c) => {
      acc[c.quadrant] = (acc[c.quadrant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryCounts = companies.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tierCounts = companies.reduce((acc, c) => {
      acc[c.tier] = (acc[c.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgImpact = companies.reduce((sum, c) => sum + c.impactScore, 0) / companies.length;
    const avgFeasibility = companies.reduce((sum, c) => sum + c.feasibilityScore, 0) / companies.length;
    const avgPriority = companies.reduce((sum, c) => sum + c.priorityScore, 0) / companies.length;

    // Category averages for radar chart
    const categoryAverages = Object.keys(CATEGORY_COLORS).map(category => {
      const categoryCompanies = companies.filter(c => c.category === category);
      if (categoryCompanies.length === 0) return { category, impact: 0, feasibility: 0, count: 0 };
      return {
        category: category.split(' ')[0], // Shortened name for chart
        fullCategory: category,
        impact: categoryCompanies.reduce((sum, c) => sum + c.impactScore, 0) / categoryCompanies.length,
        feasibility: categoryCompanies.reduce((sum, c) => sum + c.feasibilityScore, 0) / categoryCompanies.length,
        count: categoryCompanies.length
      };
    });

    // Top performers
    const topPerformers = [...companies]
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5);

    // Companies needing attention (Foundation with low scores)
    const needsAttention = companies
      .filter(c => c.quadrant === 'Foundation' && c.priorityScore < 6)
      .slice(0, 5);

    return {
      quadrantCounts,
      categoryCounts,
      tierCounts,
      avgImpact,
      avgFeasibility,
      avgPriority,
      categoryAverages,
      topPerformers,
      needsAttention,
      championsPercent: ((quadrantCounts['Champions'] || 0) / companies.length * 100).toFixed(1),
      tier1Percent: ((tierCounts['Tier 1'] || 0) / companies.length * 100).toFixed(1)
    };
  }, [companies]);

  // Prepare chart data
  const quadrantData = Object.entries(stats.quadrantCounts).map(([name, value]) => ({
    name,
    value,
    color: QUADRANT_COLORS[name as keyof typeof QUADRANT_COLORS]
  }));

  const categoryData = Object.entries(stats.categoryCounts).map(([name, value]) => ({
    name: name.split(' ')[0], // Shortened for chart
    fullName: name,
    value,
    color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS]
  }));

  const tierData = [
    { name: 'Tier 1', value: stats.tierCounts['Tier 1'] || 0, color: '#22C55E', description: 'Immediate Priority' },
    { name: 'Tier 2', value: stats.tierCounts['Tier 2'] || 0, color: '#3B82F6', description: 'Medium-term Focus' },
    { name: 'Tier 3', value: stats.tierCounts['Tier 3'] || 0, color: '#6B7280', description: 'Long-term Development' }
  ];

  const chartTextColor = isDark ? '#94A3B8' : '#64748B';
  const chartGridColor = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Methodology Section - Collapsible */}
      <Collapsible open={methodologyOpen} onOpenChange={setMethodologyOpen}>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-secondary/20 transition-colors pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-blue-500/10" : "bg-blue-50"
                  )}>
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                      Methodology & Scoring Guide
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Understanding how AI readiness scores are calculated
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {methodologyOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-6">
              {/* What is IFM */}
              <div className={cn(
                "p-4 rounded-lg border",
                isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-amber-50 border-amber-200"
              )}>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">What is the Impact-Feasibility Matrix?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The <strong className="text-foreground">Impact-Feasibility Matrix (IFM)</strong> is a strategic 
                      framework that evaluates and prioritizes AI initiatives across StonePeak's portfolio. It answers two critical questions: 
                      <strong className="text-foreground"> "Where can AI create the most value?"</strong> (Impact) and 
                      <strong className="text-foreground"> "Where can AI be implemented most successfully?"</strong> (Feasibility).
                    </p>
                  </div>
                </div>
              </div>

              {/* Scoring Formulas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-semibold text-foreground">Impact Score</span>
                    <Badge className="text-[9px] h-4 bg-green-500/10 text-green-500 border-green-500/20">Y-Axis</Badge>
                  </div>
                  <div className={cn(
                    "font-mono text-[10px] p-2 rounded",
                    isDark ? "bg-[#161B22]" : "bg-white"
                  )}>
                    (Revenue × 0.3) + (Efficiency × 0.25) + (Competitive × 0.25) + (CX × 0.2)
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Measures potential value AI can create through revenue growth, operational efficiency, competitive advantage, and customer experience.
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-semibold text-foreground">Feasibility Score</span>
                    <Badge className="text-[9px] h-4 bg-blue-500/10 text-blue-500 border-blue-500/20">X-Axis</Badge>
                  </div>
                  <div className={cn(
                    "font-mono text-[10px] p-2 rounded",
                    isDark ? "bg-[#161B22]" : "bg-white"
                  )}>
                    (Data × 0.3) + (Tech × 0.25) + (Talent × 0.25) + (Change × 0.2)
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Measures organizational readiness through data infrastructure, technology stack, talent capabilities, and change management capacity.
                  </p>
                </div>

                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-semibold text-foreground">Priority Score</span>
                    <Badge className="text-[9px] h-4 bg-purple-500/10 text-purple-500 border-purple-500/20">Ranking</Badge>
                  </div>
                  <div className={cn(
                    "font-mono text-[10px] p-2 rounded",
                    isDark ? "bg-[#161B22]" : "bg-white"
                  )}>
                    (Impact × 0.5) + (Feasibility × 0.5)
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Combined score used to assign priority tiers. Tier 1 (≥8.0): Immediate action. Tier 2 (6.5-7.9): Medium-term. Tier 3 (&lt;6.5): Long-term.
                  </p>
                </div>
              </div>

              {/* Quadrant Definitions - 2x2 grid matching matrix layout */}
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Quadrant Definitions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Row 1: Strategic (top-left in matrix), Champions (top-right in matrix) */}
                  {/* Row 2: Foundation (bottom-left in matrix), Quick Wins (bottom-right in matrix) */}
                  {(['Strategic', 'Champions', 'Foundation', 'Quick Wins'] as const).map((key) => {
                    const config = QUADRANT_CONFIG[key];
                    return (
                      <div 
                        key={key}
                        className="p-3 rounded-lg border transition-all"
                        style={{ 
                          backgroundColor: isDark ? config.bgColor : config.bgColor,
                          borderColor: config.color + '40'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div 
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          <span 
                            className="font-mono font-semibold text-xs"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          {config.description}
                        </p>
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-[9px] text-muted-foreground">
                            <strong className="text-foreground">Strategy:</strong> {
                              key === 'Champions' ? 'Full AI transformation' :
                              key === 'Strategic' ? 'Targeted high-impact pilots' :
                              key === 'Quick Wins' ? 'Rapid efficiency gains' :
                              'Build foundational capabilities'
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score Components Detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Impact Components */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
                )}>
                  <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Impact Score Components
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Revenue Enhancement', weight: '30%', desc: 'AI-driven revenue growth potential' },
                      { name: 'Operational Efficiency', weight: '25%', desc: 'Cost reduction & productivity gains' },
                      { name: 'Competitive Advantage', weight: '25%', desc: 'Market differentiation through AI' },
                      { name: 'Customer Experience', weight: '20%', desc: 'Service quality improvements' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-mono text-foreground">{item.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feasibility Components */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
                )}>
                  <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Feasibility Score Components
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Data Readiness', weight: '30%', desc: 'Quality & accessibility of data' },
                      { name: 'Technology Stack', weight: '25%', desc: 'Infrastructure & integration capability' },
                      { name: 'Talent & Skills', weight: '25%', desc: 'AI/ML expertise availability' },
                      { name: 'Change Management', weight: '20%', desc: 'Organizational adaptability' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-mono text-foreground">{item.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          title="Portfolio Average"
          subtitle="Impact Score"
          value={stats.avgImpact.toFixed(1)}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={stats.avgImpact >= 7 ? 'positive' : 'neutral'}
          tooltip="Average Impact Score across all portfolio companies. Higher scores indicate greater potential for AI-driven value creation."
          isDark={isDark}
        />
        <MetricCard
          title="Portfolio Average"
          subtitle="Feasibility Score"
          value={stats.avgFeasibility.toFixed(1)}
          icon={<Target className="h-4 w-4" />}
          trend={stats.avgFeasibility >= 7 ? 'positive' : 'neutral'}
          tooltip="Average Feasibility Score measuring organizational readiness for AI implementation."
          isDark={isDark}
        />
        <MetricCard
          title="Champions"
          subtitle="High Impact & Feasibility"
          value={`${stats.championsPercent}%`}
          icon={<Award className="h-4 w-4" />}
          trend="positive"
          tooltip="Percentage of companies in the Champions quadrant - ready for comprehensive AI transformation."
          isDark={isDark}
        />
        <MetricCard
          title="Tier 1 Priority"
          subtitle="Immediate Action"
          value={`${stats.tier1Percent}%`}
          icon={<Zap className="h-4 w-4" />}
          trend="positive"
          tooltip="Percentage of companies requiring immediate AI strategy deployment within 12-18 months."
          isDark={isDark}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Quadrant Distribution */}
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                  Quadrant Distribution
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Companies grouped by Impact & Feasibility scores
                </CardDescription>
              </div>
              <InfoTooltip content="The matrix divides companies into four quadrants based on their Impact (potential value) and Feasibility (readiness) scores. Champions are ready for full AI transformation, while Foundation companies need capability building first." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quadrantData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {quadrantData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number, name: string) => [`${value} companies`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                  Category Breakdown
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Portfolio companies by industry sector
                </CardDescription>
              </div>
              <InfoTooltip content="Distribution of portfolio companies across StonePeak's five core investment categories. Each category has unique AI opportunity profiles and implementation considerations." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: chartTextColor }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: chartTextColor }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} companies`,
                      props.payload.fullName
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Tiers & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Priority Tiers */}
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                  Priority Tiers
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Implementation timeline recommendations
                </CardDescription>
              </div>
              <InfoTooltip content="Companies are assigned to priority tiers based on their combined Impact and Feasibility scores. Tier 1 companies should begin AI transformation immediately, while Tier 3 companies need foundational work first." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tierData.map((tier) => (
                <div key={tier.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: tier.color }}
                      />
                      <span className="font-medium text-foreground">{tier.name}</span>
                      <span className="text-muted-foreground">({tier.description})</span>
                    </div>
                    <span className="font-mono font-semibold text-foreground">{tier.value}</span>
                  </div>
                  <div className={cn(
                    "h-2 rounded-full overflow-hidden",
                    isDark ? "bg-[#0D1117]" : "bg-slate-100"
                  )}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(tier.value / companies.length) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tier Explanation */}
            <div className={cn(
              "mt-4 p-3 rounded-lg text-xs",
              isDark ? "bg-[#0D1117]" : "bg-slate-50"
            )}>
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Tier assignment</strong> is based on the Priority Score formula: 
                  <span className="font-mono text-[10px] bg-secondary px-1 py-0.5 rounded mx-1">
                    (Impact × 0.5) + (Feasibility × 0.5)
                  </span>
                  Scores ≥8.0 = Tier 1, 6.5-7.9 = Tier 2, &lt;6.5 = Tier 3.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance Radar */}
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                  Category Performance
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Average scores by industry sector
                </CardDescription>
              </div>
              <InfoTooltip content="Radar chart showing average Impact and Feasibility scores for each category. Larger areas indicate higher overall AI readiness within that sector." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={stats.categoryAverages}>
                  <PolarGrid stroke={chartGridColor} />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fontSize: 9, fill: chartTextColor }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fontSize: 8, fill: chartTextColor }}
                  />
                  <Radar
                    name="Impact"
                    dataKey="impact"
                    stroke="#22C55E"
                    fill="#22C55E"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Feasibility"
                    dataKey="feasibility"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '10px' }}
                    formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                    formatter={(value: number) => value.toFixed(1)}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Performers */}
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                  Top Performers
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px]">Tier 1</Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Highest priority companies for AI transformation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topPerformers.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectCompany?.(company)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                    isDark 
                      ? "hover:bg-[#0D1117] border border-transparent hover:border-[#30363D]" 
                      : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold"
                      style={{ 
                        backgroundColor: QUADRANT_COLORS[company.quadrant as keyof typeof QUADRANT_COLORS] + '20',
                        color: QUADRANT_COLORS[company.quadrant as keyof typeof QUADRANT_COLORS]
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{company.name}</p>
                      <p className="text-[10px] text-muted-foreground">{company.category.split(' ')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs font-mono font-semibold text-green-500">
                        {company.priorityScore.toFixed(1)}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Priority</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-mono uppercase tracking-wide text-foreground">
                  Needs Development
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px]">Foundation</Badge>
            </div>
            <CardDescription className="text-xs mt-1">
              Companies requiring capability building before AI adoption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.needsAttention.length > 0 ? (
                stats.needsAttention.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelectCompany?.(company)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                      isDark 
                        ? "hover:bg-[#0D1117] border border-transparent hover:border-[#30363D]" 
                        : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{company.name}</p>
                        <p className="text-[10px] text-muted-foreground">{company.category.split(' ')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs font-mono font-semibold text-amber-500">
                          {company.priorityScore.toFixed(1)}
                        </p>
                        <p className="text-[9px] text-muted-foreground">Priority</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className={cn(
                  "p-4 rounded-lg text-center",
                  isDark ? "bg-[#0D1117]" : "bg-slate-50"
                )}>
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    All Foundation companies have acceptable baseline scores
                  </p>
                </div>
              )}
            </div>
            
            {/* Development Tip */}
            <div className={cn(
              "mt-4 p-3 rounded-lg text-xs",
              isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"
            )}>
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Foundation companies</strong> should focus on building data infrastructure, 
                  technology capabilities, and organizational readiness before pursuing advanced AI initiatives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ 
  title, 
  subtitle, 
  value, 
  icon, 
  trend, 
  tooltip,
  isDark 
}: { 
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral';
  tooltip: string;
  isDark: boolean;
}) {
  return (
    <Card className={cn(
      "border",
      isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
    )}>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between mb-2">
          <div className={cn(
            "p-1.5 rounded-md",
            trend === 'positive' ? "bg-green-500/10 text-green-500" :
            trend === 'negative' ? "bg-red-500/10 text-red-500" :
            "bg-blue-500/10 text-blue-500"
          )}>
            {icon}
          </div>
          <UITooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px] text-xs">
              {tooltip}
            </TooltipContent>
          </UITooltip>
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className={cn(
            "text-xl md:text-2xl font-mono font-bold",
            trend === 'positive' ? "text-green-500" :
            trend === 'negative' ? "text-red-500" :
            "text-foreground"
          )}>
            {value}
          </p>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <UITooltip>
      <TooltipTrigger>
        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[250px] text-xs leading-relaxed">
        {content}
      </TooltipContent>
    </UITooltip>
  );
}
