import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Newspaper,
  LineChart,
  HelpCircle,
  Book,
  MapPin,
  Box,
  Menu,
  X
} from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Subject } from "./sidebar";

const subjectColors: Record<string, { dot: string, hover: string, text: string }> = {
  portugues: { dot: "bg-blue-500", hover: "hover:text-blue-700", text: "text-blue-600" },
  matematica: { dot: "bg-green-500", hover: "hover:text-green-700", text: "text-green-600" },
  literatura: { dot: "bg-purple-500", hover: "hover:text-purple-700", text: "text-purple-600" },
  ingles: { dot: "bg-blue-500", hover: "hover:text-blue-700", text: "text-blue-600" },
  quimica: { dot: "bg-green-500", hover: "hover:text-green-700", text: "text-green-600" },
  fisica: { dot: "bg-yellow-500", hover: "hover:text-yellow-700", text: "text-yellow-600" },
  biologia: { dot: "bg-green-500", hover: "hover:text-green-700", text: "text-green-600" },
  historia: { dot: "bg-red-500", hover: "hover:text-red-700", text: "text-red-600" },
  geografia: { dot: "bg-orange-500", hover: "hover:text-orange-700", text: "text-orange-600" },
  filosofia: { dot: "bg-indigo-500", hover: "hover:text-indigo-700", text: "text-indigo-600" },
  sociologia: { dot: "bg-pink-500", hover: "hover:text-pink-700", text: "text-pink-600" },
  redacao: { dot: "bg-purple-500", hover: "hover:text-purple-700", text: "text-purple-600" },
};

const mainNavItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Novidades", href: "/novidades", icon: Newspaper },
  { label: "Meu Desempenho", href: "/desempenho", icon: LineChart },
  { label: "Questões", href: "/questoes", icon: HelpCircle },
  { label: "Disciplinas", href: "/disciplinas", icon: Book },
  { label: "Trilhas de Aprendizado", href: "/trilhas", icon: MapPin },
];

const subjects: Subject[] = [
  { id: "portugues", name: "Português", route: "/disciplinas/portugues" },
  { id: "ingles", name: "Inglês", route: "/disciplinas/ingles" },
  { id: "literatura", name: "Literatura", route: "/disciplinas/literatura" },
  { id: "redacao", name: "Redação", route: "/disciplinas/redacao" },
  { id: "historia", name: "História", route: "/disciplinas/historia" },
  { id: "geografia", name: "Geografia", route: "/disciplinas/geografia" },
  { id: "filosofia", name: "Filosofia", route: "/disciplinas/filosofia" },
  { id: "sociologia", name: "Sociologia", route: "/disciplinas/sociologia" },
  { id: "matematica", name: "Matemática", route: "/disciplinas/matematica" },
  { id: "fisica", name: "Física", route: "/disciplinas/fisica" },
  { id: "quimica", name: "Química", route: "/disciplinas/quimica" },
  { id: "biologia", name: "Biologia", route: "/disciplinas/biologia" },
];

export default function MobileSidebar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden bg-white border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2">
          <Box className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-neutral-800">prisma</span>
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="p-0 h-10 w-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <div className="flex flex-col h-full">
            {/* User info */}
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-primary text-sm font-medium">WM</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">Warlisson Miranda</p>
                  <p className="text-xs text-neutral-500">warlisson@email.com</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {mainNavItems.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a 
                          className={cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive 
                              ? "bg-primary-50 text-primary" 
                              : "text-neutral-700 hover:text-primary hover:bg-primary-50/50"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <item.icon className="w-5 h-5 mr-2 text-neutral-500" />
                          <span>{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-8 px-4">
                <p className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Disciplinas
                </p>
                <ul className="mt-2 space-y-1">
                  {subjects.map((subject) => {
                    const colorConfig = subjectColors[subject.id];
                    return (
                      <li key={subject.id}>
                        <Link href={subject.route}>
                          <a 
                            className={cn(
                              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                              colorConfig.text,
                              colorConfig.hover
                            )}
                            onClick={() => setOpen(false)}
                          >
                            <span className={cn("w-2 h-2 mr-2 rounded-full", colorConfig.dot)}></span>
                            <span>{subject.name}</span>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
