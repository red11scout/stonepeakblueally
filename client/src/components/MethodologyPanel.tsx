/**
 * Methodology Panel Component
 * Comprehensive explanation of IFM scoring methodology
 * Design: Educational, clear, with visual aids
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Target,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronRight,
  Info,
  HelpCircle,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Zap,
  Building2,
  Clock,
  Award
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import type { Methodology } from '@/types/portfolio';
import { QUADRANT_CONFIG, TIER_CONFIG } from '@/types/portfolio';
import { cn } from '@/lib/utils';

interface MethodologyPanelProps {
  methodology: Methodology;
}

export function MethodologyPanel({ methodology }: MethodologyPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Methodology</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-3xl max-h-[90vh] p-0 overflow-hidden",
        isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
      )}>
        <DialogHeader className={cn(
          "p-6 pb-4 border-b",
          isDark ? "border-[#30363D]" : "border-slate-200"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-[#161B22]" : "bg-slate-100"
            )}>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-mono text-lg">
                Impact-Feasibility Matrix Methodology
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Understanding how AI readiness scores are calculated
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={cn(
                "grid w-full grid-cols-4 mb-6",
                isDark ? "bg-[#161B22]" : "bg-slate-100"
              )}>
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
                <TabsTrigger value="feasibility" className="text-xs">Feasibility</TabsTrigger>
                <TabsTrigger value="tiers" className="text-xs">Tiers & Quadrants</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* What is IFM */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    What is the Impact-Feasibility Matrix?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The <strong className="text-foreground">Impact-Feasibility Matrix (IFM)</strong> is a strategic 
                    framework designed to evaluate and prioritize AI initiatives across StonePeak's portfolio companies. 
                    It provides a data-driven approach to identify which companies are best positioned for AI 
                    transformation and what type of AI strategy each should pursue.
                  </p>
                  
                  <div className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-[#161B22] border-[#30363D]" : "bg-amber-50 border-amber-200"
                  )}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Key Insight</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          The matrix answers two critical questions: <strong className="text-foreground">"Where can AI create the most value?"</strong> (Impact) 
                          and <strong className="text-foreground">"Where can AI be implemented most successfully?"</strong> (Feasibility). 
                          Companies scoring high on both are prioritized for immediate AI transformation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Scoring Formulas */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Calculator className="h-4 w-4 text-primary" />
                    Scoring Formulas
                  </h3>
                  
                  <div className={cn(
                    "rounded-lg p-4 font-mono text-xs space-y-3",
                    isDark ? "bg-[#161B22] border border-[#30363D]" : "bg-slate-50 border border-slate-200"
                  )}>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Impact Score</span>
                      <div className="text-foreground bg-background/50 p-2 rounded">
                        {methodology.impactFormula}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Feasibility Score</span>
                      <div className="text-foreground bg-background/50 p-2 rounded">
                        {methodology.feasibilityFormula}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Priority Score</span>
                      <div className="text-foreground bg-background/50 p-2 rounded">
                        {methodology.priorityFormula}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    Quadrant threshold: <span className="font-mono text-foreground font-semibold">{methodology.quadrantThreshold}</span> (mid-point of weighted 1-10 scale)
                  </div>
                </div>

                <Separator />

                {/* Visual Quadrant Guide */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Target className="h-4 w-4 text-primary" />
                    Quadrant Overview
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(QUADRANT_CONFIG).map(([key, config]) => (
                      <div 
                        key={key}
                        className="p-3 rounded-lg border transition-all hover:scale-[1.02]"
                        style={{ 
                          backgroundColor: config.bgColor,
                          borderColor: config.color + '40'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          <span 
                            className="font-mono font-semibold text-sm"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Impact Tab */}
              <TabsContent value="impact" className="space-y-6 mt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Impact Score Components
                    </h3>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Y-Axis</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The Impact Score measures the potential value AI can create for a company, evaluating how much 
                    AI adoption could improve financial performance, competitive positioning, and customer experience.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {methodology.impactComponents.map((component, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {component.name}
                        </span>
                        <Badge variant="secondary" className="font-mono">
                          {component.weight}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {component.description}
                      </p>
                      
                      {/* Examples based on component */}
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Example Indicators</p>
                        <div className="flex flex-wrap gap-1.5">
                          {getImpactExamples(component.name).map((example, i) => (
                            <span 
                              key={i}
                              className={cn(
                                "text-[10px] px-2 py-1 rounded-full",
                                isDark ? "bg-[#0D1117] text-muted-foreground" : "bg-white text-muted-foreground border"
                              )}
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scoring Guide */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-green-500/5 border-green-500/20" : "bg-green-50 border-green-200"
                )}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">High Impact Indicators (Score 8-10)</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Companies with high impact scores typically have large revenue bases, operate in competitive markets 
                        where AI can differentiate, have customer-facing operations that benefit from personalization, 
                        and face significant operational risks that AI can mitigate.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Feasibility Tab */}
              <TabsContent value="feasibility" className="space-y-6 mt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Target className="h-4 w-4 text-blue-500" />
                      Feasibility Score Components
                    </h3>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">X-Axis</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The Feasibility Score assesses a company's readiness to successfully implement AI initiatives, 
                    evaluating foundational capabilities, infrastructure, talent, and market conditions.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {methodology.feasibilityComponents.map((component, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {component.name}
                        </span>
                        <Badge variant="secondary" className="font-mono">
                          {component.weight}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {component.description}
                      </p>
                      
                      {/* Examples based on component */}
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Example Indicators</p>
                        <div className="flex flex-wrap gap-1.5">
                          {getFeasibilityExamples(component.name).map((example, i) => (
                            <span 
                              key={i}
                              className={cn(
                                "text-[10px] px-2 py-1 rounded-full",
                                isDark ? "bg-[#0D1117] text-muted-foreground" : "bg-white text-muted-foreground border"
                              )}
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scoring Guide */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-50 border-blue-200"
                )}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">High Feasibility Indicators (Score 8-10)</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Companies with high feasibility scores have centralized data warehouses, modern cloud infrastructure, 
                        existing data science capabilities, operate in industries with proven AI use cases, and have 
                        investment timelines aligned with AI implementation cycles.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tiers & Quadrants Tab */}
              <TabsContent value="tiers" className="space-y-6 mt-0">
                {/* Priority Tiers */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Layers className="h-4 w-4 text-purple-500" />
                    Priority Tier Definitions
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Companies are assigned to tiers based on their combined Priority Score, which determines 
                    the recommended timeline and approach for AI transformation.
                  </p>
                  
                  <div className="space-y-3">
                    {methodology.tierDefinitions.map((tier, index) => {
                      const tierKey = tier.tier.includes('1') ? 'Tier 1' : 
                                      tier.tier.includes('2') ? 'Tier 2' : 'Tier 3';
                      const config = TIER_CONFIG[tierKey as keyof typeof TIER_CONFIG];
                      const Icon = tierKey === 'Tier 1' ? Zap : tierKey === 'Tier 2' ? Building2 : Clock;
                      
                      return (
                        <div 
                          key={index}
                          className="p-4 rounded-lg border"
                          style={{ 
                            backgroundColor: config.color + '10',
                            borderColor: config.color + '30'
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-lg shrink-0"
                              style={{ backgroundColor: config.color + '20' }}
                            >
                              <Icon className="h-4 w-4" style={{ color: config.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span 
                                  className="font-mono font-semibold text-sm"
                                  style={{ color: config.color }}
                                >
                                  {tier.tier}
                                </span>
                                <Badge variant="secondary" className="font-mono text-[10px]">
                                  {tier.threshold}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {tier.criteria}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-foreground font-medium">{tier.timeline}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Quadrant Strategies */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <Award className="h-4 w-4 text-amber-500" />
                    Quadrant-Specific Strategies
                  </h3>
                  
                  <div className="space-y-3">
                    <QuadrantStrategy
                      name="Champions"
                      color="#22C55E"
                      criteria="Impact ≥ 7.0 AND Feasibility ≥ 7.0"
                      strategy="Full AI Transformation"
                      actions={[
                        "Establish dedicated AI Center of Excellence",
                        "Deploy enterprise-wide AI initiatives",
                        "Target 12-18 month transformation timeline"
                      ]}
                      isDark={isDark}
                    />
                    <QuadrantStrategy
                      name="Strategic"
                      color="#3B82F6"
                      criteria="Impact ≥ 7.0 AND Feasibility < 7.0"
                      strategy="Build Then Deploy"
                      actions={[
                        "Prioritize data infrastructure investments",
                        "Develop AI talent pipeline",
                        "Run pilot projects to build experience"
                      ]}
                      isDark={isDark}
                    />
                    <QuadrantStrategy
                      name="Quick Wins"
                      color="#F59E0B"
                      criteria="Impact < 7.0 AND Feasibility ≥ 7.0"
                      strategy="Targeted AI Projects"
                      actions={[
                        "Identify high-ROI automation opportunities",
                        "Deploy proven AI solutions",
                        "Focus on operational efficiency gains"
                      ]}
                      isDark={isDark}
                    />
                    <QuadrantStrategy
                      name="Foundation"
                      color="#6B7280"
                      criteria="Impact < 7.0 AND Feasibility < 7.0"
                      strategy="Foundational Readiness"
                      actions={[
                        "Modernize core technology systems",
                        "Establish data governance practices",
                        "Develop digital literacy across organization"
                      ]}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components
function QuadrantStrategy({
  name,
  color,
  criteria,
  strategy,
  actions,
  isDark
}: {
  name: string;
  color: string;
  criteria: string;
  strategy: string;
  actions: string[];
  isDark: boolean;
}) {
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-foreground">{name}</span>
        <Badge variant="secondary" className="text-[10px] ml-auto">{strategy}</Badge>
      </div>
      <p className="text-[10px] font-mono text-muted-foreground mb-2">{criteria}</p>
      <div className="space-y-1">
        {actions.map((action, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{ color }} />
            <span className="text-xs text-muted-foreground">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions for examples
function getImpactExamples(componentName: string): string[] {
  const examples: Record<string, string[]> = {
    'Revenue/EBITDA Impact': ['Predictive maintenance', 'AI pricing optimization', 'Automated acquisition'],
    'Competitive Differentiation': ['Proprietary AI models', 'Superior insights', 'Faster time-to-market'],
    'Customer Experience': ['Personalized recommendations', 'Intelligent chatbots', 'Predictive service'],
    'Risk Reduction': ['Fraud detection', 'Predictive compliance', 'Supply chain monitoring']
  };
  return examples[componentName] || ['Data-driven decisions', 'Process automation', 'Predictive analytics'];
}

function getFeasibilityExamples(componentName: string): string[] {
  const examples: Record<string, string[]> = {
    'Data Availability': ['Centralized data warehouse', 'Clean historical data', 'Real-time pipelines'],
    'Technology Infrastructure': ['Cloud infrastructure', 'API-first architecture', 'Modern data platforms'],
    'Organization & Talent': ['Data science teams', 'AI governance', 'Change management'],
    'Industry AI Maturity': ['Established AI vendors', 'Industry benchmarks', 'Regulatory clarity'],
    'Timeline Fit': ['18-month windows', 'Value milestones', 'Exit timeline alignment']
  };
  return examples[componentName] || ['Technical readiness', 'Resource availability', 'Strategic alignment'];
}

export default MethodologyPanel;
