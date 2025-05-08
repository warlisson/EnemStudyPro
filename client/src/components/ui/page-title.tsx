import React from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function PageTitle({ title, description, icon }: PageTitleProps) {
  return (
    <div className="flex items-center space-x-4">
      {icon && <div>{icon}</div>}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}