export async function POST(req) {
  const body = await req.json();
  const messages = body.messages;

  console.log("📨 Incoming messages:", messages);

  try {
    console.log("🚀 Sending request to OpenRouter...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages,
          max_tokens: 512,
          temperature: 0.7,
        }),
      }
    );

    console.log("📡 Response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed response from OpenRouter:", data);
      return new Response(
        JSON.stringify({ error: data.error?.message || "Unknown error" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      return new Response(
        JSON.stringify({ error: "No reply from AI model." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("✅ AI Reply:", aiReply);

    // ✅ PERBAIKAN: Return langsung text content, bukan JSON object
    return new Response(aiReply, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("❌ Error during fetch:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
