import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Search, 
  ChevronRight, 
  HelpCircle,
  FilePlus, 
  Clock,
  Check,
  MailIcon,
  PhoneIcon,
  Send,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/ui/page-title";

interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  responses: {
    id: number;
    message: string;
    isStaff: boolean;
    createdAt: string;
    staffName?: string;
    staffAvatar?: string;
  }[];
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function CentralAluno() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  
  // Buscar tickets de suporte
  const { 
    data: tickets = [],
    isLoading: isLoadingTickets,
    error: ticketsError 
  } = useQuery<SupportTicket[]>({
    queryKey: ['/api/support/tickets'],
  });
  
  // Buscar FAQs
  const { 
    data: faqs = [],
    isLoading: isLoadingFaqs,
    error: faqsError 
  } = useQuery<FAQItem[]>({
    queryKey: ['/api/support/faqs'],
  });
  
  // Mutação para criar um novo ticket
  const createTicketMutation = useMutation({
    mutationFn: async (data: { subject: string; message: string }) => {
      return apiRequest("POST", "/api/support/tickets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
      toast({
        title: "Ticket criado",
        description: "Seu ticket foi enviado com sucesso! Responderemos em breve.",
      });
      setNewTicketSubject("");
      setNewTicketMessage("");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o ticket. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error creating ticket:", error);
    }
  });
  
  // Mutação para responder a um ticket
  const replyToTicketMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      return apiRequest("POST", `/api/support/tickets/${ticketId}/replies`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi enviada com sucesso!",
      });
      setNewMessage("");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua resposta. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error replying to ticket:", error);
    }
  });
  
  // Filtrar FAQs
  const filteredFaqs = faqs.filter((faq: FAQItem) => {
    return searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Agrupar FAQs por categoria
  const faqsByCategory: Record<string, FAQItem[]> = {};
  filteredFaqs.forEach((faq: FAQItem) => {
    if (!faqsByCategory[faq.category]) {
      faqsByCategory[faq.category] = [];
    }
    faqsByCategory[faq.category].push(faq);
  });
  
  // Handler para enviar novo ticket
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast({
        title: "Campos em branco",
        description: "Por favor, preencha todos os campos para enviar seu ticket.",
        variant: "destructive",
      });
      return;
    }
    
    createTicketMutation.mutate({
      subject: newTicketSubject,
      message: newTicketMessage
    });
  };
  
  // Handler para responder a um ticket
  const handleReplyToTicket = () => {
    if (!newMessage.trim() || !selectedTicket) {
      toast({
        title: "Mensagem em branco",
        description: "Por favor, escreva uma mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }
    
    replyToTicketMutation.mutate({
      ticketId: selectedTicket.id,
      message: newMessage
    });
  };
  
  // Renderizar estado de carregamento
  if (isLoadingTickets || isLoadingFaqs) {
    return (
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex items-center mb-8">
          <PageTitle 
            title="Central do Aluno" 
            icon={<HeadphonesIcon className="h-6 w-6" />}
          />
        </div>
        <div className="space-y-6 animate-pulse">
          <div className="h-12 bg-gray-100 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-100 rounded-md"></div>
            <div className="h-64 bg-gray-100 rounded-md md:col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar mensagem de erro
  // if (ticketsError || faqsError) {
  //   return (
  //     <div className="container max-w-7xl mx-auto py-6">
  //       <div className="flex items-center mb-8">
  //         <PageTitle 
  //           title="Central do Aluno" 
  //           icon={<HeadphonesIcon className="h-6 w-6" />}
  //         />
  //       </div>
  //       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
  //         Ocorreu um erro ao carregar as informações. Tente novamente mais tarde.
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <PageTitle 
          title="Central do Aluno" 
          description="Tire suas dúvidas e obtenha suporte"
          icon={<HeadphonesIcon className="h-6 w-6" />}
        />
        
        <Tabs defaultValue="faq">
          <TabsList className="mb-6">
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              Perguntas Frequentes
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <MessageSquare className="h-4 w-4 mr-2" />
              Meus Tickets
            </TabsTrigger>
            <TabsTrigger value="new">
              <FilePlus className="h-4 w-4 mr-2" />
              Novo Ticket
            </TabsTrigger>
          </TabsList>
          
          {/* Perguntas Frequentes */}
          <TabsContent value="faq">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar perguntas frequentes..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma pergunta encontrada</h3>
                      <p className="text-muted-foreground">
                        Tente buscar com outros termos ou crie um ticket para o nosso suporte.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {Object.entries(faqsByCategory).map(([category, items]) => (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {items.map((faq: FAQItem) => (
                            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                              <AccordionTrigger className="text-base font-medium">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">Não encontrou o que procurava?</h3>
                    <p className="text-muted-foreground mb-4">
                      Entre em contato com nosso suporte e teremos prazer em ajudar.
                    </p>
                    <Button onClick={() => document.querySelector('button[value="new"]')?.click()}>
                      Criar novo ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Meus Tickets */}
          <TabsContent value="tickets">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Meus tickets</h3>
                
                {tickets.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-6">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhum ticket encontrado</h3>
                        <p className="text-muted-foreground mb-4">
                          Você ainda não criou nenhum ticket de suporte.
                        </p>
                        <Button onClick={() => document.querySelector('button[value="new"]')?.click()}>
                          Criar novo ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket: SupportTicket) => (
                      <Card 
                        key={ticket.id}
                        className={`cursor-pointer transition-colors hover:border-primary ${selectedTicket?.id === ticket.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium truncate">{ticket.subject}</h4>
                            <Badge 
                              variant={
                                ticket.status === 'open' 
                                  ? 'outline' 
                                  : ticket.status === 'in_progress' 
                                    ? 'default' 
                                    : 'secondary'
                              }
                              className={
                                ticket.status === 'in_progress' 
                                  ? 'bg-blue-600' 
                                  : ticket.status === 'resolved' 
                                    ? 'bg-green-600' 
                                    : ''
                              }
                            >
                              {ticket.status === 'open' ? 'Aberto' : 
                               ticket.status === 'in_progress' ? 'Em andamento' : 'Resolvido'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-2">
                            {ticket.message.length > 60 
                              ? ticket.message.substring(0, 60) + "..." 
                              : ticket.message}
                          </p>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {ticket.responses.length}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                {selectedTicket ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                        <Badge 
                          variant={
                            selectedTicket.status === 'open' 
                              ? 'outline' 
                              : selectedTicket.status === 'in_progress' 
                                ? 'default' 
                                : 'secondary'
                          }
                          className={
                            selectedTicket.status === 'in_progress' 
                              ? 'bg-blue-600' 
                              : selectedTicket.status === 'resolved' 
                                ? 'bg-green-600' 
                                : ''
                          }
                        >
                          {selectedTicket.status === 'open' ? 'Aberto' : 
                           selectedTicket.status === 'in_progress' ? 'Em andamento' : 'Resolvido'}
                        </Badge>
                      </div>
                      <CardDescription>
                        Ticket #{selectedTicket.id} • Aberto em{' '}
                        {new Date(selectedTicket.createdAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted rounded-md">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {selectedTicket.responses[0]?.staffName?.slice(0, 2).toUpperCase() || 'EU'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium">Você</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(selectedTicket.createdAt).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm">{selectedTicket.message}</p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedTicket.responses.map((response) => (
                        <div 
                          key={response.id}
                          className={`p-4 rounded-md ${response.isStaff ? 'bg-primary/10' : 'bg-muted'}`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              {response.isStaff && response.staffAvatar && (
                                <AvatarImage src={response.staffAvatar} alt={response.staffName || 'Atendente'} />
                              )}
                              <AvatarFallback>
                                {response.isStaff 
                                  ? response.staffName?.slice(0, 2).toUpperCase() || 'AT'
                                  : 'EU'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {response.isStaff 
                                    ? (response.staffName || 'Atendente') 
                                    : 'Você'}
                                </span>
                                {response.isStaff && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Suporte
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(response.createdAt).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              <p className="text-sm">{response.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {selectedTicket.status !== 'resolved' && (
                        <div className="pt-4">
                          <Textarea
                            placeholder="Escreva sua resposta..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="mb-3"
                            rows={4}
                          />
                          <div className="flex justify-end">
                            <Button 
                              onClick={handleReplyToTicket}
                              disabled={replyToTicketMutation.isPending || !newMessage.trim()}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {replyToTicketMutation.isPending ? "Enviando..." : "Enviar resposta"}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedTicket.status === 'resolved' && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-center">
                          <Check className="h-5 w-5 mr-2" />
                          <p>Este ticket está resolvido. Se precisar de mais ajuda, crie um novo ticket.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-6">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Detalhes do ticket</h3>
                        <p className="text-muted-foreground">
                          Selecione um ticket da lista para ver seus detalhes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Novo Ticket */}
          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Criar novo ticket</CardTitle>
                    <CardDescription>
                      Descreva sua dúvida ou problema em detalhes para que possamos te ajudar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Assunto
                        </label>
                        <Input
                          id="subject"
                          placeholder="Digite o assunto do seu ticket"
                          value={newTicketSubject}
                          onChange={(e) => setNewTicketSubject(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Mensagem
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Descreva sua dúvida ou problema em detalhes..."
                          value={newTicketMessage}
                          onChange={(e) => setNewTicketMessage(e.target.value)}
                          rows={6}
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          disabled={createTicketMutation.isPending || !newTicketSubject.trim() || !newTicketMessage.trim()}
                        >
                          {createTicketMutation.isPending ? "Enviando..." : "Enviar ticket"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Canais de atendimento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MailIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">E-mail</h4>
                        <p className="text-sm text-muted-foreground">
                          suporte@enem.com.br
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tempo médio de resposta: 24 horas
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start space-x-3">
                      <PhoneIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Telefone</h4>
                        <p className="text-sm text-muted-foreground">
                          0800 123 4567
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Segunda a sexta, das 8h às 18h
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Chat ao vivo</h4>
                        <p className="text-sm text-muted-foreground">
                          Disponível no canto inferior direito do site
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Segunda a sexta, das 9h às 17h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Perguntas populares</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <Button variant="link" className="w-full justify-start p-4 h-auto" asChild>
                        <div onClick={() => document.querySelector('button[value="faq"]')?.click()}>
                          <div className="flex justify-between w-full items-center">
                            <span className="text-sm text-left">Como recuperar minha senha?</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="link" className="w-full justify-start p-4 h-auto" asChild>
                        <div onClick={() => document.querySelector('button[value="faq"]')?.click()}>
                          <div className="flex justify-between w-full items-center">
                            <span className="text-sm text-left">Como cancelar minha assinatura?</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Button>
                      
                      <Button variant="link" className="w-full justify-start p-4 h-auto" asChild>
                        <div onClick={() => document.querySelector('button[value="faq"]')?.click()}>
                          <div className="flex justify-between w-full items-center">
                            <span className="text-sm text-left">Como atualizar meus dados de pagamento?</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}