const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

exports.summarizeText = async (req, res) => {
  try {
    const { text, prompt } = req.body;

    if (!text || !prompt) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide both text and prompt.",
      });
    }

    const fullPrompt = `${prompt}\n\nText to summarize:\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const summary =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Summary not available.";

    return res.json({
      summary,
      original_length: text.length,
      summary_length: summary.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error in summarization: ${error.message}` });
  }
};

exports.compareTexts = async (req, res) => {
  try {
    const { reference_text, comparison_text } = req.body;

    if (!reference_text || !comparison_text) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide both reference_text and comparison_text.",
      });
    }

    const comparisonPrompt = `
Task: Compare the following two texts and provide:
1. A similarity score between 0 and 100
2. A detailed analysis of the comparison
3. Specific reasons for the score

Reference Text:
${reference_text}

Text to Compare:
${comparison_text}

Please format your response as follows:
Score: [number]
Analysis: [detailed paragraph-style analysis]
Reasons: [bullet points of specific reasons]
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: comparisonPrompt }] }],
    });

    const comparisonResult =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Summary not available.";

    let score = null;
    let analysis = "";
    let reasons = [];
    let currentSection = null;

    const lines = comparisonResult.split("\n");
    for (const line of lines) {
      if (line.startsWith("Score:")) {
        score = parseFloat(line.replace("Score:", "").trim());
      } else if (line.startsWith("Analysis:")) {
        currentSection = "analysis";
      } else if (line.startsWith("Reasons:")) {
        currentSection = "reasons";
      } else if (line.trim() && currentSection) {
        if (currentSection === "analysis") {
          analysis += line + "\n";
        } else if (currentSection === "reasons") {
          reasons.push(line.trim());
        }
      }
    }

    return res.json({
      similarity_score: score,
      analysis: analysis.trim(),
      reasons,
      reference_length: reference_text.length,
      comparison_length: comparison_text.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error in comparison: ${error.message}` });
  }
};
