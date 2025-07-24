// netlify/functions/groq-handler.js

exports.handler = async function (event) {
  console.log("Groq function started.");

  let message = "";

  // ✅ جلب الرسالة من الطلب
  try {
    const body = JSON.parse(event.body);
    message = (body.message || "").trim();
    console.log("Received message:", message);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." })
    };
  }

  // ✅ التحقق من الرسالة
  if (!message || /^[^a-zA-Z\u0600-\u06FF]+$/.test(message)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "يرجى كتابة رسالة واضحة لأتمكن من مساعدتك." })
    };
  }

  // ✅ الموديل (يمكن تغييره هنا)
  const MODEL = "llama3-70b-8192"; // بدائل: llama3-8b-8192, gemma-7b-it

  // ✅ كشف اللغة (عربي أو إنجليزي)
  const isArabic = /[\u0600-\u06FF]/.test(message);

  // ✅ شخصية وتعليمات قوية للبوت
  const SYSTEM_PROMPT = isArabic
    ? `
أنت "أسامة بوت"، مساعد نفسي وتقني ذكي. 
رد دائمًا باللغة العربية الفصحى فقط، حتى لو كانت الرسالة تحتوي على لغات أخرى.
- لا تستخدم أسماء مثل echo أو user أو أي لقب.
- تحدث بصيغة المخاطب (أنت).
- اجعل الرد موجزًا في 4-6 جمل بحد أقصى.
- إذا كان الموضوع عملي، قسّم النص إلى نقاط مرتبة.
- لا تكرر نفس الفكرة، وحافظ على أسلوب بشري دافئ.
`
    : `
You are "Osama Bot", a smart and empathetic psychological & tech assistant.
Always respond in clear English.
- Never add names like echo or user.
- Speak directly to the user ("you").
- Keep the reply short: 4-6 sentences maximum.
- If the topic needs steps, use bullet points.
- Be warm and helpful without repeating ideas.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.GROQ_API_KEY // يجب أن يبدأ بـ Bearer في Netlify
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

    // ✅ معالجة الأخطاء من Groq
    if (data.error) {
      console.error("Groq API error:", data.error);
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: isArabic ? "عذرًا، حدث خطأ أثناء الاتصال. حاول لاحقًا." : "Sorry, there was an error connecting. Please try again later." })
      };
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      (isArabic ? "عذرًا، لم أتمكن من توليد رد الآن." : "Sorry, I couldn't generate a response right now.");

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("Error calling Groq API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: isArabic ? "حدث خطأ غير متوقع. حاول لاحقًا." : "An unexpected error occurred. Please try again later." })
    };
  }
};
