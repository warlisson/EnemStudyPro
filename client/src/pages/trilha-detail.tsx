import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  BookOpen, 
  Clock, 
  CheckCircle2,
  File,
  BarChart4,
  Star,
  CheckSquare
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TrilhaDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("modulos");
  
  // Trilhas data from previous page - in a real app, would be fetched based on ID
  const trilhasDeAprendizagem = [
    {
      id: "1",
      name: "Aritmética e Problemas",
      subject: "Matemática",
      description: "Fundamentos de aritmética e resolução de problemas matemáticos",
      longDescription: "Esta trilha aborda os conceitos fundamentais da aritmética, desde sistemas de numeração até razão e proporção, com foco na resolução de problemas matemáticos aplicados ao ENEM e vestibulares. São apresentadas técnicas de resolução eficientes e exercícios práticos.",
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
          description: "Estudo dos diferentes sistemas de numeração e operações básicas da matemática",
          aulas: [
            {
              id: 1,
              title: "Sistemas de Numeração - Romano",
              duration: "15:25",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 2,
              title: "Sistemas de Numeração - Decimal e Binário",
              duration: "21:00",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 3,
              title: "Sistemas de Numeração - Hexadecimal",
              duration: "19:19",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 4,
              title: "Sistemas de Numeração - Exercícios",
              duration: "21:13",
              watched: false,
              professor: "Domingos Cereja"
            },
            {
              id: 5,
              title: "Operações Fundamentais - Adição, Subtração, Multiplicação e Divisão",
              duration: "21:40",
              watched: false,
              professor: "Domingos Cereja"
            }
          ]
        },
        {
          id: 2,
          name: "Números Primos e Divisibilidade",
          aulaCount: 2,
          completed: 2,
          description: "Propriedades dos números primos e regras de divisibilidade",
          aulas: [
            {
              id: 6,
              title: "Definição e Importância dos Números Primos",
              duration: "18:33",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 7,
              title: "Critérios de Divisibilidade",
              duration: "22:45",
              watched: true,
              professor: "Domingos Cereja"
            }
          ]
        },
        {
          id: 3,
          name: "MMC e MDC",
          aulaCount: 2,
          completed: 1,
          description: "Mínimo Múltiplo Comum e Máximo Divisor Comum",
          aulas: [
            {
              id: 8,
              title: "Mínimo Múltiplo Comum (MMC)",
              duration: "17:10",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 9,
              title: "Máximo Divisor Comum (MDC)",
              duration: "16:55",
              watched: false,
              professor: "Domingos Cereja"
            }
          ]
        },
        {
          id: 4,
          name: "Frações e Números Decimais",
          aulaCount: 2,
          completed: 0,
          description: "Operações com frações e conversão para números decimais",
          aulas: [
            {
              id: 10,
              title: "Frações: Definição e Operações",
              duration: "23:15",
              watched: false,
              professor: "Domingos Cereja"
            },
            {
              id: 11,
              title: "Números Decimais e Conversões",
              duration: "19:48",
              watched: false,
              professor: "Domingos Cereja"
            }
          ]
        },
        {
          id: 5,
          name: "Razão, Proporção e Números Proporcionais",
          aulaCount: 4,
          completed: 2,
          description: "Conceitos de razão e proporção e suas aplicações",
          aulas: [
            {
              id: 12,
              title: "Razão e Proporção: Conceitos Básicos",
              duration: "14:32",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 13,
              title: "Grandezas Diretamente Proporcionais",
              duration: "18:05",
              watched: true,
              professor: "Domingos Cereja"
            },
            {
              id: 14,
              title: "Grandezas Inversamente Proporcionais",
              duration: "17:40",
              watched: false,
              professor: "Domingos Cereja"
            },
            {
              id: 15,
              title: "Regra de Três Simples e Composta",
              duration: "23:50",
              watched: false,
              professor: "Domingos Cereja"
            }
          ]
        }
      ]
    }
  ];

  const trilha = trilhasDeAprendizagem.find((t) => t.id === id);
  
  if (!trilha) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-3xl font-bold mb-4">Trilha não encontrada</h1>
        <Button onClick={() => navigate("/trilhas")}>Voltar para Trilhas</Button>
      </div>
    );
  }

  // Calculate total modules and completed modules
  const totalAulas = trilha.modules.reduce((acc, module) => acc + module.aulaCount, 0);
  const completedAulas = trilha.modules.reduce((acc, module) => acc + module.completed, 0);

  // Get color for progress bar
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  // Get subject color
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/trilhas")}
          className="flex items-center mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para Trilhas
        </Button>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge className={getSubjectColor(trilha.subject)}>
            {trilha.subject}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-neutral-800 mb-3">{trilha.name}</h1>
        <p className="text-lg text-neutral-600 mb-6">
          {trilha.longDescription}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Módulos</p>
                    <p className="font-semibold">{trilha.modulesCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlayCircle className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Vídeo Aulas</p>
                    <p className="font-semibold">{trilha.totalVideos}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Exercícios</p>
                    <p className="font-semibold">{trilha.totalExercises}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Progresso</p>
                    <p className="font-semibold">{completedAulas}/{totalAulas} aulas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Seu progresso na trilha</span>
          <span className="text-sm font-medium">{trilha.progress}%</span>
        </div>
        
        <div className="w-full h-2.5 bg-gray-200 rounded-full mb-8">
          <div 
            className={`h-2.5 rounded-full ${getProgressColor(trilha.progress)}`} 
            style={{ width: `${trilha.progress}%` }}
          ></div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="modulos" className="flex items-center gap-1">
            <File className="h-4 w-4" />
            Módulos
          </TabsTrigger>
          <TabsTrigger value="desempenho" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            Desempenho
          </TabsTrigger>
          <TabsTrigger value="concluidos" className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            Concluídos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="modulos">
          <div className="space-y-6">
            {trilha.modules.map((module) => (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="pb-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <span>{module.name}</span>
                      <Badge variant="outline" className="ml-3">
                        {module.completed}/{module.aulaCount} aulas
                      </Badge>
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // In a real app, expand/collapse the module
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {module.aulas.map((aula) => (
                      <div 
                        key={aula.id} 
                        className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="mr-4">
                            {aula.watched ? (
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <PlayCircle className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{aula.title}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{aula.duration}</span>
                              <span className="mx-2">•</span>
                              <span>Prof. {aula.professor}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant={aula.watched ? "outline" : "default"}
                          size="sm"
                          onClick={() => navigate(`/aula/${aula.id}`)}
                        >
                          {aula.watched ? "Rever" : "Assistir"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="desempenho">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Progresso por Módulo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trilha.modules.map((module) => (
                    <div key={module.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{module.name}</span>
                        <span className="text-sm font-medium">
                          {Math.round((module.completed / module.aulaCount) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(module.completed / module.aulaCount) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-gray-600">Aulas assistidas</span>
                    <span className="font-semibold">{completedAulas}/{totalAulas}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-gray-600">Tempo total</span>
                    <span className="font-semibold">5h 42min</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-gray-600">Exercícios concluídos</span>
                    <span className="font-semibold">32/48</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-gray-600">Taxa de acertos</span>
                    <span className="font-semibold text-green-600">78%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Dias de estudo</span>
                    <span className="font-semibold">14 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="concluidos">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aulas Concluídas</CardTitle>
                <CardDescription>
                  Lista de todas as aulas que você já assistiu nesta trilha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trilha.modules
                    .flatMap(module => module.aulas.filter(aula => aula.watched))
                    .map(aula => (
                      <div key={aula.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                        <div>
                          <h4 className="font-medium">{aula.title}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">{trilha.subject}</Badge>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{aula.duration}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/aula/${aula.id}`)}>
                          Rever
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximas Aulas Recomendadas</CardTitle>
                <CardDescription>
                  Sugestões baseadas no seu progresso atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trilha.modules
                    .flatMap(module => module.aulas.filter(aula => !aula.watched))
                    .slice(0, 3)
                    .map(aula => (
                      <div key={aula.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                        <div>
                          <h4 className="font-medium">{aula.title}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Badge variant="outline" className="mr-2">{trilha.subject}</Badge>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{aula.duration}</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => navigate(`/aula/${aula.id}`)}>
                          Assistir
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}