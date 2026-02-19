import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Resgate from "@/pages/Resgate";
import Banco from "@/pages/Banco";
import Confirmacao from "@/pages/Confirmacao";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resgate" component={Resgate} />
      <Route path="/banco" component={Banco} />
      <Route path="/confirmacao" component={Confirmacao} />
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
