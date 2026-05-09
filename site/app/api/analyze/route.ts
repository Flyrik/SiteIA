export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const hint = formData.get("hint") as string | null;

    if (!imageFile) {
      return Response.json({ error: "Aucune image fournie" }, { status: 400 });
    }

    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = imageFile.type;

    const context = hint === "medicament"
      ? "L'utilisateur pense que c'est un médicament (boîte, blister, comprimé, flacon)."
      : hint === "plante"
      ? "L'utilisateur pense que c'est une plante (espèce végétale, feuille, fleur)."
      : "";

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
              {
                type: "text",
                text: `Analyse cette image. ${context}

Réponds UNIQUEMENT avec un JSON valide dans ce format exact, sans texte avant ou après :
{
  "type": "medicament" ou "plante",
  "nom": "nom exact du médicament ou de la plante",
  "description": "description courte de 1-2 phrases en français, simple et claire",
  "confiance": nombre entre 0 et 1
}

Si tu n'es pas certain, réponds avec le type le plus probable et une confiance basse.`,
              },
            ],
          },
        ],
      }),
    });

    const json = await res.json();
    const text: string = json.choices?.[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: `Réponse IA invalide: ${text.slice(0, 300)}` }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return Response.json(data);
  } catch (error) {
    console.error("Analyze error:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json({ error: message }, { status: 500 });
  }
}
