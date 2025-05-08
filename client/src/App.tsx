import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/components/layout/main-layout";
import Home from "@/pages/home";
import Novidades from "@/pages/novidades";
import Questoes from "@/pages/questoes";
import QuestoesDetail from "@/pages/questoes-detail";
import Desempenho from "@/pages/desempenho";
import Disciplinas from "@/pages/disciplinas";
import Videos from "@/pages/videos";
import VideoDetail from "@/pages/video-detail";
import VideosFavorites from "@/pages/videos-favorites";
import Artigos from "@/pages/artigos";
import ArtigoDetail from "@/pages/artigo-detail";
import Trilhas from "@/pages/trilhas";
import TrilhaDetail from "@/pages/trilha-detail";
import AulaDetail from "@/pages/aula-detail";
import Arquivos from "@/pages/arquivos";
import PlanoEstudos from "@/pages/plano-estudos";
import NotFound from "@/pages/not-found";

// Novas páginas para Flash Cards, Exames e Fóruns
import FlashCards from "@/pages/flashcards";
import FlashCardDetail from "@/pages/flashcard-detail";
import FlashCardDecks from "@/pages/flashcard-decks";
import FlashCardDeckDetail from "@/pages/flashcard-deck-detail";
import NewFlashCard from "@/pages/flashcards/new";
import Exams from "@/pages/exams";
import ExamDetail from "@/pages/exam-detail";
import ExamAttempt from "@/pages/exam-attempt";
import Forums from "@/pages/forums";
import ForumDetail from "@/pages/forum-detail";
import ThreadDetail from "@/pages/thread-detail";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/novidades" component={Novidades} />
        <Route path="/questoes" component={Questoes} />
        <Route path="/questoes/:subject" component={QuestoesDetail} />
        <Route path="/desempenho" component={Desempenho} />
        <Route path="/disciplinas" component={Disciplinas} />
        <Route path="/disciplinas/:subject" component={Disciplinas} />
        <Route path="/videos" component={Videos} />
        <Route path="/video/:id" component={VideoDetail} />
        <Route path="/videos/favorites" component={VideosFavorites} />
        <Route path="/artigos" component={Artigos} />
        <Route path="/artigos/:id" component={ArtigoDetail} />
        <Route path="/trilhas" component={Trilhas} />
        <Route path="/trilhas/:id" component={TrilhaDetail} />
        <Route path="/aula/:id" component={AulaDetail} />
        <Route path="/arquivos" component={Arquivos} />
        <Route path="/arquivos/:folderId" component={Arquivos} />
        <Route path="/plano-estudos" component={PlanoEstudos} />
        <Route path="/plano-estudos/:planId" component={PlanoEstudos} />
        
        {/* Rotas para Flash Cards */}
        <Route path="/flashcards" component={FlashCards} />
        <Route path="/flashcards/new" component={NewFlashCard} />
        <Route path="/flashcards/:id" component={FlashCardDetail} />
        <Route path="/flashcard-decks" component={FlashCardDecks} />
        <Route path="/flashcard-deck/:id" component={FlashCardDeckDetail} />
        
        {/* Rotas para Exames (Simulados) */}
        <Route path="/exams" component={Exams} />
        <Route path="/exam/:id" component={ExamDetail} />
        <Route path="/exam/:id/attempt/:attemptId" component={ExamAttempt} />
        
        {/* Rotas para Fóruns */}
        <Route path="/forums" component={Forums} />
        <Route path="/forum/:id" component={ForumDetail} />
        <Route path="/thread/:id" component={ThreadDetail} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
