import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Card } from "./card";
import { ChevronRight } from "lucide-react";

interface StudyMaterialCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  href: string;
  className?: string;
}

export function StudyMaterialCard({
  title,
  description,
  image,
  category,
  categoryColor,
  categoryBg,
  href,
  className
}: StudyMaterialCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-neutral-200", className)}>
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className={cn("px-2 py-1 text-xs font-medium rounded", categoryBg, categoryColor)}>
            {category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{description}</p>
        <Link href={href} className="text-primary hover:text-primary-700 text-sm font-medium flex items-center">
          Continuar lendo
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
