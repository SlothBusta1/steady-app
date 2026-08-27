export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { imageBase64, mediaType } = req.body || {};
  if (!imageBase64) {
    res.status(400).json({ error: "Missing image" });
    return;
  }

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
          "You are a nutrition estimation assistant embedded in a food logging app. Always respond with strictly valid JSON only, no markdown fences, no preamble.",
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } },
              {
                type: "text",
                text: 'Identify the food in this photo and estimate its nutrition. Respond with ONLY raw JSON matching this shape exactly: {"items":[{"name":string,"calories":number}],"total_calories":number,"total_protein_g":number,"produce_servings":number}. produce_servings is your best estimate of fruit/vegetable servings visible (0 if none). Be a reasonable estimator even with imperfect information.',
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
    res.status(500).json({ error: "Analysis failed" });
  }
}
