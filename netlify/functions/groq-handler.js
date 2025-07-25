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
- رد دائمًا باللغة العربية الفصحى فقط وبشكل كامل.
- **ممنوع منعًا باتًا استخدام أي كلمة أو مصطلح غير عربي (إنجليزي أو أي لغة أخرى) في ردك تحت أي ظرف. ترجم جميع المصطلحات إلى العربية بدقة.**
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

    // ⭐ إضافة خطوة تنظيف إضافية للكلمات الإنجليزية الشائعة التي قد تظهر
    if (isArabic) {
        // يمكنك إضافة المزيد من الكلمات الشائعة هنا مع ترجمتها الصحيحة
        const englishToArabicMap = {
            "conditions": "الظروف",
            "condition": "حالة",
            "communication": "التواصل",
            "komunikiraju": "يتواصلون",
            "heard": "سمع",
            "sound": "صوت",
            "webmd": "ويب إم دي",
            "api": "واجهة برمجة التطبيقات",
            "played": "أدى", // تمت الإضافة هنا
            // أضف المزيد حسب الكلمات التي تلاحظ ظهورها
        };

        for (const [en, ar] of Object.entries(englishToArabicMap)) {
            const regex = new RegExp(`\\b${en}\\b`, 'gi');
            reply = reply.replace(regex, ar);
        }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("Error in Groq handler:", error);
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