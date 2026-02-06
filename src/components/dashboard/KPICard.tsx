import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  alert?: boolean;
}

export const KPICard = ({ title, value, subtitle, icon: Icon, trend, alert }: KPICardProps) => {
  return (
    <div className={cn(
      "kpi-card animate-fade-in",
      alert && "border-destructive/50 bg-destructive/5"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-2xl font-bold tracking-tight",
            alert && "text-destructive"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg",
          alert ? "bg-destructive/10" : "bg-accent/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            alert ? "text-destructive" : "text-accent"
          )} />
        </div>
      </div>
      {trend && (
        <div className={cn(
          "mt-2 text-xs font-medium",
          trend === 'up' && "text-success",
          trend === 'down' && "text-destructive",
          trend === 'neutral' && "text-muted-foreground"
        )}>
          {trend === 'up' && '↑ Acima da média'}
          {trend === 'down' && '↓ Abaixo da média'}
          {trend === 'neutral' && '→ Na média do setor'}
        </div>
      )}
    </div>
  );
};
