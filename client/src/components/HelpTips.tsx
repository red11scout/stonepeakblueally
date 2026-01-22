/**
 * Help Tips Component
 * Provides contextual help and user guidance throughout the app
 * Design: Non-intrusive, educational, dismissible
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  MousePointer,
  Filter,
  BarChart3,
  List,
  Search,
  Info,
  Sparkles,
  Target,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'navigation' | 'feature' | 'insight';
}

const TIPS: Tip[] = [
  {
    id: 'matrix-click',
    title: 'Click to Explore',
    description: 'Click on any data point in the matrix to view detailed company information, scores breakdown, and recommended AI actions.',
    icon: <MousePointer className="h-4 w-4" />,
    category: 'navigation'
  },
  {
    id: 'filter-quadrant',
    title: 'Filter by Quadrant',
    description: 'Use the quadrant filters to focus on specific company groups. Champions are ready for AI transformation, while Foundation companies need capability building first.',
    icon: <Filter className="h-4 w-4" />,
    category: 'feature'
  },
  {
    id: 'dashboard-view',
    title: 'Executive Dashboard',
    description: 'Switch to the Dashboard tab for visual summaries, charts, and portfolio-wide insights. Perfect for executive presentations.',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'feature'
  },
  {
    id: 'list-sort',
    title: 'Sortable List View',
    description: 'The List view allows you to sort companies by any column. Click column headers to sort by Impact, Feasibility, or Priority scores.',
    icon: <List className="h-4 w-4" />,
    category: 'feature'
  },
  {
    id: 'search-companies',
    title: 'Quick Search',
    description: 'Use the search bar to quickly find specific companies by name. The matrix and list will filter in real-time.',
    icon: <Search className="h-4 w-4" />,
    category: 'navigation'
  },
  {
    id: 'tier-priority',
    title: 'Understanding Tiers',
    description: 'Tier 1 companies (Priority ≥8.0) should begin AI transformation immediately. Tier 2 (6.5-7.9) need targeted initiatives. Tier 3 (<6.5) require foundational work.',
    icon: <Layers className="h-4 w-4" />,
    category: 'insight'
  },
  {
    id: 'methodology',
    title: 'Learn the Methodology',
    description: 'Click the Methodology button to understand how Impact and Feasibility scores are calculated, including component weights and formulas.',
    icon: <Info className="h-4 w-4" />,
    category: 'feature'
  },
  {
    id: 'champions-insight',
    title: 'Champions Quadrant',
    description: 'Companies in the Champions quadrant (top-right) have both high AI value potential and strong implementation readiness. These are your priority investments.',
    icon: <Target className="h-4 w-4" />,
    category: 'insight'
  }
];

interface HelpTipsProps {
  className?: string;
  variant?: 'banner' | 'floating' | 'inline';
  showOnFirstVisit?: boolean;
}

export function HelpTips({ className, variant = 'floating', showOnFirstVisit = true }: HelpTipsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  useEffect(() => {
    // Check if user has seen tips before
    const hasSeenTips = localStorage.getItem('stonepeak-ifm-tips-seen');
    if (!hasSeenTips && showOnFirstVisit) {
      setIsVisible(true);
      localStorage.setItem('stonepeak-ifm-tips-seen', 'true');
    }
  }, [showOnFirstVisit]);

  const currentTip = TIPS[currentTipIndex];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + TIPS.length) % TIPS.length);
  };

  const dismissTip = () => {
    setDismissedTips([...dismissedTips, currentTip.id]);
    if (dismissedTips.length + 1 >= TIPS.length) {
      setIsVisible(false);
    } else {
      nextTip();
    }
  };

  const closeTips = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={cn("gap-2", className)}
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Tips</span>
      </Button>
    );
  }

  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={cn(
            "fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]",
            className
          )}
        >
          <div className={cn(
            "rounded-xl border shadow-lg overflow-hidden",
            isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
          )}>
            {/* Header */}
            <div className={cn(
              "flex items-center justify-between px-4 py-3 border-b",
              isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            )}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-foreground">Quick Tips</span>
                <Badge variant="secondary" className="text-[10px]">
                  {currentTipIndex + 1}/{TIPS.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={closeTips}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  currentTip.category === 'navigation' && "bg-blue-500/10 text-blue-500",
                  currentTip.category === 'feature' && "bg-green-500/10 text-green-500",
                  currentTip.category === 'insight' && "bg-amber-500/10 text-amber-500"
                )}>
                  {currentTip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {currentTip.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentTip.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={cn(
              "flex items-center justify-between px-4 py-3 border-t",
              isDark ? "border-[#30363D]" : "border-slate-200"
            )}>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={prevTip}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={nextTip}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="text-xs h-7"
                onClick={closeTips}
              >
                Got it
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Banner variant
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "border-b overflow-hidden",
        isDark ? "bg-[#161B22] border-[#30363D]" : "bg-amber-50 border-amber-200",
        className
      )}
    >
      <div className="container py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-xs text-muted-foreground truncate">
            <strong className="text-foreground">{currentTip.title}:</strong> {currentTip.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={prevTip}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {currentTipIndex + 1}/{TIPS.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={nextTip}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={closeTips}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Inline tooltip for specific features
interface FeatureTooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FeatureTooltip({ title, description, children }: FeatureTooltipProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={cn(
              "absolute z-50 w-64 p-3 rounded-lg border shadow-lg",
              "top-full left-1/2 -translate-x-1/2 mt-2",
              isDark ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
            )}
          >
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-medium text-foreground mb-1">{title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Welcome modal for first-time users
interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden",
          isDark ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
        )}
      >
        {/* Header */}
        <div className={cn(
          "p-6 text-center border-b",
          isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
        )}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Welcome to the AI Impact-Feasibility Matrix
          </h2>
          <p className="text-sm text-muted-foreground">
            Your guide to AI transformation across the StonePeak portfolio
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <QuickGuideItem
              icon={<MousePointer className="h-4 w-4" />}
              title="Explore Companies"
              description="Click any point to see details"
              isDark={isDark}
            />
            <QuickGuideItem
              icon={<Filter className="h-4 w-4" />}
              title="Filter & Search"
              description="Focus on specific segments"
              isDark={isDark}
            />
            <QuickGuideItem
              icon={<BarChart3 className="h-4 w-4" />}
              title="View Dashboard"
              description="See portfolio summaries"
              isDark={isDark}
            />
            <QuickGuideItem
              icon={<Info className="h-4 w-4" />}
              title="Learn Methodology"
              description="Understand the scoring"
              isDark={isDark}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t",
          isDark ? "border-[#30363D]" : "border-slate-200"
        )}>
          <Button className="w-full" onClick={onClose}>
            Get Started
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function QuickGuideItem({ 
  icon, 
  title, 
  description,
  isDark 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  isDark: boolean;
}) {
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      isDark ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
    )}>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-primary">{icon}</div>
        <span className="text-xs font-medium text-foreground">{title}</span>
      </div>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

export default HelpTips;
