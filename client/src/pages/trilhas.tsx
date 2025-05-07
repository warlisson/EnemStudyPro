import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, PlayCircle, BookOpen, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Trilhas() {
  const [, navigate] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subjects for the main tabs
  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['/api/subjects'],
  });

  const subjectList = Array.isArray(subjects) ? subjects : [];

  // Function to filter learning tracks based on search term
  const filterTrilhas = (trilhas: any[], term: string) => {
    if (!term) return trilhas;
    return trilhas.filter(
      (trilha) =>
        trilha.name.toLowerCase().includes(term.toLowerCase()) ||
        trilha.description.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Simulated data for learning tracks
  const trilhasDeAprendizagem = [
    {
      id: 1,
      name: "Aritmética e Problemas",
      subject: "Matemática",
      description: "Fundamentos de aritmética e resolução de problemas matemáticos",
      modulesCount: 10,
      totalVideos: 32,
      totalExercises: 48,
      progress: 65,
      color: "blue",
      modules: [
        {
          id: 1,
          name: "Sistemas de Numeração e Operações Fundamentais",
          aulaCount: 5,
          completed: 3,
        },
        {
          id: 2,
          name: "Números Primos e Divisibilidade",
          aulaCount: 2,
          completed: 2,
        },
        {
          id: 3,
          name: "MMC e MDC",
          aulaCount: 2,
          completed: 1,
        },
        {
          id: 4,
          name: "Frações e Números Decimais",
          aulaCount: 2,
          completed: 0,
        },
        {
          id: 5,
          name: "Razão, Proporção e Números Proporcionais",
          aulaCount: 4,
          completed: 2,
        },
      ]
    },
    {
      id: 2,
      name: "Álgebra",
      subject: "Matemática",
      description: "Conceitos e aplicações da álgebra na resolução de problemas",
      modulesCount: 8,
      totalVideos: 24,
      totalExercises: 36,
      progress: 30,
      color: "green",
      modules: [
        {
          id: 1,
          name: "Potenciação",
          aulaCount: 1,
          completed: 0,
        },
        {
          id: 2,
          name: "Radiciação",
          aulaCount: 1,
          completed: 0,
        },
        {
          id: 3,
          name: "Equações do 1º Grau",
          aulaCount: 3,
          completed: 1,
        }
      ]
    },
    {
      id: 3,
      name: "Gramática e Linguística",
      subject: "Português",
      description: "Estudo da estrutura e formação da língua portuguesa",
      modulesCount: 12,
      totalVideos: 36,
      totalExercises: 60,
      progress: 45,
      color: "purple",
      modules: [
        {
          id: 1,
          name: "Fonética e Fonologia",
          aulaCount: 3,
          completed: 2,
        },
        {
          id: 2,
          name: "Morfologia",
          aulaCount: 5,
          completed: 3,
        }
      ]
    },
    {
      id: 4,
      name: "Interpretação Textual",
      subject: "Português",
      description: "Técnicas e estratégias para interpretação de textos diversos",
      modulesCount: 8,
      totalVideos: 24,
      totalExercises: 40,
      progress: 75,
      color: "blue",
      modules: []
    },
    {
      id: 5,
      name: "Mecânica Clássica",
      subject: "Física",
      description: "Estudo do movimento dos corpos e suas causas",
      modulesCount: 10,
      totalVideos: 30,
      totalExercises: 45,
      progress: 20,
      color: "yellow",
      modules: []
    },
    {
      id: 6,
      name: "Termologia e Termodinâmica",
      subject: "Física",
      description: "Estudo do calor e suas transformações",
      modulesCount: 8,
      totalVideos: 24,
      totalExercises: 36,
      progress: 10,
      color: "orange",
      modules: []
    }
  ];

  // Get filtered list of trilhas
  const getFilteredTrilhas = () => {
    const searched = filterTrilhas(trilhasDeAprendizagem, searchTerm);
    
    if (selectedSubject) {
      return searched.filter(
        (trilha) => trilha.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }
    
    return searched;
  };

  const filteredTrilhas = getFilteredTrilhas();

  // Get color based on subject
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      "Matemática": "bg-blue-100 text-blue-800",
      "Português": "bg-purple-100 text-purple-800",
      "Física": "bg-yellow-100 text-yellow-800",
      "Química": "bg-green-100 text-green-800",
      "Biologia": "bg-emerald-100 text-emerald-800",
      "História": "bg-red-100 text-red-800",
      "Geografia": "bg-orange-100 text-orange-800",
    };
    
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Trilhas de Aprendizagem</h1>
        <p className="text-neutral-600">
          Caminhos estruturados de estudo organizados por disciplina e tópicos para uma preparação completa
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Input
                type="search"
                placeholder="Buscar trilhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="whitespace-nowrap"
                onClick={() => setSelectedSubject(null)}
              >
                Todas Disciplinas
              </Button>
            </div>
          </div>

          <Tabs
            value={selectedSubject || "todas"}
            onValueChange={(value) => setSelectedSubject(value === "todas" ? null : value)}
            className="mb-8"
          >
            <TabsList className="mb-6 flex flex-wrap h-auto justify-start">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              {subjectList.map((subject: any) => (
                <TabsTrigger key={subject.code} value={subject.name}>
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="todas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTrilhas.map((trilha) => (
                  <Card 
                    key={trilha.id} 
                    className="hover:shadow-md transition-shadow border-t-4"
                    style={{ borderTopColor: `var(--${trilha.color}-500)` }}
                  >
                    <CardHeader className="pb-2">
                      <Badge className={getSubjectColor(trilha.subject)}>
                        {trilha.subject}
                      </Badge>
                      <CardTitle className="text-xl mt-2">{trilha.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {trilha.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">Progresso</span>
                        <span className="text-sm font-medium">{trilha.progress}%</span>
                      </div>
                      
                      <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(trilha.progress)}`} 
                          style={{ width: `${trilha.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center">
                          <PlayCircle className="h-4 w-4 mr-1" />
                          <span>{trilha.totalVideos} vídeos</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{trilha.totalExercises} exercícios</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{trilha.modulesCount} módulos</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate(`/trilhas/${trilha.id}`)} 
                        className="w-full"
                      >
                        Continuar Estudando
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {subjectList.map((subject: any) => (
              <TabsContent key={subject.code} value={subject.name} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTrilhas
                    .filter((trilha) => trilha.subject === subject.name)
                    .map((trilha) => (
                      <Card 
                        key={trilha.id} 
                        className="hover:shadow-md transition-shadow border-t-4"
                        style={{ borderTopColor: `var(--${trilha.color}-500)` }}
                      >
                        <CardHeader className="pb-2">
                          <Badge className={getSubjectColor(trilha.subject)}>
                            {trilha.subject}
                          </Badge>
                          <CardTitle className="text-xl mt-2">{trilha.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {trilha.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">Progresso</span>
                            <span className="text-sm font-medium">{trilha.progress}%</span>
                          </div>
                          
                          <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(trilha.progress)}`} 
                              style={{ width: `${trilha.progress}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-500 mb-6">
                            <div className="flex items-center">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              <span>{trilha.totalVideos} vídeos</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <span>{trilha.totalExercises} exercícios</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{trilha.modulesCount} módulos</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => navigate(`/trilhas/${trilha.id}`)} 
                            className="w-full"
                          >
                            Continuar Estudando
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Meu Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Geral</span>
                    <span className="font-medium">48%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: "48%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Matemática</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: "65%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Português</span>
                    <span className="font-medium">55%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: "55%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Física</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: "20%" }}></div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={() => navigate("/desempenho")}>
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Próximas Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Sistemas de Numeração - Romano", subject: "Matemática", time: "15:25" },
                  { title: "Frações e Números Decimais", subject: "Matemática", time: "21:00" },
                  { title: "Morfologia - Substantivos", subject: "Português", time: "18:40" }
                ].map((aula, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-1">{aula.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Badge variant="outline" className="mr-2">{aula.subject}</Badge>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{aula.time}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate("/videos")}
                  >
                    Ver Todas as Aulas
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}