import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/consulta-cpf", async (req, res) => {
    const cpf = req.query.cpf as string;
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      return res.status(400).json({ error: "CPF invalido" });
    }

    const cleanCpf = cpf.replace(/\D/g, "");

    try {
      const response = await fetch(
        `https://searchapi.dnnl.live/consulta?token_api=3531&cpf=${cleanCpf}`
      );
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log("CPF API response:", JSON.stringify(data));
        res.json(data);
      } catch {
        console.error("CPF API returned non-JSON:", text.substring(0, 200));
        res.status(502).json({ error: "Resposta invalida da API" });
      }
    } catch (err) {
      console.error("Erro ao consultar CPF:", err);
      res.status(500).json({ error: "Erro ao consultar CPF" });
    }
  });

  return httpServer;
}
