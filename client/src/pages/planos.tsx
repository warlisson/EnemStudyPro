import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Shield, 
  CheckCircle2, 
  XCircle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import PageTitle from "@/components/ui/page-title";

const planFeatures = {
  free: {
    title: "Gratuito",
    price: "R$ 0",
    period: "Para sempre",
    description: "Acesso básico para começar seus estudos",
    features: [
      { name: "Simulados básicos", included: true },
      { name: "Questões limitadas", included: true },
      { name: "Estatísticas básicas", included: true },
      { name: "Flashcards (até 50)", included: true },
      { name: "Artigos selecionados", included: true },
      { name: "Vídeo-aulas populares", included: true },
      { name: "Fórum de discussão", included: true },
      { name: "Plano de estudos básico", included: false },
      { name: "Simulados ilimitados", included: false },
      { name: "Vídeo-aulas exclusivas", included: false },
      { name: "Aulas ao vivo", included: false },
      { name: "Suporte prioritário", included: false },
      { name: "Sem anúncios", included: false },
      { name: "Correção detalhada de redações", included: false }
    ]
  },
  basic: {
    title: "Básico",
    price: "R$ 29,90",
    period: "por mês",
    description: "O plano ideal para quem quer avançar nos estudos",
    features: [
      { name: "Simulados básicos", included: true },
      { name: "Questões ilimitadas", included: true },
      { name: "Estatísticas detalhadas", included: true },
      { name: "Flashcards ilimitados", included: true },
      { name: "Acesso a todos os artigos", included: true },
      { name: "Vídeo-aulas completas", included: true },
      { name: "Fórum de discussão", included: true },
      { name: "Plano de estudos personalizado", included: true },
      { name: "Simulados ilimitados", included: true },
      { name: "Vídeo-aulas exclusivas", included: false },
      { name: "Aulas ao vivo (1x por semana)", included: false },
      { name: "Suporte prioritário", included: false },
      { name: "Sem anúncios", included: true },
      { name: "Correção de redações (1 por mês)", included: true }
    ]
  },
  premium: {
    title: "Premium",
    price: "R$ 59,90",
    period: "por mês",
    description: "Tudo que você precisa para se preparar para o ENEM",
    features: [
      { name: "Simulados básicos", included: true },
      { name: "Questões ilimitadas", included: true },
      { name: "Estatísticas avançadas", included: true },
      { name: "Flashcards ilimitados", included: true },
      { name: "Acesso a todos os artigos", included: true },
      { name: "Vídeo-aulas completas", included: true },
      { name: "Fórum de discussão", included: true },
      { name: "Plano de estudos personalizado", included: true },
      { name: "Simulados ilimitados", included: true },
      { name: "Vídeo-aulas exclusivas", included: true },
      { name: "Aulas ao vivo (3x por semana)", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Sem anúncios", included: true },
      { name: "Correção de redações (4 por mês)", included: true }
    ]
  },
  yearly: {
    title: "Anual",
    price: "R$ 499,90",
    period: "por ano (R$ 41,66/mês)",
    description: "Melhor custo-benefício com todas as vantagens premium",
    features: [
      { name: "Simulados básicos", included: true },
      { name: "Questões ilimitadas", included: true },
      { name: "Estatísticas avançadas", included: true },
      { name: "Flashcards ilimitados", included: true },
      { name: "Acesso a todos os artigos", included: true },
      { name: "Vídeo-aulas completas", included: true },
      { name: "Fórum de discussão", included: true },
      { name: "Plano de estudos personalizado", included: true },
      { name: "Simulados ilimitados", included: true },
      { name: "Vídeo-aulas exclusivas", included: true },
      { name: "Aulas ao vivo (3x por semana)", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Sem anúncios", included: true },
      { name: "Correção de redações (4 por mês)", included: true }
    ]
  }
};

interface UserPlanInfo {
  premium: boolean;
  currentPlan: string;
  expiryDate: string | null;
}

export default function Planos() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  
  // Buscar informações do plano atual do usuário
  const { data: userPlanInfo } = useQuery<UserPlanInfo>({
    queryKey: ['/api/users/me/plan'],
  });
  
  // Função para iniciar processo de pagamento
  const handleSubscribe = (planType: string) => {
    // Verificar se o usuário já possui o plano selecionado
    if (userPlanInfo?.currentPlan === planType) {
      toast({
        title: "Plano atual",
        description: "Você já está inscrito neste plano.",
        variant: "default",
      });
      return;
    }
    
    // Redirecionar para a página de pagamento
    setLocation(`/checkout?plan=${planType}`);
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <PageTitle 
          title="Planos de Assinatura" 
          description="Escolha o plano ideal para seus estudos"
          icon={<Shield className="h-6 w-6" />}
        />
        
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-4">Invista no seu futuro acadêmico</h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano que melhor se encaixa nas suas necessidades e comece a se preparar para o ENEM e vestibulares com as melhores ferramentas.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Tabs 
            defaultValue="monthly" 
            value={billingPeriod} 
            onValueChange={(value) => setBillingPeriod(value as "monthly" | "annual")}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="annual">Anual (2 meses grátis)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle className="text-xl">{planFeatures.free.title}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{planFeatures.free.price}</span>
                <span className="text-muted-foreground ml-2">{planFeatures.free.period}</span>
              </div>
              <CardDescription>{planFeatures.free.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {planFeatures.free.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" 
                disabled={userPlanInfo?.currentPlan === "free"}
                onClick={() => {
                  toast({
                    title: "Plano Gratuito",
                    description: "Você já está utilizando o plano gratuito",
                  });
                }}
              >
                {userPlanInfo?.currentPlan === "free" ? "Plano atual" : "Começar grátis"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={billingPeriod === "monthly" ? "border-2 border-primary" : "border-2 border-muted"}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {billingPeriod === "monthly" ? planFeatures.basic.title : planFeatures.yearly.title}
                </CardTitle>
                {billingPeriod === "monthly" && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {billingPeriod === "monthly" ? planFeatures.basic.price : planFeatures.yearly.price}
                </span>
                <span className="text-muted-foreground ml-2">
                  {billingPeriod === "monthly" ? planFeatures.basic.period : planFeatures.yearly.period}
                </span>
              </div>
              <CardDescription>
                {billingPeriod === "monthly" ? planFeatures.basic.description : planFeatures.yearly.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {(billingPeriod === "monthly" ? planFeatures.basic : planFeatures.yearly).features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" 
                disabled={
                  (billingPeriod === "monthly" && userPlanInfo?.currentPlan === "basic") ||
                  (billingPeriod === "annual" && userPlanInfo?.currentPlan === "yearly")
                }
                onClick={() => handleSubscribe(billingPeriod === "monthly" ? "basic" : "yearly")}
              >
                {(billingPeriod === "monthly" && userPlanInfo?.currentPlan === "basic") ||
                 (billingPeriod === "annual" && userPlanInfo?.currentPlan === "yearly") 
                  ? "Plano atual"
                  : "Assinar agora"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={billingPeriod === "annual" ? "border-2 border-primary" : "border-2 border-muted"}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {planFeatures.premium.title}
                </CardTitle>
                {billingPeriod === "annual" && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    Melhor valor
                  </span>
                )}
              </div>
              <div className="mt-2">
                <span className="text-3xl font-bold">{planFeatures.premium.price}</span>
                <span className="text-muted-foreground ml-2">{planFeatures.premium.period}</span>
              </div>
              <CardDescription>{planFeatures.premium.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {planFeatures.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" 
                disabled={userPlanInfo?.currentPlan === "premium"}
                onClick={() => handleSubscribe("premium")}
              >
                {userPlanInfo?.currentPlan === "premium" ? "Plano atual" : "Assinar agora"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 bg-muted rounded-lg p-6">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Precisa de ajuda para escolher?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está disponível para ajudar você a escolher o plano que melhor atenda às suas necessidades.
            </p>
            <Button variant="outline" onClick={() => setLocation("/central-aluno")}>
              Falar com um consultor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Perguntas frequentes</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-medium">Como funciona a cobrança?</h4>
              <p className="text-sm text-muted-foreground">
                A cobrança é feita mensalmente ou anualmente, de acordo com o plano escolhido. Você pode cancelar a qualquer momento.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Posso mudar de plano depois?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As cobranças serão ajustadas proporcionalmente.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Qual é a política de reembolso?</h4>
              <p className="text-sm text-muted-foreground">
                Oferecemos garantia de 7 dias para todos os planos. Se você não estiver satisfeito, pode solicitar reembolso integral.
              </p>
            </div>
            
            <div>
              <h4 className="text-base font-medium">Como cancelar a assinatura?</h4>
              <p className="text-sm text-muted-foreground">
                Você pode cancelar sua assinatura a qualquer momento através da página de perfil, na aba "Pagamentos".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}