import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar as CalendarIcon, 
  FileDown, 
  Filter, 
  Search, 
  MapPin, 
  Clock, 
  Calendar as CalendarComponent,
  Info, 
  ExternalLink 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import PageTitle from "@/components/ui/page-title";
import EmptyState from "@/components/ui/empty-state";

interface Exam {
  id: number;
  name: string;
  institution: string;
  registrationStart: string;
  registrationEnd: string;
  examDates: string[];
  locations: string[];
  website: string;
  fee: string;
  logo: string;
  details: string;
  editalUrl: string;
  status: "open" | "closed" | "upcoming";
}

export default function CalendarPage() {
  const currentYear = new Date().getFullYear();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isExamDetailsOpen, setIsExamDetailsOpen] = useState(false);
  
  // Buscar exames
  const { 
    data: exams = [],
    isLoading,
    error
  } = useQuery<Exam[]>({
    queryKey: ['/api/exams/calendar'],
  });
  
  // Filtrar exames
  const filteredExams = exams.filter((exam: Exam) => {
    // Filtro de busca
    const matchesSearch = searchTerm === "" || 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      exam.institution.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de região
    const matchesRegion = regionFilter === "all" || 
      exam.locations.some(location => location.toLowerCase().includes(regionFilter.toLowerCase()));
    
    // Filtro de mês
    const matchesMonth = monthFilter === "all" || 
      exam.examDates.some(date => {
        const examMonth = new Date(date).getMonth() + 1;
        return examMonth.toString() === monthFilter;
      });
    
    // Filtro de status
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    
    return matchesSearch && matchesRegion && matchesMonth && matchesStatus;
  });
  
  // Ordenar exames por data mais próxima
  const sortedExams = [...filteredExams].sort((a: Exam, b: Exam) => {
    const dateA = new Date(a.examDates[0]).getTime();
    const dateB = new Date(b.examDates[0]).getTime();
    return dateA - dateB;
  });
  
  // Agrupar exames por mês para a visualização em calendário
  const examsByMonth: Record<string, Exam[]> = {};
  sortedExams.forEach((exam: Exam) => {
    exam.examDates.forEach(date => {
      const monthKey = format(new Date(date), 'MMMM', { locale: ptBR });
      if (!examsByMonth[monthKey]) {
        examsByMonth[monthKey] = [];
      }
      examsByMonth[monthKey].push(exam);
    });
  });
  
  // Verificar datas no calendário
  const hasExamOnDate = (date: Date) => {
    return exams.some((exam: Exam) => 
      exam.examDates.some(examDate => 
        format(new Date(examDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    );
  };
  
  // Obter exames para a data selecionada no calendário
  const examsOnSelectedDate = selectedDate 
    ? exams.filter((exam: Exam) => 
        exam.examDates.some(examDate => 
          format(new Date(examDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        )
      )
    : [];
  
  // Exibir detalhes do exame
  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam);
    setIsExamDetailsOpen(true);
  };
  
  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <PageTitle 
            title="Calendário de Vestibulares" 
            icon={<CalendarIcon className="h-6 w-6" />}
          />
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <PageTitle 
            title="Calendário de Vestibulares" 
            icon={<CalendarIcon className="h-6 w-6" />}
          />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro ao carregar o calendário de vestibulares. Tente novamente mais tarde.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <PageTitle 
          title="Calendário de Vestibulares" 
          description="Acompanhe as datas de vestibulares e do ENEM"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vestibular ou instituição..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select 
              value={regionFilter} 
              onValueChange={setRegionFilter}
            >
              <SelectTrigger className="w-[180px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as regiões</SelectItem>
                <SelectItem value="norte">Norte</SelectItem>
                <SelectItem value="nordeste">Nordeste</SelectItem>
                <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                <SelectItem value="sudeste">Sudeste</SelectItem>
                <SelectItem value="sul">Sul</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={monthFilter} 
              onValueChange={setMonthFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Clock className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os meses</SelectItem>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Maio</SelectItem>
                <SelectItem value="6">Junho</SelectItem>
                <SelectItem value="7">Julho</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Setembro</SelectItem>
                <SelectItem value="10">Outubro</SelectItem>
                <SelectItem value="11">Novembro</SelectItem>
                <SelectItem value="12">Dezembro</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="open">Inscrições abertas</SelectItem>
                <SelectItem value="upcoming">Em breve</SelectItem>
                <SelectItem value="closed">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "calendar")}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-muted-foreground">
              Exibindo {sortedExams.length} vestibulares
            </div>
          </div>
          
          <TabsContent value="list" className="mt-6">
            {sortedExams.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon className="h-10 w-10" />}
                title="Nenhum vestibular encontrado"
                description="Tente alterar os filtros de busca para encontrar vestibulares."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedExams.map((exam: Exam) => (
                  <Card 
                    key={exam.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleExamClick(exam)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={
                            exam.status === "open" 
                              ? "default" 
                              : exam.status === "upcoming" 
                                ? "outline" 
                                : "secondary"
                          }
                          className={
                            exam.status === "open" 
                              ? "bg-green-600" 
                              : ""
                          }
                        >
                          {exam.status === "open" ? "Inscrições abertas" : 
                           exam.status === "upcoming" ? "Em breve" : "Encerrado"}
                        </Badge>
                        
                        {exam.fee === "Gratuito" && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            Gratuito
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-2">
                        {exam.logo && (
                          <div className="h-10 w-10 mr-3 overflow-hidden">
                            <img 
                              src={exam.logo} 
                              alt={exam.institution} 
                              className="h-full w-full object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg">{exam.name}</CardTitle>
                          <CardDescription>{exam.institution}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CalendarComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {exam.examDates.map(date => format(new Date(date), 'dd/MM/yyyy')).join(', ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{exam.locations.join(', ')}</span>
                        </div>
                        
                        {exam.status === "open" && (
                          <div className="text-sm text-muted-foreground">
                            Inscrições até {format(new Date(exam.registrationEnd), 'dd/MM/yyyy')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {exam.fee !== "Gratuito" ? `Taxa: ${exam.fee}` : ""}
                        </span>
                        
                        <Button variant="ghost" size="sm" className="gap-1" asChild>
                          <a 
                            href={exam.editalUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileDown className="h-4 w-4" />
                            Edital
                          </a>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visualização</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border w-full"
                      modifiers={{
                        highlighted: date => hasExamOnDate(date)
                      }}
                      modifiersClassNames={{
                        highlighted: "bg-primary/20 font-bold text-primary"
                      }}
                    />
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full text-sm text-muted-foreground">
                      Dias com vestibulares estão marcados no calendário
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDate 
                        ? `Vestibulares em ${format(selectedDate, 'dd/MM/yyyy')}`
                        : "Selecione uma data"
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {examsOnSelectedDate.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Nenhum vestibular nesta data</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Selecione outra data ou verifique os dias marcados no calendário
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {examsOnSelectedDate.map((exam: Exam) => (
                          <div 
                            key={exam.id}
                            className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleExamClick(exam)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {exam.logo && (
                                  <div className="h-8 w-8 mr-3 overflow-hidden">
                                    <img 
                                      src={exam.logo} 
                                      alt={exam.institution} 
                                      className="h-full w-full object-contain"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-medium">{exam.name}</h3>
                                  <p className="text-sm text-muted-foreground">{exam.institution}</p>
                                </div>
                              </div>
                              
                              <Badge 
                                variant={
                                  exam.status === "open" 
                                    ? "default" 
                                    : exam.status === "upcoming" 
                                      ? "outline" 
                                      : "secondary"
                                }
                                className={
                                  exam.status === "open" 
                                    ? "bg-green-600" 
                                    : ""
                                }
                              >
                                {exam.status === "open" ? "Inscrições abertas" : 
                                 exam.status === "upcoming" ? "Em breve" : "Encerrado"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm mt-2">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{exam.locations.join(', ')}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm">
                                {exam.fee !== "Gratuito" ? `Taxa: ${exam.fee}` : "Taxa: Gratuito"}
                              </span>
                              
                              <Button variant="ghost" size="sm" className="gap-1" asChild>
                                <a 
                                  href={exam.editalUrl} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FileDown className="h-4 w-4" />
                                  Edital
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Diálogo de detalhes do vestibular */}
      <Dialog open={isExamDetailsOpen} onOpenChange={setIsExamDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedExam && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {selectedExam.logo && (
                      <div className="h-10 w-10 mr-3 overflow-hidden">
                        <img 
                          src={selectedExam.logo} 
                          alt={selectedExam.institution} 
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <DialogTitle>{selectedExam.name}</DialogTitle>
                  </div>
                  
                  <Badge 
                    variant={
                      selectedExam.status === "open" 
                        ? "default" 
                        : selectedExam.status === "upcoming" 
                          ? "outline" 
                          : "secondary"
                    }
                    className={
                      selectedExam.status === "open" 
                        ? "bg-green-600" 
                        : ""
                    }
                  >
                    {selectedExam.status === "open" ? "Inscrições abertas" : 
                     selectedExam.status === "upcoming" ? "Em breve" : "Encerrado"}
                  </Badge>
                </div>
                <DialogDescription>{selectedExam.institution}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Datas das provas</h4>
                    <ul className="mt-1 space-y-1">
                      {selectedExam.examDates.map((date, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <CalendarComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                          {format(new Date(date), 'dd/MM/yyyy')}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Período de inscrição</h4>
                    <p className="mt-1 text-sm">
                      {format(new Date(selectedExam.registrationStart), 'dd/MM/yyyy')} a {' '}
                      {format(new Date(selectedExam.registrationEnd), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Locais de aplicação</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedExam.locations.map((location, index) => (
                      <Badge key={index} variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium">Informações adicionais</h4>
                  <p className="mt-1 text-sm whitespace-pre-line">{selectedExam.details}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">Valor da taxa</h4>
                    <p className="text-sm">
                      {selectedExam.fee}
                    </p>
                  </div>
                  
                  <Button variant="outline" className="gap-1" asChild>
                    <a 
                      href={selectedExam.editalUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      Baixar Edital
                    </a>
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button className="gap-1" asChild>
                  <a 
                    href={selectedExam.website} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visitar site oficial
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}