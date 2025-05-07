import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionCard } from "@/components/ui/question-card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Book, Calculator, Atom } from "lucide-react";
import { useState } from "react";

export default function Questoes() {
  // For filter state
  const [keyword, setKeyword] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [withComment, setWithComment] = useState(false);
  const [withStepByStep, setWithStepByStep] = useState(false);
  const [withVideo, setWithVideo] = useState(false);

  // Fetch questions data
  const { data: questionsData, isLoading: loadingQuestions } = useQuery({
    queryKey: ['/api/questions'],
  });

  // Sample data for questions showcase
  const enem_subjects = [
    {
      id: "portuguese",
      title: "Português para o ENEM",
      questionCount: "1.127 questões",
      color: "blue",
      icon: <Book className="h-5 w-5" />
    },
    {
      id: "math",
      title: "Matemática para o ENEM",
      questionCount: "1.328 questões",
      color: "green",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      id: "physics",
      title: "Física para o ENEM",
      questionCount: "832 questões",
      color: "yellow",
      icon: <Atom className="h-5 w-5" />
    }
  ];

  const practice_subjects = [
    {
      id: "portuguese",
      title: "Português",
      questionCount: "732 questões",
      color: "blue",
      icon: "Abc"
    },
    {
      id: "chemistry",
      title: "Química",
      questionCount: "548 questões",
      color: "green",
      icon: "🧪"
    },
    {
      id: "literature",
      title: "Literatura",
      questionCount: "412 questões",
      color: "purple",
      icon: "📚"
    },
    {
      id: "english",
      title: "Inglês",
      questionCount: "356 questões",
      color: "blue",
      icon: "YES!"
    }
  ];

  const sampleQuestion = {
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
  };

  const handleQuestionSubmit = (questionId: string, selectedOptionId: string) => {
    console.log(`Question ${questionId} answered with option ${selectedOptionId}`);
    // Here you would typically send this to the backend via a mutation
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Questões</h1>
        <p className="text-neutral-600">Pratique com questões organizadas por disciplina e assunto.</p>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="inicio" className="mb-8">
        <TabsList>
          <TabsTrigger value="inicio">Início</TabsTrigger>
          <TabsTrigger value="todas">Todas as questões</TabsTrigger>
          <TabsTrigger value="favoritas">Favoritas</TabsTrigger>
          <TabsTrigger value="erradas">Erradas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ENEM Focus */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Foco no ENEM</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enem_subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
              <div className={`relative h-32 bg-${subject.color}-600`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`bg-${subject.color}-500 px-3 py-1 rounded-md inline-block mb-2`}>
                      <span className="text-white text-xs font-medium">Questões</span>
                    </div>
                    <h3 className="text-white text-xl font-bold">{subject.id.toUpperCase()}</h3>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 p-4">
                  {subject.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">{subject.title}</h3>
                <p className="text-neutral-600 text-sm mb-4">{subject.questionCount}</p>
                <Button 
                  className={`w-full bg-${subject.color}-50 hover:bg-${subject.color}-100 text-${subject.color}-600`}
                  variant="outline"
                >
                  Praticar agora
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice by Subject */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Pratique por disciplina</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {practice_subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200 relative">
              <div className="absolute top-0 right-0">
                <div className={`w-16 h-16 bg-${subject.color}-600 transform rotate-45 translate-x-8 -translate-y-8`}></div>
              </div>
              <div className="p-6 relative">
                <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className={`text-${subject.color}-600 font-semibold`}>{subject.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">{subject.title}</h3>
                <p className="text-neutral-500 text-sm mb-4">{subject.questionCount}</p>
                <Button 
                  className={`w-full border border-${subject.color}-600 text-${subject.color}-600 hover:bg-${subject.color}-50`}
                  variant="outline"
                >
                  Praticar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Filter */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Buscar questões específicas</h2>
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
              <Label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                Disciplina
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecione as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portugues">Português</SelectItem>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                  <SelectItem value="quimica">Química</SelectItem>
                  <SelectItem value="biologia">Biologia</SelectItem>
                  <SelectItem value="historia">História</SelectItem>
                  <SelectItem value="geografia">Geografia</SelectItem>
                  <SelectItem value="literatura">Literatura</SelectItem>
                  <SelectItem value="ingles">Inglês</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="gramatica">Gramática</SelectItem>
                  <SelectItem value="literatura">Literatura</SelectItem>
                  <SelectItem value="interpretacao">Interpretação de Texto</SelectItem>
                  <SelectItem value="algebra">Álgebra</SelectItem>
                  <SelectItem value="geometria">Geometria</SelectItem>
                  <SelectItem value="mecanica">Mecânica</SelectItem>
                  <SelectItem value="termologia">Termologia</SelectItem>
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

      {/* Question Example */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Questão da semana</h2>
        </div>
        
        <QuestionCard
          id={sampleQuestion.id}
          examYear={sampleQuestion.examYear}
          subject={sampleQuestion.subject}
          content={sampleQuestion.content}
          options={sampleQuestion.options}
          answer={sampleQuestion.answer}
          onAnswerSubmit={handleQuestionSubmit}
        />
      </div>
    </div>
  );
}
