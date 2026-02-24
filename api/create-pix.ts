export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const auth = Buffer.from(
      `${process.env.KOREPAY_PUBLIC}:${process.env.KOREPAY_SECRET}`
    ).toString("base64");

    const response = await fetch(
      "https://api.korepay.com.br/v1/transactions",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Basic ${auth}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "pix",
          amount,
          pix: { expiresInDays: 1 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Erro ao criar PIX",
        details: data,
      });
    }

    return res.status(200).json({
      transactionId: data.id,
      qrCodeBase64: data.pix?.qrCode,
      copiaECola: data.pix?.emv,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno",
      details: error.message,
    });
  }
}