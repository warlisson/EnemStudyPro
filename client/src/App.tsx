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
import NotFound from "@/pages/not-found";

function Router() {
  return (
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
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
