// netlify/functions/groq-handler.js

exports.handler = async function (event) {
  console.log("Groq function started.");

  let message = "";

  try {
    const body = JSON.parse(event.body);
    message = body.message || "";
    console.log("Received message:", message);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." })
    };
  }

  if (!message.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Message is empty or missing." })
    };
  }

  const MODEL = "llama3-70b-8192";

  // ✅ اكتشاف اللغة: إذا الرسالة فيها حروف عربية
  const isArabic = /[\u0600-\u06FF]/.test(message);

  // ✅ تحديد التعليمات بناءً على اللغة
  const SYSTEM_PROMPT = isArabic
    ? `أنت مساعد ذكي ونفسي لطيف. رد دائماً باللغة العربية الفصحى. اجعل الإجابات مفهومة وبأسلوب إنساني عميق.`
    : `You are a wise and empathetic psychological assistant. Always respond in English, with clear and human-like language.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      (isArabic ? "لم أتمكن من توليد رد الآن." : "I couldn't generate a response right now.");

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error connecting to AI assistant." })
    };
  }
};
