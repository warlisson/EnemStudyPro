import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionCard } from "@/components/ui/question-card";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState } from "react";

export default function QuestoesDetail() {
  const { subject } = useParams();
  
  // For filter state
  const [keyword, setKeyword] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [withComment, setWithComment] = useState(false);
  const [withStepByStep, setWithStepByStep] = useState(false);
  const [withVideo, setWithVideo] = useState(false);

  // Fetch questions for the specific subject
  const { data: questions, isLoading } = useQuery({
    queryKey: ['/api/questions', subject],
  });

  // Get subject display name
  const getSubjectDisplayName = (subjectSlug: string): string => {
    const subjectNames: Record<string, string> = {
      "matematica": "Matemática",
      "portugues": "Português",
      "fisica": "Física",
      "quimica": "Química",
      "biologia": "Biologia",
      "historia": "História",
      "geografia": "Geografia",
      "literatura": "Literatura",
      "ingles": "Inglês"
    };
    
    return subjectNames[subjectSlug] || subjectSlug;
  };

  // Sample data for questions
  const sampleQuestions = [
    {
      id: "q1",
      examYear: "ENEM 2023",
      subject: "Matemática",
      content: "Um pintor pretende fazer uma reprodução do quadro Guernica em uma tela de dimensões 20 cm por 30 cm. A obra, de autoria do espanhol Pablo Picasso, é uma pintura com 3,5 m de altura e 7,8 m de comprimento. A reprodução a ser feita deverá preencher a maior área possível da tela, mantendo a proporção entre as dimensões da obra original.\n\nA escala que deve ser empregada para essa reprodução é:",
      options: [
        { id: "a", text: "1 : 12" },
        { id: "b", text: "1 : 16" },
        { id: "c", text: "1 : 21" },
        { id: "d", text: "1 : 26" },
        { id: "e", text: "1 : 35" }
      ],
      answer: "c"
    },
    {
      id: "q2",
      examYear: "ENEM 2022",
      subject: "Matemática",
      content: "João deseja comprar um terreno retangular e, para isso, contratou um agrimensor (topógrafo) para fazer a medição do terreno. O agrimensor constatou que os ângulos internos do terreno não eram exatamente 90°. Na figura, estão registradas algumas medidas do terreno.\n\nQual é a área desse terreno, em metro quadrado?",
      options: [
        { id: "a", text: "450" },
        { id: "b", text: "400" },
        { id: "c", text: "360" },
        { id: "d", text: "300" },
        { id: "e", text: "240" }
      ],
      answer: "b"
    }
  ];

  const handleQuestionSubmit = (questionId: string, selectedOptionId: string) => {
    console.log(`Question ${questionId} answered with option ${selectedOptionId}`);
    // Here you would typically send this to the backend via a mutation
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Questões de {subject ? getSubjectDisplayName(subject) : "ENEM"}
        </h1>
        <p className="text-neutral-600">
          Encontre e pratique questões específicas de {subject ? getSubjectDisplayName(subject) : "ENEM"}.
        </p>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="inicio" className="mb-8">
        <TabsList>
          <TabsTrigger value="inicio">Início</TabsTrigger>
          <TabsTrigger value="todas">Todas as questões</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Question Filter */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Filtrar questões</h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="keyword" className="block text-sm font-medium text-neutral-700 mb-1">
                Palavra-chave
              </Label>
              <Input 
                id="keyword" 
                placeholder="Busque por palavra-chave" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="topic" className="block text-sm font-medium text-neutral-700 mb-1">
                Assunto
              </Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger id="topic">
                  <SelectValue placeholder="Selecione os assuntos" />
                </SelectTrigger>
                <SelectContent>
                  {subject === "matematica" && (
                    <>
                      <SelectItem value="algebra">Álgebra</SelectItem>
                      <SelectItem value="geometria">Geometria</SelectItem>
                      <SelectItem value="aritmetica">Aritmética</SelectItem>
                      <SelectItem value="estatistica">Estatística e Probabilidade</SelectItem>
                    </>
                  )}
                  {subject === "portugues" && (
                    <>
                      <SelectItem value="gramatica">Gramática</SelectItem>
                      <SelectItem value="interpretacao">Interpretação de Texto</SelectItem>
                      <SelectItem value="sintaxe">Sintaxe</SelectItem>
                      <SelectItem value="semantica">Semântica</SelectItem>
                    </>
                  )}
                  {subject === "fisica" && (
                    <>
                      <SelectItem value="mecanica">Mecânica</SelectItem>
                      <SelectItem value="termologia">Termologia</SelectItem>
                      <SelectItem value="optica">Óptica</SelectItem>
                      <SelectItem value="eletricidade">Eletricidade</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="exam" className="block text-sm font-medium text-neutral-700 mb-1">
                Prova
              </Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger id="exam">
                  <SelectValue placeholder="Selecione as provas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enem-2023">ENEM 2023</SelectItem>
                  <SelectItem value="enem-2022">ENEM 2022</SelectItem>
                  <SelectItem value="enem-2021">ENEM 2021</SelectItem>
                  <SelectItem value="enem-2020">ENEM 2020</SelectItem>
                  <SelectItem value="enem-2019">ENEM 2019</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="year" className="block text-sm font-medium text-neutral-700 mb-1">
                Ano
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Selecione os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2017">2017</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">Buscar</Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-neutral-700 mb-2">Questões com:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="with-comment" 
                  checked={withComment}
                  onCheckedChange={(checked) => setWithComment(checked as boolean)}
                />
                <Label htmlFor="with-comment" className="text-sm text-neutral-700">Gabarito comentado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="with-step-by-step" 
                  checked={withStepByStep}
                  onCheckedChange={(checked) => setWithStepByStep(checked as boolean)}
                />
                <Label htmlFor="with-step-by-step" className="text-sm text-neutral-700">Resolução passo a passo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="with-video" 
                  checked={withVideo}
                  onCheckedChange={(checked) => setWithVideo(checked as boolean)}
                />
                <Label htmlFor="with-video" className="text-sm text-neutral-700">Vídeo explicativo</Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Questões encontradas</h2>
          <p className="text-sm text-neutral-500">{sampleQuestions.length} questões</p>
        </div>
        
        {sampleQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            id={question.id}
            examYear={question.examYear}
            subject={question.subject}
            content={question.content}
            options={question.options}
            onAnswerSubmit={handleQuestionSubmit}
          />
        ))}
      </div>
    </div>
  );
}
