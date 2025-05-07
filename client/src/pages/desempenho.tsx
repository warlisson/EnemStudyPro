import { DataCard } from "@/components/ui/data-card";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { ProgressChart } from "@/components/charts/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  Flame, 
  Target, 
  Award,
  TrendingUp,
  BarChart2 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveCalendar } from "@nivo/calendar";

export default function Desempenho() {
  // Fetch performance data
  const { data: performanceData, isLoading: loadingPerformance } = useQuery({
    queryKey: ['/api/performance'],
  });

  // Fetch statistics
  const { data: statistics, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/statistics'],
  });

  // Dummy data for charts
  const statsData = {
    questionsResolved: 248,
    correctPercentage: 76,
    hoursStudied: 42,
    streak: 8
  };

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

  const subjectDistributionData = [
    { id: "Português", value: 25, color: "#3b82f6" },
    { id: "Matemática", value: 20, color: "#22c55e" },
    { id: "Física", value: 15, color: "#eab308" },
    { id: "Química", value: 10, color: "#22c55e" },
    { id: "Biologia", value: 12, color: "#22c55e" },
    { id: "História", value: 8, color: "#ef4444" },
    { id: "Geografia", value: 10, color: "#f97316" },
  ];

  // Generate calendar data for the last 365 days
  const generateCalendarData = () => {
    const data = [];
    const now = new Date();
    for (let i = 365; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Format date as YYYY-MM-DD
      const formatDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Random value between 0-10 with higher probability of 0
      const random = Math.random();
      const value = random > 0.6 ? Math.floor(random * 10) + 1 : 0;
      
      data.push({
        day: formatDate,
        value
      });
    }
    return data;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Meu Desempenho</h1>
        <p className="text-neutral-600">Acompanhe seu progresso e analise seu desempenho nos estudos.</p>
      </header>

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

      {/* Main Performance Dashboard */}
      <div className="mb-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="by-subject">Por Disciplina</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <PerformanceChart data={performanceChartData} />
              <ProgressChart data={progressChartData} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-neutral-800">Distribuição de estudo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsivePie
                      data={subjectDistributionData}
                      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ datum: 'data.color' }}
                      borderWidth={1}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                      arcLinkLabelsSkipAngle={10}
                      arcLinkLabelsTextColor="#333333"
                      arcLinkLabelsThickness={2}
                      arcLinkLabelsColor={{ from: 'color' }}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                      legends={[
                        {
                          anchor: 'right',
                          direction: 'column',
                          justify: false,
                          translateX: 0,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemWidth: 100,
                          itemHeight: 20,
                          itemTextColor: '#999',
                          itemDirection: 'left-to-right',
                          itemOpacity: 1,
                          symbolSize: 18,
                          symbolShape: 'circle',
                        }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-neutral-800">Resumo de conquistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary-100 text-primary rounded-full">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Mestre em Matemática</h3>
                        <p className="text-sm text-neutral-500">100 questões de matemática resolvidas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Progresso Consistente</h3>
                        <p className="text-sm text-neutral-500">7 dias consecutivos de estudo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <BarChart2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">Aproveitamento Excelente</h3>
                        <p className="text-sm text-neutral-500">Mais de 80% de acerto em Biologia</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="by-subject">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {performanceChartData.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-neutral-800">{subject.subject}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Taxa de acertos</span>
                        <span className="text-2xl font-bold" style={{ color: subject.color }}>{subject.percentage}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Questões resolvidas</span>
                        <span className="text-xl font-semibold">{Math.floor(Math.random() * 100) + 20}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tempo médio por questão</span>
                        <span className="text-xl font-semibold">{Math.floor(Math.random() * 3) + 2}m {Math.floor(Math.random() * 60)}s</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Horas estudadas</span>
                        <span className="text-xl font-semibold">{Math.floor(Math.random() * 10) + 2}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-neutral-800">Atividades diárias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveCalendar
                    data={calendarData}
                    from={calendarData[0].day}
                    to={calendarData[calendarData.length - 1].day}
                    emptyColor="#eeeeee"
                    colors={['#f9dcdc', '#f8c4c4', '#f2aaaa', '#e88b8b', '#df6e6e', '#d65151', '#c73333']}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    yearSpacing={40}
                    monthBorderColor="#ffffff"
                    dayBorderWidth={2}
                    dayBorderColor="#ffffff"
                    legends={[
                      {
                        anchor: 'bottom-right',
                        direction: 'row',
                        translateY: 36,
                        itemCount: 4,
                        itemWidth: 42,
                        itemHeight: 36,
                        itemsSpacing: 14,
                        itemDirection: 'right-to-left'
                      }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Performance */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Desempenho recente</h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full ${Math.random() > 0.3 ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                      {Math.random() > 0.3 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-600">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{["Português", "Matemática", "Física", "Química", "Biologia", "História", "Geografia"][Math.floor(Math.random() * 7)]}</h3>
                      <p className="text-sm text-neutral-500">ENEM {2022 + Math.floor(Math.random() * 2)} - {Math.random() > 0.5 ? "Interpretação Textual" : "Geometria Analítica"}</p>
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
    </div>
  );
}
