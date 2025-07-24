exports.handler = async function (event) {
  console.log("Groq function started.");

  let message = "";

  try {
    const body = JSON.parse(event.body);
    message = (body.message || "").trim();
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." })
    };
  }

  if (!message || /^[^a-zA-Z\u0600-\u06FF]+$/.test(message)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "يرجى كتابة رسالة واضحة لأتمكن من مساعدتك." })
    };
  }

  const MODEL = "llama3-70b-8192";
  const isArabic = /[\u0600-\u06FF]/.test(message);

  const SYSTEM_PROMPT = isArabic
    ? `
أنت "أسامة بوت"، مساعد نفسي وتقني ذكي.
- رد دائمًا باللغة العربية الفصحى فقط.
- لا تستخدم أي أسماء للمستخدم، ولا تبدأ ردك بكلمات مثل أهلاً أو مرحبًا أو أسماء.
- ابدأ الرد مباشرة بالمحتوى المفيد.
- اجعل الرد موجزًا في 4-6 جمل بحد أقصى.
- إذا كان الموضوع عملي، قسّم النص إلى نقاط مرتبة.
`
    : `
You are "Osama Bot", a smart and empathetic assistant.
- Always respond in English.
- Never add names or greetings like Hi, Hello, Hey at the start.
- Start directly with useful content.
- Keep the reply short: 4-6 sentences.
`;

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

    if (data.error) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          reply: isArabic
            ? "عذرًا، حدث خطأ أثناء الاتصال. حاول لاحقًا."
            : "Sorry, there was an error connecting. Please try again later."
        })
      };
    }

    let reply =
      data?.choices?.[0]?.message?.content ||
      (isArabic
        ? "عذرًا، لم أتمكن من توليد رد الآن."
        : "Sorry, I couldn't generate a response right now.");

    // ✅ إزالة أي أسماء أو تحيات في البداية
    reply = reply.replace(/^(أهلاً|مرحبًا|Hi|Hello|Hey)[^:،]*[:،]?\s*/i, "").trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: isArabic
          ? "حدث خطأ غير متوقع. حاول لاحقًا."
          : "An unexpected error occurred. Please try again later."
      })
    };
  }
};
