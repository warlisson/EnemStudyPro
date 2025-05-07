import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyMaterialCard } from "@/components/ui/study-material-card";
import { SubjectCard } from "@/components/ui/subject-card";
import { QuestionCard } from "@/components/ui/question-card";
import { Link, useParams, useLocation } from "wouter";
import { 
  Book, 
  Calculator, 
  Atom, 
  FlaskRound, 
  Globe, 
  BookOpen, 
  Compass,
  Languages,
  FileText,
  Clock,
  Activity,
  ChevronRight,
  ScrollText
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

export default function Disciplinas() {
  const { subject } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch subjects
  const { data: subjectsData, isLoading: loadingSubjects } = useQuery({
    queryKey: ['/api/subjects'],
  });

  // Fetch subject details if a subject is selected
  const { data: subjectDetails, isLoading: loadingSubjectDetails } = useQuery({
    queryKey: ['/api/subjects', subject],
    enabled: !!subject,
  });

  // Fetch related study materials
  const { data: studyMaterials, isLoading: loadingMaterials } = useQuery({
    queryKey: ['/api/materials', subject],
    enabled: !!subject,
  });

  // Fetch sample questions
  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ['/api/questions', subject],
    enabled: !!subject,
  });

  // Subject configuration
  const subjects = [
    {
      id: "portugues",
      name: "Português",
      questionCount: 1127,
      icon: <Book className="h-8 w-8" />,
      color: "blue",
      description: "Gramática, interpretação textual e linguística",
      progress: 72
    },
    {
      id: "matematica",
      name: "Matemática",
      questionCount: 1328,
      icon: <Calculator className="h-8 w-8" />,
      color: "green",
      description: "Álgebra, geometria, estatística e funções",
      progress: 65
    },
    {
      id: "fisica",
      name: "Física",
      questionCount: 832,
      icon: <Atom className="h-8 w-8" />,
      color: "yellow",
      description: "Mecânica, termodinâmica, óptica e eletromagnetismo",
      progress: 58
    },
    {
      id: "quimica",
      name: "Química",
      questionCount: 764,
      icon: <FlaskRound className="h-8 w-8" />,
      color: "green",
      description: "Química orgânica, inorgânica e físico-química",
      progress: 61
    },
    {
      id: "biologia",
      name: "Biologia",
      questionCount: 892,
      icon: <Activity className="h-8 w-8" />,
      color: "green",
      description: "Genética, ecologia, fisiologia e evolução",
      progress: 79
    },
    {
      id: "historia",
      name: "História",
      questionCount: 743,
      icon: <Clock className="h-8 w-8" />,
      color: "red",
      description: "História do Brasil e História Geral",
      progress: 68
    },
    {
      id: "geografia",
      name: "Geografia",
      questionCount: 678,
      icon: <Globe className="h-8 w-8" />,
      color: "orange",
      description: "Geografia física, humana e geopolítica",
      progress: 70
    },
    {
      id: "literatura",
      name: "Literatura",
      questionCount: 512,
      icon: <BookOpen className="h-8 w-8" />,
      color: "purple",
      description: "Estilos literários, obras e autores",
      progress: 73
    },
    {
      id: "ingles",
      name: "Inglês",
      questionCount: 356,
      icon: <Languages className="h-8 w-8" />,
      color: "blue",
      description: "Interpretação textual e vocabulário",
      progress: 82
    },
    {
      id: "redacao",
      name: "Redação",
      questionCount: 124,
      icon: <FileText className="h-8 w-8" />,
      color: "purple",
      description: "Técnicas de argumentação e estruturação textual",
      progress: 75
    },
    {
      id: "filosofia",
      name: "Filosofia",
      questionCount: 245,
      icon: <Compass className="h-8 w-8" />,
      color: "indigo",
      description: "Correntes filosóficas e história da filosofia",
      progress: 65
    },
    {
      id: "sociologia",
      name: "Sociologia",
      questionCount: 218,
      icon: <ScrollText className="h-8 w-8" />,
      color: "pink",
      description: "Teorias sociológicas e temas contemporâneos",
      progress: 60
    }
  ];

  // Study materials data
  const studyMaterialsData = [
    {
      id: 1,
      title: "Interpretação de textos em exames: técnicas essenciais",
      description: "Aprenda técnicas para compreender e analisar textos de diferentes gêneros frequentes no ENEM e vestibulares.",
      image: "https://images.unsplash.com/photo-1455894127589-22f75500213a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      category: "Português",
      time: "15 minutos de leitura"
    },
    {
      id: 2,
      title: "Principais fórmulas matemáticas para o ENEM",
      description: "Um guia completo com todas as fórmulas matemáticas essenciais que você precisa memorizar para o ENEM.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      category: "Matemática",
      time: "20 minutos de leitura"
    },
    {
      id: 3,
      title: "Leis de Newton e suas aplicações no cotidiano",
      description: "Entenda como as leis fundamentais da física clássica se aplicam a situações do dia a dia e como isso é cobrado no ENEM.",
      image: "https://images.unsplash.com/photo-1510925758641-869d353cecc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      category: "Física",
      time: "18 minutos de leitura"
    }
  ];

  // Sample questions
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
    }
  ];

  // Helper function to get color styles
  const getSubjectIconStyle = (color: string) => {
    const styles: Record<string, { bg: string, text: string }> = {
      "blue": { bg: "bg-blue-100", text: "text-blue-600" },
      "green": { bg: "bg-green-100", text: "text-green-600" },
      "yellow": { bg: "bg-yellow-100", text: "text-yellow-600" },
      "red": { bg: "bg-red-100", text: "text-red-600" },
      "orange": { bg: "bg-orange-100", text: "text-orange-600" },
      "purple": { bg: "bg-purple-100", text: "text-purple-600" },
      "indigo": { bg: "bg-indigo-100", text: "text-indigo-600" },
      "pink": { bg: "bg-pink-100", text: "text-pink-600" },
    };
    
    return styles[color] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { bg: string, text: string }> = {
      "Biologia": { bg: "bg-green-100", text: "text-green-600" },
      "Português": { bg: "bg-blue-100", text: "text-blue-600" },
      "Matemática": { bg: "bg-green-100", text: "text-green-600" },
      "Física": { bg: "bg-yellow-100", text: "text-yellow-600" },
      "Química": { bg: "bg-green-100", text: "text-green-600" },
      "História": { bg: "bg-red-100", text: "text-red-600" },
      "Geografia": { bg: "bg-orange-100", text: "text-orange-600" },
      "Literatura": { bg: "bg-purple-100", text: "text-purple-600" },
      "Inglês": { bg: "bg-blue-100", text: "text-blue-600" },
      "Filosofia": { bg: "bg-indigo-100", text: "text-indigo-600" },
      "Sociologia": { bg: "bg-pink-100", text: "text-pink-600" },
      "Redação": { bg: "bg-purple-100", text: "text-purple-600" },
    };
    
    return styles[category] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  // Find current subject if one is selected
  const currentSubject = subjects.find(s => s.id === subject);

  // If a specific subject is selected, show its details
  if (subject && currentSubject) {
    const subjectStyle = getSubjectIconStyle(currentSubject.color);

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/disciplinas">
              <a className="text-neutral-500 hover:text-neutral-800">Disciplinas</a>
            </Link>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            <span className="font-medium">{currentSubject.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">{currentSubject.name}</h1>
          <p className="text-neutral-600">{currentSubject.description}</p>
        </header>

        {/* Subject Overview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/4 flex flex-col items-center justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${subjectStyle.bg}`}>
                <div className={subjectStyle.text}>{currentSubject.icon}</div>
              </div>
              <p className="text-xl font-semibold text-center">{currentSubject.name}</p>
              <p className="text-neutral-500 text-center">{currentSubject.questionCount} questões</p>
            </div>
            
            <div className="md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-medium">Seu progresso</p>
                      <span className="text-xl font-bold text-primary">{currentSubject.progress}%</span>
                    </div>
                    <Progress value={currentSubject.progress} className="h-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="font-medium mb-1">Questões realizadas</p>
                      <span className="text-2xl font-bold text-neutral-800">
                        {Math.floor(currentSubject.questionCount * (currentSubject.progress / 100))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="font-medium mb-1">Taxa de acertos</p>
                      <span className="text-2xl font-bold text-green-600">
                        {Math.floor(Math.random() * 20) + 70}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Video Lessons */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Últimas Aulas Adicionadas</h2>
            <Link href={`/videos?subject=${currentSubject.id}`}>
              <Button variant="outline" className="flex items-center gap-1">
                Ver todas as aulas
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video lesson cards would load from the API, using placeholders for now */}
            {[1, 2, 3].map((id) => (
              <Card key={id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400">Thumbnail da aula</div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{`Aula sobre ${currentSubject.name} - Parte ${id}`}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    20 minutos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                    {`Conteúdo fundamental sobre ${currentSubject.name} para o ENEM, abordando os principais conceitos e técnicas aplicadas.`}
                  </p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button onClick={() => navigate(`/videos/${id}?subject=${currentSubject.id}`)} className="w-full">
                    Assistir Aula
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories/Modules */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Categorias e Módulos</h2>
            <Button variant="outline" className="flex items-center gap-1">
              Ver todas as categorias
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Fundamentos", "Exercícios Práticos", "Conteúdo Avançado", "Resolução de Problemas", "Testes Simulados", "Tópicos Especiais"].map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <CardDescription>
                    {`${Math.floor(Math.random() * 10) + 5} aulas disponíveis`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/categorias/${index}?subject=${currentSubject.id}`)}>
                    Explorar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subject Tabs */}
        <Tabs defaultValue="materiais" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="materiais">Materiais de Estudo</TabsTrigger>
            <TabsTrigger value="questoes">Questões</TabsTrigger>
            <TabsTrigger value="desempenho">Meu Desempenho</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materiais">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyMaterialsData.map((material) => {
                const style = getCategoryStyle(material.category);
                return (
                  <StudyMaterialCard
                    key={material.id}
                    title={material.title}
                    description={material.description}
                    image={material.image}
                    category={material.category}
                    categoryBg={style.bg}
                    categoryColor={style.text}
                    href={`/materiais/${material.id}`}
                  />
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">Ver mais materiais</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="questoes">
            <div className="space-y-8">
              {sampleQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  id={question.id}
                  examYear={question.examYear}
                  subject={question.subject}
                  content={question.content}
                  options={question.options}
                  answer={question.answer}
                  onAnswerSubmit={() => {}}
                />
              ))}
              
              <div className="mt-6 text-center">
                <Link href={`/questoes/${currentSubject.id}`}>
                  <Button>Ver mais questões</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="desempenho">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolução de Acertos</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-neutral-300 mb-2 mx-auto">
                        <line x1="12" y1="20" x2="12" y2="10"></line>
                        <line x1="18" y1="20" x2="18" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="16"></line>
                      </svg>
                      <p className="text-sm text-neutral-500">Gráfico de evolução de acertos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tópicos com Melhor Desempenho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { topic: "Gramática", percentage: 92 },
                      { topic: "Sintaxe", percentage: 85 },
                      { topic: "Interpretação Textual", percentage: 78 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.topic}</span>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Questões Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full ${Math.random() > 0.3 ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                            {Math.random() > 0.3 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-600">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{`Questão ${item} - ENEM ${2021 + item}`}</h3>
                            <p className="text-sm text-neutral-500">{Math.random() > 0.5 ? "Interpretação Textual" : "Análise Sintática"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${Math.random() > 0.3 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.random() > 0.3 ? "Correto" : "Incorreto"}
                          </p>
                          <p className="text-sm text-neutral-500">{Math.floor(Math.random() * 3) + 1}m {Math.floor(Math.random() * 60)}s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Recomendado para você</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyMaterialsData.slice(0, 3).map((material) => {
              const style = getCategoryStyle(material.category);
              return (
                <StudyMaterialCard
                  key={material.id}
                  title={material.title}
                  description={material.description}
                  image={material.image}
                  category={material.category}
                  categoryBg={style.bg}
                  categoryColor={style.text}
                  href={`/materiais/${material.id}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Show all subjects
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Disciplinas</h1>
        <p className="text-neutral-600">Explore os conteúdos por disciplina e aprenda de forma organizada.</p>
      </header>

      {/* Subjects Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {subjects.map((subject) => {
          const style = getSubjectIconStyle(subject.color);
          return (
            <SubjectCard
              key={subject.id}
              title={subject.name}
              questionCount={subject.questionCount}
              icon={subject.icon}
              iconBgColor={style.bg}
              iconColor={style.text}
              href={`/disciplinas/${subject.id}`}
            />
          );
        })}
      </div>

      {/* Most Popular Topics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Tópicos Mais Populares</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Book className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Português</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/disciplinas/portugues?topic=interpretacao">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Interpretação Textual</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/disciplinas/portugues?topic=gramatica">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Gramática Normativa</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/disciplinas/portugues?topic=semantica">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Semântica e Morfologia</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-green-600" />
                </div>
                <CardTitle className="text-lg">Matemática</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/disciplinas/matematica?topic=geometria">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Geometria Plana e Espacial</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/disciplinas/matematica?topic=funcoes">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Funções</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/disciplinas/matematica?topic=estatistica">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Estatística e Probabilidade</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Atom className="h-4 w-4 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Física</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/disciplinas/fisica?topic=mecanica">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Mecânica</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/disciplinas/fisica?topic=termologia">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Termologia</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/disciplinas/fisica?topic=eletricidade">
                    <a className="flex justify-between items-center hover:text-primary">
                      <span>Eletricidade</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Study Materials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Materiais Recentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyMaterialsData.map((material) => {
            const style = getCategoryStyle(material.category);
            return (
              <StudyMaterialCard
                key={material.id}
                title={material.title}
                description={material.description}
                image={material.image}
                category={material.category}
                categoryBg={style.bg}
                categoryColor={style.text}
                href={`/materiais/${material.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
