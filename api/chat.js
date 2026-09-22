export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        reply: "Please enter a message."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "OPENAI_API_KEY is missing from Vercel."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        reply: data?.error?.message || "OpenAI API error."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "KJ AI received no response."
    });

  } catch (error) {
    return res.status(500).json({
      reply: "Server error: " + error.message
    });
  }
}
