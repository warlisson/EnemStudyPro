import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Card, CardContent } from "./card";

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function DataCard({ 
  title, 
  value, 
  description, 
  icon, 
  iconBgColor = "bg-primary-100", 
  iconColor = "text-primary",
  className 
}: DataCardProps) {
  return (
    <Card className={cn("border border-neutral-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-700">{title}</h3>
          {icon && (
            <span className={cn("p-2 rounded-full", iconBgColor, iconColor)}>
              {icon}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-neutral-800">{value}</p>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
      </CardContent>
    </Card>
  );
}
