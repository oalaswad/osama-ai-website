// netlify/functions/groq-handler.js

exports.handler = async function (event) {
  console.log("Groq function started.");

  let message = "";

  try {
    const body = JSON.parse(event.body);
    message = body.message || "";
    console.log("Received message:", message);
  } catch (err) {
    console.error("Error parsing request body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body." })
    };
  }

  if (!message.trim()) {
    console.warn("Empty or missing message received.");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Message is empty or missing." })
    };
  }

  try {
    // ✅ استخدام fetch المدمج (Node.js 18+ و Netlify تدعمه)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ تأكد أن متغير البيئة في Netlify يبدأ بـ Bearer
        "Authorization": process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a kind and wise psychological assistant, responding in a human-like and deep manner, and you understand Arabic."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    console.log("Groq API response status:", response.status);

    const data = await response.json();
    console.log("Groq API raw data:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("Groq API error response:", data.error);
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "🤖 I couldn't generate a response right now. Try a different phrasing.";

    console.log("Generated reply:", reply);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (fetchError) {
    console.error("Error calling Groq API:", fetchError);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while connecting to the AI assistant." })
    };
  }
};
