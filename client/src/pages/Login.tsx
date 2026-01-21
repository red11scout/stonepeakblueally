/**
 * Login Page - Password Protected Access
 * Design: Clean, professional login with BlueAllyAI branding
 * - Responsive for mobile and desktop
 * - Supports both light and dark themes
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(password);
    if (!success) {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-4",
      isDark 
        ? "bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]" 
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Login Card */}
        <div className={cn(
          "rounded-2xl border p-8 shadow-2xl",
          isDark 
            ? "bg-[#161B22]/90 border-[#30363D] backdrop-blur-xl" 
            : "bg-white/90 border-slate-200 backdrop-blur-xl"
        )}>
          {/* BlueAlly Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-1 mb-4">
              <img 
                src={isDark ? "/images/blueally-logo-white.png" : "/images/blueally-logo-color.png"}
                alt="BlueAlly" 
                className="h-10 sm:h-12 object-contain"
              />
              <span className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight",
                isDark ? "text-white" : "text-[#001B5E]"
              )}>
                AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              StonePeak Impact-Feasibility Matrix
            </p>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              isDark 
                ? "bg-blue-500/10 border border-blue-500/20" 
                : "bg-blue-50 border border-blue-100"
            )}>
              <Lock className={cn(
                "h-8 w-8",
                isDark ? "text-blue-400" : "text-blue-600"
              )} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground mb-1">
              Protected Access
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter password to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "h-12 pr-12 font-mono text-base",
                  isDark 
                    ? "bg-[#0D1117] border-[#30363D] focus:border-blue-500" 
                    : "bg-slate-50 border-slate-200 focus:border-blue-500"
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={!password || isLoading}
              className={cn(
                "w-full h-12 text-base font-medium",
                isDark 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-[#001B5E] hover:bg-[#002B7E]"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <span className={cn(
              "font-semibold",
              isDark ? "text-blue-400" : "text-[#001B5E]"
            )}>
              BlueAlly
            </span>
            <span className={cn(
              "font-bold",
              isDark ? "text-white" : "text-[#001B5E]"
            )}>
              AI
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
