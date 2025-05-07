import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Download, 
  FileText, 
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRightCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function AulaDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("aula");
  const [playerProgress, setPlayerProgress] = useState(0);
  
  // Simulated data for a specific aula
  const aulaData = {
    id: id || "1",
    title: "Sistemas de Numeração - Romano",
    duration: "15:25",
    trilha: "Aritmética e Problemas",
    subject: "Matemática",
    module: "Sistemas de Numeração e Operações Fundamentais",
    professor: {
      name: "Domingos Cereja",
      avatar: "/professor-avatar.png",
      bio: "Olá, pessoal! Sou o professor Domingos Cereja. Cursei a Escola Preparatória de Cadetes do Ar e a Academia da Força Aérea. Sou formado em Engenharia Elétrica e em Direito. Leciono Matemática há 16 anos para o ensino médio, pré-vestibulares e concursos públicos. Sou vascaíno fanático e pratico rapel. Instagram: @professor_domingos_cereja"
    },
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video URL for demo purposes
    resumo: `
      <h2>Sistemas de Numeração - Romano</h2>
      
      <p>Os números são representados por símbolos.</p>
      
      <p>Existem várias formas de representações numéricas, dependendo, inclusive, de regiões ou épocas.</p>
      
      <h3>Algarismos Romanos</h3>
      
      <p>I = 1<br>
      V = 5<br>
      X = 10<br>
      L = 50<br>
      C = 100<br>
      D = 500<br>
      M = 1000</p>
      
      <h3>Regras</h3>
      
      <p>1. Algarismos de maior ou igual valor à direita são somados<br>
      Exemplo: VI = 5 + 1 = 6</p>
      
      <p>2. Algarismos de menor valor à direita são somados<br>
      Exemplo: XV = 10 + 5 = 15</p>
      
      <p>3. Algarismos de menor valor à esquerda são subtraídos<br>
      Exemplo: IV = 5 - 1 = 4</p>
      
      <p>4. Um símbolo não pode ser repetido mais de três vezes consecutivas<br>
      Exemplo: III é permitido, mas IIII não é</p>
    `,
    materiais: [
      { 
        id: 1, 
        title: "Apostila - Sistemas de Numeração", 
        type: "PDF", 
        size: "2.4 MB" 
      },
      { 
        id: 2, 
        title: "Lista de Exercícios - Numeração Romana", 
        type: "PDF", 
        size: "1.8 MB" 
      },
      { 
        id: 3, 
        title: "Resumo Esquematizado", 
        type: "PDF", 
        size: "950 KB" 
      }
    ],
    exercicios: [
      {
        id: 1,
        question: "Qual é a representação correta do número 49 em algarismos romanos?",
        options: [
          { id: "a", text: "IL" },
          { id: "b", text: "XLVIV" },
          { id: "c", text: "XLIX" },
          { id: "d", text: "XXXXIX" },
          { id: "e", text: "IXL" }
        ],
        answer: "c",
        explanation: "O número 49 é representado como XLIX, que significa 50 - 10 + 9, ou seja, 40 + 9 = 49. Esta é a forma correta seguindo as regras da numeração romana."
      },
      {
        id: 2,
        question: "De acordo com as regras de algarismos romanos, qual das alternativas abaixo está INCORRETA?",
        options: [
          { id: "a", text: "XX = 20" },
          { id: "b", text: "XXXX = 40" },
          { id: "c", text: "XL = 40" },
          { id: "d", text: "XXX = 30" },
          { id: "e", text: "IX = 9" }
        ],
        answer: "b",
        explanation: "A alternativa incorreta é XXXX = 40, pois pela regra 4, um símbolo não pode ser repetido mais de três vezes consecutivas. A forma correta de representar 40 em algarismos romanos é XL."
      }
    ],
    comments: [
      {
        id: 1,
        user: {
          name: "Maria Silva",
          avatar: null
        },
        content: "Finalmente entendi a diferença entre os sistemas de numeração! O professor explica de um jeito muito claro.",
        time: "2 dias atrás",
        replies: []
      },
      {
        id: 2,
        user: {
          name: "João Pereira",
          avatar: null
        },
        content: "Professor, fiquei com uma dúvida: quando escrevemos o ano em algarismos romanos, como em MMXXIII para 2023, estamos seguindo todas as regras?",
        time: "1 semana atrás",
        replies: [
          {
            id: 3,
            user: {
              name: "Domingos Cereja",
              avatar: "/professor-avatar.png",
              isProfessor: true
            },
            content: "Olá João! Sim, na escrita dos anos em algarismos romanos seguimos todas as regras que apresentei na aula. No caso de MMXXIII (2023), temos 2000 + 20 + 3, onde não há nenhuma violação das regras que estudamos. Obrigado pela pergunta!",
            time: "6 dias atrás"
          }
        ]
      }
    ],
    nextAula: {
      id: 2,
      title: "Sistemas de Numeração - Decimal e Binário",
      module: "Sistemas de Numeração e Operações Fundamentais"
    }
  };

  // Handle completing the aula
  const handleComplete = () => {
    // In a real app, make an API call to mark as complete
    setPlayerProgress(100);
    alert("Aula marcada como concluída!");
  };

  // Handle continuing to next aula
  const handleContinue = () => {
    navigate(`/aula/${aulaData.nextAula.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/trilhas/${1}`)}
            className="flex items-center mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para Trilha
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">{aulaData.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-neutral-600">
            <Badge variant="secondary">{aulaData.subject}</Badge>
            <span className="text-sm">•</span>
            <span className="text-sm">{aulaData.module}</span>
            <span className="text-sm">•</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{aulaData.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleComplete}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Marcar como concluída
          </Button>
          <Button
            className="flex items-center"
            onClick={handleContinue}
          >
            Próxima aula
            <ArrowRightCircle className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-video w-full bg-black relative">
              <iframe 
                src={aulaData.videoUrl} 
                className="w-full h-full" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-neutral-500">Seu progresso</span>
                <span className="text-sm font-medium">{playerProgress}%</span>
              </div>
              <Progress value={playerProgress} className="h-2" />
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Professor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={aulaData.professor.avatar} />
                  <AvatarFallback>{aulaData.professor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{aulaData.professor.name}</h3>
                  <p className="text-sm text-neutral-500">Professor de {aulaData.subject}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600">
                {aulaData.professor.bio}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Próxima Aula</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{aulaData.nextAula.title}</h3>
                  <p className="text-sm text-neutral-500">{aulaData.nextAula.module}</p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                  onClick={handleContinue}
                >
                  Continuar
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="aula" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Resumo da Aula
          </TabsTrigger>
          <TabsTrigger value="materiais" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Materiais
          </TabsTrigger>
          <TabsTrigger value="exercicios" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Exercícios
          </TabsTrigger>
          <TabsTrigger value="comentarios" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Comentários
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="aula">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: aulaData.resumo }}></div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle>Materiais Complementares</CardTitle>
              <CardDescription>
                Materiais de apoio para esta aula. Baixe e estude offline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aulaData.materiais.map((material) => (
                  <div 
                    key={material.id} 
                    className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{material.title}</h4>
                        <p className="text-sm text-gray-500">
                          {material.type} • {material.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exercicios">
          <div className="space-y-6">
            {aulaData.exercicios.map((exercicio) => (
              <Card key={exercicio.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Questão {exercicio.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-neutral-800 font-medium mb-4">{exercicio.question}</p>
                    <div className="space-y-2 ml-1">
                      {exercicio.options.map((option) => (
                        <div key={option.id} className="flex items-start gap-2 p-2 rounded hover:bg-gray-50">
                          <div className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center ${
                            exercicio.answer === option.id ? "bg-green-100 border-green-500 text-green-500" : ""
                          }`}>
                            {option.id}
                          </div>
                          <p>{option.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-green-800">Resposta: Alternativa {exercicio.answer.toUpperCase()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-700">{exercicio.explanation}</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="comentarios">
          <Card>
            <CardHeader>
              <CardTitle>Comentários e Dúvidas</CardTitle>
              <CardDescription>
                Compartilhe suas impressões ou tire dúvidas sobre esta aula
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Textarea placeholder="Escreva seu comentário ou dúvida..." className="mb-2" />
                <Button>Enviar Comentário</Button>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                {aulaData.comments.map((comment) => (
                  <div key={comment.id} className="group">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user.avatar || undefined} />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{comment.user.name}</h4>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-neutral-800">{comment.content}</p>
                        <Button variant="ghost" size="sm" className="mt-1 text-xs">
                          Responder
                        </Button>
                      </div>
                    </div>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-14 mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={reply.user.avatar || undefined} />
                              <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium flex items-center">
                                  {reply.user.name}
                                  {reply.user.isProfessor && (
                                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      Professor
                                    </Badge>
                                  )}
                                </h4>
                                <span className="text-xs text-gray-500">{reply.time}</span>
                              </div>
                              <p className="text-neutral-800">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}