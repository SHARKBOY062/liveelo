import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const PUBLIC = process.env.KOREPAY_PUBLIC;
    const SECRET = process.env.KOREPAY_SECRET;

    if (!PUBLIC || !SECRET) {
      return res.status(500).json({
        error: "Credenciais KorePay não configuradas",
      });
    }

    const auth = Buffer.from(`${PUBLIC}:${SECRET}`).toString("base64");

    const response = await axios.post(
      "https://api.korepay.com.br/v1/transactions",
      {
        paymentMethod: "pix",
        amount: Number(amount),

        customer: {
          name: "Cliente Teste",
          email: "cliente@teste.com",
          document: {
            number: "12345678909",
            type: "cpf",
          },
          phone: {
            countryCode: "55",
            areaCode: "11",
            number: "999999999",
          },
        },

        items: [
          {
            title: "Taxa de Liberação",
            unitPrice: Number(amount),
            quantity: 1,
            tangible: false,
          },
        ],

        pix: {
          expiresInDays: 1,
        },
      },
      {
        headers: {
          accept: "application/json",
          authorization: `Basic ${auth}`,
          "content-type": "application/json",
        },
      }
    );

    return res.status(200).json({
      transactionId: response.data.id,
      qrCodeBase64: response.data.pix?.qrCode,
      copiaECola: response.data.pix?.emv,
    });
  } catch (error: any) {
    console.error("KorePay Error:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Erro ao criar PIX",
      details: error.response?.data || error.message,
    });
  }
}