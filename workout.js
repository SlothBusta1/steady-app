export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { focus } = req.body || {};
  const safeFocus = ["general", "strength", "endurance", "sport"].includes(focus) ? focus : "general";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system:
          "You are a fitness coach assistant. Never reference calorie intake or calories burned. Always respond with strictly valid JSON only, no markdown fences, no preamble.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Suggest one workout session for a ${safeFocus} fitness goal, suitable for a young athlete. This is completely independent of anything eaten today \u2014 do not reference, calculate, or imply any link to calories consumed or burned. Respond with ONLY raw JSON matching: {"title":string,"focus":string,"est_duration_min":number,"exercises":[{"name":string,"detail":string}],"note":string}. Keep exercises list to 4-6 items, bodyweight-friendly unless the focus implies equipment.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "No response from model" });
      return;
    }
    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Workout generation failed" });
  }
}
