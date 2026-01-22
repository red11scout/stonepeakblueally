/**
 * IFM Matrix Component
 * Interactive scatter plot visualization for Impact-Feasibility Matrix
 * Design: Financial Terminal Precision - supports both light and dark themes
 */

import { useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Company, Quadrant, Category } from '@/types/portfolio';

// Category colors for avatar backgrounds
const CATEGORY_AVATAR_COLORS: Record<Category, string> = {
  'Digital Infrastructure': '3B82F6',
  'Energy & Energy Transition': '10B981',
  'Transport & Logistics': 'F59E0B',
  'Social Infrastructure': '8B5CF6',
  'Real Estate': 'EC4899'
};

// Generate avatar URL using UI Avatars API
function getAvatarUrl(name: string, category: Category): string {
  const initials = name
    .split(/[\s\-\(\)]+/)
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  const bgColor = CATEGORY_AVATAR_COLORS[category] || '6B7280';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=64&bold=true&format=png`;
}
import { QUADRANT_CONFIG, CATEGORY_CONFIG } from '@/types/portfolio';
import { formatRevenue, formatEmployees } from '@/hooks/usePortfolioData';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface IFMMatrixProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  threshold?: number;
}

// Scale configuration
const SCALE = {
  min: 4,
  max: 10,
  padding: 0.3
};

// Calculate position percentage from score
function scoreToPercent(score: number): number {
  const range = SCALE.max - SCALE.min;
  const adjusted = (score - SCALE.min) / range;
  return Math.max(0, Math.min(100, adjusted * 100));
}

// Get dot size based on revenue
function getDotSize(revenue: number): number {
  if (!revenue || revenue === 0) return 8;
  if (revenue >= 5e9) return 20;
  if (revenue >= 1e9) return 16;
  if (revenue >= 500e6) return 14;
  if (revenue >= 100e6) return 12;
  return 10;
}

// Theme-aware quadrant colors
const QUADRANT_COLORS = {
  light: {
    Champions: { color: '#16a34a', bgColor: 'rgba(22, 163, 74, 0.12)' },
    Strategic: { color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.12)' },
    'Quick Wins': { color: '#ea580c', bgColor: 'rgba(234, 88, 12, 0.12)' },
    Foundation: { color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.12)' }
  },
  dark: {
    Champions: { color: '#238636', bgColor: 'rgba(35, 134, 54, 0.15)' },
    Strategic: { color: '#1F6FEB', bgColor: 'rgba(31, 111, 235, 0.15)' },
    'Quick Wins': { color: '#F0883E', bgColor: 'rgba(240, 136, 62, 0.15)' },
    Foundation: { color: '#6E7681', bgColor: 'rgba(110, 118, 129, 0.12)' }
  }
};

export function IFMMatrix({ 
  companies, 
  selectedCompany, 
  onSelectCompany,
  threshold = 6.5 
}: IFMMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const quadrantColors = isDark ? QUADRANT_COLORS.dark : QUADRANT_COLORS.light;

  // Calculate threshold position
  const thresholdPercent = scoreToPercent(threshold);

  // Handle mouse move for crosshair
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  // Group companies by quadrant for stats
  const quadrantStats = useMemo(() => {
    const stats: Record<Quadrant, number> = {
      'Champions': 0,
      'Strategic': 0,
      'Quick Wins': 0,
      'Foundation': 0
    };
    companies.forEach(c => {
      stats[c.quadrant]++;
    });
    return stats;
  }, [companies]);

  return (
    <div className="relative w-full h-full">
      {/* Matrix Container */}
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full h-full rounded-lg border border-border overflow-hidden crosshair-cursor",
          isDark ? "bg-[#0D1117]" : "bg-[#f8fafc]"
        )}
        onMouseMove={handleMouseMove}
        onClick={() => onSelectCompany(null)}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-50" />

        {/* Quadrant backgrounds */}
        <div className="absolute inset-0">
          {/* Champions - top right */}
          <div 
            className="absolute"
            style={{
              left: `${thresholdPercent}%`,
              bottom: `${thresholdPercent}%`,
              right: 0,
              top: 0,
              background: quadrantColors['Champions'].bgColor
            }}
          />
          {/* Strategic - top left */}
          <div 
            className="absolute"
            style={{
              left: 0,
              bottom: `${thresholdPercent}%`,
              right: `${100 - thresholdPercent}%`,
              top: 0,
              background: quadrantColors['Strategic'].bgColor
            }}
          />
          {/* Quick Wins - bottom right */}
          <div 
            className="absolute"
            style={{
              left: `${thresholdPercent}%`,
              top: `${thresholdPercent}%`,
              right: 0,
              bottom: 0,
              background: quadrantColors['Quick Wins'].bgColor
            }}
          />
          {/* Foundation - bottom left */}
          <div 
            className="absolute"
            style={{
              left: 0,
              top: `${thresholdPercent}%`,
              right: `${100 - thresholdPercent}%`,
              bottom: 0,
              background: quadrantColors['Foundation'].bgColor
            }}
          />
        </div>

        {/* Threshold lines */}
        <div 
          className={cn(
            "absolute w-px",
            isDark ? "bg-white/20" : "bg-slate-400/40"
          )}
          style={{ 
            left: `${thresholdPercent}%`, 
            top: 0, 
            bottom: 0 
          }}
        />
        <div 
          className={cn(
            "absolute h-px",
            isDark ? "bg-white/20" : "bg-slate-400/40"
          )}
          style={{ 
            bottom: `${thresholdPercent}%`, 
            left: 0, 
            right: 0 
          }}
        />

        {/* Quadrant labels */}
        <div 
          className="absolute top-3 right-3 text-xs font-mono"
          style={{ color: isDark ? 'rgba(35, 134, 54, 0.7)' : 'rgba(22, 163, 74, 0.8)' }}
        >
          CHAMPIONS ({quadrantStats['Champions']})
        </div>
        <div 
          className="absolute top-3 left-3 text-xs font-mono"
          style={{ color: isDark ? 'rgba(31, 111, 235, 0.7)' : 'rgba(37, 99, 235, 0.8)' }}
        >
          STRATEGIC ({quadrantStats['Strategic']})
        </div>
        <div 
          className="absolute bottom-3 right-3 text-xs font-mono"
          style={{ color: isDark ? 'rgba(240, 136, 62, 0.7)' : 'rgba(234, 88, 12, 0.8)' }}
        >
          QUICK WINS ({quadrantStats['Quick Wins']})
        </div>
        <div 
          className="absolute bottom-3 left-3 text-xs font-mono"
          style={{ color: isDark ? 'rgba(110, 118, 129, 0.7)' : 'rgba(100, 116, 139, 0.8)' }}
        >
          FOUNDATION ({quadrantStats['Foundation']})
        </div>

        {/* Axis labels */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-mono text-muted-foreground">
          FEASIBILITY SCORE →
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 -rotate-90 text-xs font-mono text-muted-foreground whitespace-nowrap">
          IMPACT SCORE →
        </div>

        {/* Scale markers - X axis */}
        {[4, 5, 6, 7, 8, 9, 10].map(val => (
          <div 
            key={`x-${val}`}
            className="absolute bottom-0 text-[10px] font-mono text-muted-foreground/50 -translate-x-1/2"
            style={{ left: `${scoreToPercent(val)}%` }}
          >
            {val}
          </div>
        ))}

        {/* Scale markers - Y axis */}
        {[4, 5, 6, 7, 8, 9, 10].map(val => (
          <div 
            key={`y-${val}`}
            className="absolute left-1 text-[10px] font-mono text-muted-foreground/50 translate-y-1/2"
            style={{ bottom: `${scoreToPercent(val)}%` }}
          >
            {val}
          </div>
        ))}

        {/* Data points */}
        <AnimatePresence>
          {companies.map((company, index) => {
            const x = scoreToPercent(company.feasibilityScore);
            const y = scoreToPercent(company.impactScore);
            const size = getDotSize(company.revenue || 0);
            const isSelected = selectedCompany?.name === company.name;
            const isHovered = hoveredCompany?.name === company.name;
            const quadrantColor = quadrantColors[company.quadrant].color;
            const categoryColor = CATEGORY_CONFIG[company.category]?.color || '#888';

            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: isSelected ? 1.3 : isHovered ? 1.15 : 1,
                  zIndex: isSelected ? 100 : isHovered ? 50 : 10
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  delay: index * 0.02,
                  duration: 0.2,
                  ease: 'easeOut'
                }}
                className={cn(
                  "absolute rounded-full cursor-pointer transition-shadow duration-150",
                  isSelected && (isDark 
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0D1117]"
                    : "ring-2 ring-slate-800 ring-offset-2 ring-offset-[#f8fafc]"
                  ),
                  company.quadrant === 'Champions' && "glow-champions",
                  company.quadrant === 'Strategic' && "glow-strategic",
                  company.quadrant === 'Quick Wins' && "glow-quickwins"
                )}
                style={{
                  left: `${x}%`,
                  bottom: `${y}%`,
                  width: size,
                  height: size,
                  backgroundColor: quadrantColor,
                  border: `2px solid ${categoryColor}`,
                  transform: 'translate(-50%, 50%)'
                }}
                onMouseEnter={() => setHoveredCompany(company)}
                onMouseLeave={() => setHoveredCompany(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCompany(isSelected ? null : company);
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredCompany && !selectedCompany && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: Math.min(mousePos.x + 15, (containerRef.current?.clientWidth || 0) - 220),
                top: Math.max(mousePos.y - 80, 10)
              }}
            >
              <div className="bg-card border border-border rounded-md p-3 shadow-xl min-w-[200px]">
                <div className="flex items-center gap-2">
                  <img 
                    src={getAvatarUrl(hoveredCompany.name, hoveredCompany.category)}
                    alt={hoveredCompany.name}
                    className={cn(
                      "w-6 h-6 rounded object-contain",
                      isDark ? "bg-white/10" : "bg-slate-100"
                    )}
                  />
                  <div className="font-mono text-sm font-semibold text-foreground">
                    {hoveredCompany.name}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {hoveredCompany.category}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="ml-1 text-foreground">{hoveredCompany.impactScore.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Feasibility:</span>
                    <span className="ml-1 text-foreground">{hoveredCompany.feasibilityScore.toFixed(1)}</span>
                  </div>
                  {hoveredCompany.revenue && hoveredCompany.revenue > 0 && (
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="ml-1 text-foreground">{formatRevenue(hoveredCompany.revenue)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Employees:</span>
                    <span className="ml-1 text-foreground">{formatEmployees(hoveredCompany.employees)}</span>
                  </div>
                </div>
                <div 
                  className="mt-2 px-2 py-1 rounded text-xs font-mono text-center"
                  style={{ 
                    backgroundColor: quadrantColors[hoveredCompany.quadrant].bgColor,
                    color: quadrantColors[hoveredCompany.quadrant].color
                  }}
                >
                  {hoveredCompany.quadrant}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default IFMMatrix;
