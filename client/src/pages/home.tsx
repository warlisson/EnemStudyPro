import { DataCard } from "@/components/ui/data-card";
import { SubjectCard } from "@/components/ui/subject-card";
import { StudyMaterialCard } from "@/components/ui/study-material-card";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { ProgressChart } from "@/components/charts/progress-chart";
import { Link } from "wouter";
import { 
  CheckCircle, 
  Clock, 
  Flame, 
  Target, 
  ChevronRight, 
  Book, 
  Calculator, 
  Atom, 
  FlaskRound, 
  Leaf,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['/api/users/me'],
  });

  // Fetch statistics
  const { data: statistics, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/statistics'],
  });

  // Fetch recent materials
  const { data: recentMaterials, isLoading: loadingMaterials } = useQuery({
    queryKey: ['/api/materials/recent'],
  });

  // Fetch performance data
  const { data: performanceData, isLoading: loadingPerformance } = useQuery({
    queryKey: ['/api/performance'],
  });

  // Dummy data for demonstration
  const statsData = {
    questionsResolved: 248,
    correctPercentage: 76,
    hoursStudied: 42,
    streak: 8
  };

  const popularSubjects = [
    { id: "portugues", name: "Português", questionCount: 1127, icon: <Book className="h-8 w-8" />, color: "blue" },
    { id: "matematica", name: "Matemática", questionCount: 1328, icon: <Calculator className="h-8 w-8" />, color: "green" },
    { id: "fisica", name: "Física", questionCount: 832, icon: <Atom className="h-8 w-8" />, color: "yellow" },
    { id: "quimica", name: "Química", questionCount: 764, icon: <FlaskRound className="h-8 w-8" />, color: "green" },
    { id: "biologia", name: "Biologia", questionCount: 892, icon: <Leaf className="h-8 w-8" />, color: "green" }
  ];

  const recentMaterialsData = [
    {
      id: 1,
      title: "Hereditariedade: o que é, conceitos importantes e como cai no vestibular",
      description: "Nossos olhos, nosso cabelo, a cor da nossa pele e nossa altura. O que tudo isso tem em comum? Todas estas características são herdadas...",
      category: "Biologia",
      image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 2,
      title: "Equações do 2º grau: resolução passo a passo",
      description: "Aprenda como resolver equações quadráticas utilizando a fórmula de Bhaskara e outros métodos práticos com diversos exemplos...",
      category: "Matemática",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 3,
      title: "Colocação pronominal: próclise, mesóclise e ênclise",
      description: "Entenda quando utilizar cada tipo de colocação pronominal e quais são as regras que determinam o posicionamento dos pronomes oblíquos...",
      category: "Português",
      image: "https://images.unsplash.com/photo-1455894127589-22f75500213a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    }
  ];

  const performanceChartData = [
    { subject: "Português", percentage: 82, color: "#3b82f6" },
    { subject: "Matemática", percentage: 65, color: "#22c55e" },
    { subject: "Física", percentage: 58, color: "#eab308" },
    { subject: "Química", percentage: 72, color: "#22c55e" },
    { subject: "Biologia", percentage: 88, color: "#22c55e" },
    { subject: "História", percentage: 76, color: "#ef4444" },
    { subject: "Geografia", percentage: 70, color: "#f97316" },
  ];

  const progressChartData = [
    {
      id: "Acertos",
      color: "#7c3aed",
      data: [
        { x: "Sem 1", y: 65 },
        { x: "Sem 2", y: 68 },
        { x: "Sem 3", y: 72 },
        { x: "Sem 4", y: 76 },
        { x: "Sem 5", y: 74 },
        { x: "Sem 6", y: 80 },
      ]
    },
    {
      id: "Questões",
      color: "#22c55e",
      data: [
        { x: "Sem 1", y: 25 },
        { x: "Sem 2", y: 36 },
        { x: "Sem 3", y: 30 },
        { x: "Sem 4", y: 45 },
        { x: "Sem 5", y: 40 },
        { x: "Sem 6", y: 55 },
      ]
    }
  ];

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
    };
    
    return styles[category] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  const getSubjectIconStyle = (color: string) => {
    const styles: Record<string, { bg: string, text: string }> = {
      "blue": { bg: "bg-blue-100", text: "text-blue-600" },
      "green": { bg: "bg-green-100", text: "text-green-600" },
      "yellow": { bg: "bg-yellow-100", text: "text-yellow-600" },
      "red": { bg: "bg-red-100", text: "text-red-600" },
      "orange": { bg: "bg-orange-100", text: "text-orange-600" },
      "purple": { bg: "bg-purple-100", text: "text-purple-600" },
    };
    
    return styles[color] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Olá, Warlisson!</h1>
        <p className="text-neutral-600">Bem-vindo de volta à sua plataforma de estudos para o ENEM.</p>
      </div>

      {/* Hero Banner */}
      <div className="bg-primary rounded-xl overflow-hidden relative mb-12">
        <div className="flex flex-col md:flex-row">
          <div className="p-8 md:w-7/12 z-10">
            <h2 className="text-white text-2xl font-bold mb-4">Boas-vindas! Vamos estudar?</h2>
            <p className="text-primary-100 mb-6">
              Olá, estamos muito felizes que você está aqui! Saiba mais sobre
              nossa missão, nossos valores e por qual motivo queremos lhe
              ajudar a alcançar o tão sonhado vaga no ensino superior.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="bg-white hover:bg-neutral-100 text-primary">
                <Box className="mr-2 h-4 w-4" />
                Conheça o Prisma
              </Button>
              <Button className="bg-primary-700 hover:bg-primary-800 text-white">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Comece a praticar
              </Button>
            </div>
          </div>
          <div className="md:w-5/12 relative">
            <img 
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=800" 
              alt="Estudante se preparando para o ENEM" 
              className="h-full w-full object-cover md:absolute inset-0" 
            />
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 h-6 w-6 bg-orange-400 rounded-full"></div>
            <div className="absolute top-20 right-20 h-4 w-4 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-10 right-10 h-8 w-8 bg-white opacity-50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <DataCard 
          title="Questões Resolvidas" 
          value={statsData.questionsResolved}
          description="+12 desde ontem"
          icon={<CheckCircle className="h-5 w-5" />}
          iconBgColor="bg-primary-100"
          iconColor="text-primary"
        />
        
        <DataCard 
          title="Acertos" 
          value={`${statsData.correctPercentage}%`}
          description="+2% desde a semana passada"
          icon={<Target className="h-5 w-5" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <DataCard 
          title="Horas Estudadas" 
          value={`${statsData.hoursStudied}h`}
          description="Este mês"
          icon={<Clock className="h-5 w-5" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        
        <DataCard 
          title="Dias Consecutivos" 
          value={statsData.streak}
          description="Continue assim!"
          icon={<Flame className="h-5 w-5" />}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Recent Materials */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Materiais Recentes</h2>
          <Link href="/materiais">
            <div className="text-primary hover:text-primary-700 text-sm font-medium flex items-center cursor-pointer">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMaterialsData.map((material) => {
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

      {/* Popular Subjects */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Disciplinas Populares</h2>
          <Link href="/disciplinas">
            <a className="text-primary hover:text-primary-700 text-sm font-medium flex items-center">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularSubjects.map((subject) => {
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
      </div>

      {/* Performance Summary */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Seu Desempenho</h2>
          <Link href="/desempenho">
            <a className="text-primary hover:text-primary-700 text-sm font-medium flex items-center">
              Ver detalhes
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <PerformanceChart data={performanceChartData} />
            </div>
            
            <div className="md:w-1/2">
              <ProgressChart data={progressChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
