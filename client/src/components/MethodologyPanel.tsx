/**
 * Methodology Panel Component
 * Displays scoring methodology and formulas
 * Design: Financial Terminal Precision - technical documentation style
 */

import { Info, Calculator, Target, Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import type { Methodology } from '@/types/portfolio';
import { QUADRANT_CONFIG, TIER_CONFIG } from '@/types/portfolio';

interface MethodologyPanelProps {
  methodology: Methodology;
}

export function MethodologyPanel({ methodology }: MethodologyPanelProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Methodology</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">
            Impact-Feasibility Matrix Methodology
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
            <TabsTrigger value="feasibility" className="text-xs">Feasibility</TabsTrigger>
            <TabsTrigger value="tiers" className="text-xs">Tiers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Scoring Formulas
              </h3>
              
              <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs space-y-2">
                <div>
                  <span className="text-muted-foreground">Impact Score = </span>
                  <span className="text-foreground">{methodology.impactFormula}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Feasibility Score = </span>
                  <span className="text-foreground">{methodology.feasibilityFormula}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority Score = </span>
                  <span className="text-foreground">{methodology.priorityFormula}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Quadrant threshold: <span className="font-mono text-foreground">{methodology.quadrantThreshold}</span> (mid-point of weighted 1-10 scale)
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Quadrant Definitions
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(QUADRANT_CONFIG).map(([key, config]) => (
                  <div 
                    key={key}
                    className="p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: config.bgColor,
                      borderColor: config.color + '40'
                    }}
                  >
                    <div 
                      className="font-mono font-semibold text-sm"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {config.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Impact Score Components (Y-Axis)
              </h3>
              <p className="text-xs text-muted-foreground">
                Measuring Business Value from AI Implementation
              </p>
              
              <div className="space-y-3">
                {methodology.impactComponents.map((component, index) => (
                  <div 
                    key={index}
                    className="bg-secondary/50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {component.name}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-primary/20 text-primary rounded">
                        {component.weight}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {component.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feasibility" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Feasibility Score Components (X-Axis)
              </h3>
              <p className="text-xs text-muted-foreground">
                Measuring Implementation Readiness
              </p>
              
              <div className="space-y-3">
                {methodology.feasibilityComponents.map((component, index) => (
                  <div 
                    key={index}
                    className="bg-secondary/50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {component.name}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-primary/20 text-primary rounded">
                        {component.weight}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {component.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Priority Tier Definitions
              </h3>
              
              <div className="space-y-3">
                {methodology.tierDefinitions.map((tier, index) => {
                  const tierKey = tier.tier.includes('1') ? 'Tier 1' : 
                                  tier.tier.includes('2') ? 'Tier 2' : 'Tier 3';
                  const config = TIER_CONFIG[tierKey as keyof typeof TIER_CONFIG];
                  
                  return (
                    <div 
                      key={index}
                      className="p-3 rounded-lg border"
                      style={{ 
                        backgroundColor: config.color + '15',
                        borderColor: config.color + '40'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          className="font-mono font-semibold text-sm"
                          style={{ color: config.color }}
                        >
                          {tier.tier}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {tier.threshold}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tier.criteria}
                      </div>
                      <div className="text-xs text-foreground mt-2 font-mono">
                        Timeline: {tier.timeline}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default MethodologyPanel;
