import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Link } from "wouter";

interface SubjectCardProps {
  title: string;
  questionCount: number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  href: string;
  className?: string;
}

export function SubjectCard({
  title,
  questionCount,
  icon,
  iconBgColor,
  iconColor,
  href,
  className
}: SubjectCardProps) {
  return (
    <Link href={href} className={cn(
      "bg-white rounded-xl shadow-sm p-6 border border-neutral-200",
      "flex flex-col items-center justify-center",
      "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
      className
    )}>
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", iconBgColor)}>
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="text-neutral-800 font-medium text-center">{title}</h3>
      <p className="text-xs text-neutral-500 text-center mt-1">{questionCount} questões</p>
    </Link>
  );
}
