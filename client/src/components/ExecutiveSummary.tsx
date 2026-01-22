/**
 * Executive Summary Component
 * Provides strategic overview with Hybrid Wave-Cohort Strategy, PE Value Creation, and Next Steps
 * Design: Professional executive briefing format with clear visual hierarchy
 */

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Zap,
  Building2,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Rocket,
  Shield,
  BarChart3,
  PieChart,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Award,
  Briefcase,
  Settings,
  FileText,
  Network,
  Cpu,
  Truck,
  Heart,
  Server,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/portfolio';

interface ExecutiveSummaryProps {
  companies: Company[];
}

// Cohort definitions
const COHORTS = [
  {
    name: 'Digital Infrastructure',
    count: 15,
    description: 'Data centers, fiber, broadband, towers',
    icon: Server,
    color: '#3B82F6',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  {
    name: 'Energy',
    count: 22,
    description: 'LNG, renewables, midstream, storage',
    icon: Flame,
    color: '#22C55E',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  {
    name: 'Transport',
    count: 12,
    description: 'Cold storage, ports, aviation, marine',
    icon: Truck,
    color: '#F59E0B',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  {
    name: 'Social Infrastructure',
    count: 6,
    description: 'Healthcare, education, real estate',
    icon: Heart,
    color: '#8B5CF6',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  }
];

// Wave timeline data
const WAVES = [
  {
    name: 'Champions Wave',
    timeline: 'Months 1-12',
    companies: '12-15',
    objectives: 'Prove value; establish best practices; vendor agreements',
    color: '#22C55E',
    progress: 100
  },
  {
    name: 'Strategic Wave',
    timeline: 'Months 9-24',
    companies: '20-25',
    objectives: 'Scale proven solutions; capture cross-cohort synergies',
    color: '#3B82F6',
    progress: 60
  },
  {
    name: 'Foundation Wave',
    timeline: 'Months 18-36',
    companies: '15-20',
    objectives: 'Deploy mature solutions with established playbooks',
    color: '#6B7280',
    progress: 20
  }
];

// Value creation opportunities
const VALUE_CREATION = {
  revenueGrowth: {
    title: 'Revenue Growth',
    potential: '$800M-1.2B',
    icon: TrendingUp,
    color: '#22C55E',
    items: [
      { name: 'Customer Intelligence', description: 'Predictive models for expansion, churn, engagement timing' },
      { name: 'Dynamic Pricing', description: 'Real-time optimization balancing utilization and value' },
      { name: 'Market Intelligence', description: 'AI-powered expansion and competitive positioning' }
    ]
  },
  marginExpansion: {
    title: 'Margin Expansion',
    potential: '200-400 bps',
    icon: BarChart3,
    color: '#3B82F6',
    items: [
      { name: 'Process Optimization', description: 'Intelligent automation of complex operations' },
      { name: 'Yield Improvement', description: 'AI-driven optimization of utilization and quality' },
      { name: 'Workforce Productivity', description: 'Intelligent scheduling, routing, task automation' }
    ]
  },
  costCutting: {
    title: 'Cost Cutting',
    potential: '$400-600M',
    icon: DollarSign,
    color: '#F59E0B',
    items: [
      { name: 'Predictive Maintenance', description: 'Reducing unplanned downtime, extending asset life' },
      { name: 'Energy Optimization', description: 'AI-controlled consumption in energy-intensive operations' },
      { name: 'Automation', description: 'Self-service and intelligent automation reducing labor' }
    ]
  }
};

// Next steps timeline
const NEXT_STEPS = {
  immediate: {
    title: 'Immediate',
    timeline: '30 Days',
    color: '#EF4444',
    items: [
      { id: 1, task: 'Board Approval', description: 'Secure approval for Hybrid Wave-Cohort strategy and budget' },
      { id: 2, task: 'Wave 1 Notification', description: 'Notify Champion companies; initiate CEO engagement' },
      { id: 3, task: 'AI CoE Charter', description: 'Draft charter for portfolio AI Center of Excellence' },
      { id: 4, task: 'Vendor RFPs', description: 'Issue RFPs for portfolio-level AI platform partnerships' }
    ]
  },
  nearTerm: {
    title: 'Near-Term',
    timeline: '30-90 Days',
    color: '#F59E0B',
    items: [
      { id: 5, task: 'Deep Dives', description: 'Comprehensive AI readiness assessments for Wave 1' },
      { id: 6, task: 'Use Case Prioritization', description: 'Detailed business cases with ROI projections' },
      { id: 7, task: 'Cohort Working Groups', description: 'Establish quarterly cohort sessions for shared learning' },
      { id: 8, task: 'Talent Strategy', description: 'Develop shared services and training programs' }
    ]
  },
  mediumTerm: {
    title: 'Medium-Term',
    timeline: '90-180 Days',
    color: '#22C55E',
    items: [
      { id: 9, task: 'Wave 1 Pilots', description: 'Launch first AI pilots with 90-day proof points' },
      { id: 10, task: 'Wave 2 Prep', description: 'Begin readiness investments for Strategic quadrant' },
      { id: 11, task: 'Governance', description: 'Implement AI governance and responsible AI framework' },
      { id: 12, task: 'Value Tracking', description: 'Deploy portfolio-wide AI value tracking dashboard' }
    ]
  }
};

export function ExecutiveSummary({ companies }: ExecutiveSummaryProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    strategy: true,
    value: true,
    nextSteps: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate portfolio stats
  const stats = useMemo(() => {
    const quadrantCounts = companies.reduce((acc, c) => {
      acc[c.quadrant] = (acc[c.quadrant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryCounts = companies.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { quadrantCounts, categoryCounts };
  }, [companies]);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
          Executive Briefing
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          AI Transformation Strategy
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hybrid Wave-Cohort deployment strategy for StonePeak's portfolio of {companies.length} companies
        </p>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-500">{stats.quadrantCounts['Champions'] || 0}</div>
            <div className="text-xs text-muted-foreground">Champions</div>
          </CardContent>
        </Card>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">$1.2-2.2B</div>
            <div className="text-xs text-muted-foreground">Value Potential</div>
          </CardContent>
        </Card>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-500">36</div>
            <div className="text-xs text-muted-foreground">Month Timeline</div>
          </CardContent>
        </Card>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-500">4</div>
            <div className="text-xs text-muted-foreground">Industry Cohorts</div>
          </CardContent>
        </Card>
      </div>

      {/* Hybrid Wave-Cohort Strategy Section */}
      <Collapsible open={expandedSections.strategy} onOpenChange={() => toggleSection('strategy')}>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-primary/20" : "bg-primary/10"
                  )}>
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Hybrid Wave-Cohort Strategy</CardTitle>
                    <CardDescription>Recommended deployment approach</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expandedSections.strategy ? (
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
              {/* Strategy Overview */}
              <div className={cn(
                "p-4 rounded-lg border",
                isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-blue-50 border-blue-200"
              )}>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We recommend organizing the portfolio into <strong className="text-foreground">four industry cohorts</strong> deployed 
                    in <strong className="text-foreground">three overlapping waves</strong>. This approach enables shared learning within 
                    industries while maintaining momentum across the portfolio.
                  </p>
                </div>
              </div>

              {/* Industry Cohorts */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  Industry Cohorts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {COHORTS.map((cohort) => {
                    const Icon = cohort.icon;
                    return (
                      <div
                        key={cohort.name}
                        className={cn(
                          "p-4 rounded-lg border transition-all hover:shadow-md",
                          isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200",
                          cohort.bgColor
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4" style={{ color: cohort.color }} />
                          <span className="text-xs font-semibold text-foreground">{cohort.name}</span>
                        </div>
                        <div className="text-2xl font-bold mb-1" style={{ color: cohort.color }}>
                          {cohort.count}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {cohort.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wave Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Deployment Waves
                </h4>
                <div className="space-y-3">
                  {WAVES.map((wave, index) => (
                    <div
                      key={wave.name}
                      className={cn(
                        "p-4 rounded-lg border",
                        isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                      )}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 min-w-[140px]">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: wave.color }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{wave.name}</div>
                            <div className="text-xs text-muted-foreground">{wave.timeline}</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">{wave.companies} companies</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{wave.objectives}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Visual */}
              <div className={cn(
                "p-4 rounded-lg border",
                isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
              )}>
                <h4 className="text-xs font-semibold text-foreground mb-4">36-Month Timeline</h4>
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="h-2 bg-muted rounded-full mb-4">
                    <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-gray-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  {/* Month markers */}
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Month 1</span>
                    <span>Month 9</span>
                    <span>Month 18</span>
                    <span>Month 24</span>
                    <span>Month 36</span>
                  </div>
                  {/* Wave indicators */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-[10px] text-muted-foreground">Champions (1-12)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-[10px] text-muted-foreground">Strategic (9-24)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span className="text-[10px] text-muted-foreground">Foundation (18-36)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* PE Value Creation Section */}
      <Collapsible open={expandedSections.value} onOpenChange={() => toggleSection('value')}>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-green-500/20" : "bg-green-500/10"
                  )}>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">PE Value Creation Through AI</CardTitle>
                    <CardDescription>$1.2-2.2B total value potential</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expandedSections.value ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {Object.entries(VALUE_CREATION).map(([key, category]) => {
                const Icon = category.icon;
                return (
                  <div
                    key={key}
                    className={cn(
                      "p-4 rounded-lg border",
                      isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" style={{ color: category.color }} />
                        <span className="font-semibold text-foreground">{category.title}</span>
                      </div>
                      <Badge 
                        className="font-mono"
                        style={{ 
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          borderColor: `${category.color}40`
                        }}
                      >
                        {category.potential}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-foreground">{item.name}:</span>
                            <span className="text-sm text-muted-foreground ml-1">{item.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Recommended Next Steps Section */}
      <Collapsible open={expandedSections.nextSteps} onOpenChange={() => toggleSection('nextSteps')}>
        <Card className={cn(
          "border",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
        )}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-amber-500/20" : "bg-amber-500/10"
                  )}>
                    <Rocket className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
                    <CardDescription>180-day action plan</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {expandedSections.nextSteps ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {Object.entries(NEXT_STEPS).map(([key, phase]) => (
                <div
                  key={key}
                  className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ backgroundColor: phase.color }}
                    >
                      {phase.title}
                    </div>
                    <span className="text-sm text-muted-foreground">{phase.timeline}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {phase.items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-start gap-3",
                          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
                        )}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: phase.color }}
                        >
                          {item.id}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{item.task}</div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Footer */}
      <div className={cn(
        "text-center p-4 rounded-lg border",
        isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
      )}>
        <p className="text-xs text-muted-foreground">
          This executive summary is based on analysis of {companies.length} portfolio companies across 5 industry categories.
          Use the Matrix and List views to explore individual company details.
        </p>
      </div>
    </div>
  );
}
