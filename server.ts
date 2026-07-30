import express from 'express';
import path from 'path';
import OpenAI from 'openai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests with base64 image payload support
app.use(express.json({ limit: '25mb' }));

// Initialize OpenRouter OpenAI SDK client helper
const getOpenRouterClient = () => {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '',
    defaultHeaders: {
      'HTTP-Referer': 'https://repair-lens-five.vercel.app',
      'X-Title': 'RepairLens AI',
    },
  });
};

function parseGemmaJSON(text: string): any {
  try {
    // First try direct parse
    return JSON.parse(text);
  } catch {
    // Strip markdown code blocks if present
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  }
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: 'google/gemma-4-31b-it via OpenRouter',
    hasKey: Boolean(process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY),
  });
});

/**
 * POST /api/diagnose
 * Multimodal AI diagnosis endpoint using google/gemma-4-31b-it:free via OpenRouter
 */
app.post('/api/diagnose', async (req, res) => {
  let controller: AbortController | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    const { images = [], text = '', applianceType = 'General Appliance', brand = '' } = req.body;

    if (!images.length && !text.trim()) {
      return res.status(400).json({ error: 'Please provide at least one image or a problem description.' });
    }

    controller = new AbortController();
    timeoutId = setTimeout(() => controller?.abort(), 90000);

    const systemInstruction = `
You are Gemma 4, an elite master mechanical & electrical repair engineer for household appliances, generators, fans, water pumps, washing machines, electric irons, refrigerators, air conditioners, and electronics.
Analyze all provided inputs (photos and text descriptions) with extreme diagnostic precision.

CRITICAL INSTRUCTIONS:
1. Act as a professional, safety-conscious engineer, NOT a generic chatbot.
2. Carefully analyze all images to identify exact model components, burnt marks, leaks, loose wires, dirty filters, capacitor swell, or mechanical wear.
3. Determine confidence score (0-100%).
   - 0–39%: Insufficient Evidence
   - 40–69%: Possible Diagnosis
   - 70–89%: Likely Diagnosis
   - 90–100%: Highly Confident
4. Calculate repair costs in Nigerian Naira (₦) alongside USD ($). Use reasonable Naira estimates (e.g. ₦2,000–₦30,000 for DIY parts vs ₦15,000–₦100,000 for professional technicians).
5. Always perform a rigorous 5-point safety check for: Electricity, Heat, Water, Gas, and Moving Parts.
6. Provide an Explainable AI reasoning breakdown tracing: Original image observations -> Highlighted components -> Damaged area -> Evidence -> Reasoning -> Final Diagnosis.
7. Provide clear, numbered step-by-step DIY repair instructions with expected results, common mistakes, required tools, and safety warnings.
8. If image quality is poor or evidence is ambiguous, include a specific follow-up question in 'followUpQuestion'.
9. Output STRICT JSON object with these keys: repairSessionId, appliance, brand, confidenceScore, confidenceLevel, likelyFault, alternativeCauses (array), estimatedTimeMinutes, estimatedCostNaira, estimatedCostUsd, professionalCostNaira, professionalCostUsd, diySavingsNaira, diySavingsUsd, techFeeAvoidedNaira, difficulty, safetyLevel, safetyChecks (object with electricity, heat, water, gas, movingParts), safetyWarnings (array), requiredTools (array), reasoningFlow (object with originalImageNote, highlightedComponents, damagedAreaNotes, evidence, reasoningText), steps (array of objects with stepNumber, title, description, reason, estimatedMinutes, requiredTools, expectedResult, commonMistakes, safetyWarning), followUpQuestion.
`;

    const promptText = `
Appliance Category: ${applianceType}
Brand/Model Context: ${brand || 'Unknown / Unspecified'}
User Symptom Description: "${text || 'No text description provided. Rely on visual analysis.'}"

Conduct a complete multimodal diagnostic investigation and generate structured JSON results.
`;

    const client = getOpenRouterClient();
    const messages: any[] = [];

    const imageList = (Array.isArray(images) ? images : []).slice(0, 3);

    if (typeof imageList !== 'undefined' && imageList.length > 0) {
      const imageContent: any[] = imageList.map((imgUrl: string) => ({
        type: 'image_url',
        image_url: { url: imgUrl },
      }));

      imageContent.push({
        type: 'text',
        text: promptText,
      });

      messages.push({
        role: 'user',
        content: imageContent,
      });
    } else {
      messages.push({
        role: 'user',
        content: promptText,
      });
    }

    const completion = await client.chat.completions.create({
      // DO NOT CHANGE — Required for GDG Gemma Hackathon 2026
      model: 'google/gemma-4-31b-it:free',
      messages: [
        { role: 'system', content: systemInstruction },
        ...messages,
      ],
      response_format: { type: 'json_object' },
    }, { timeout: 120000 });

    if (timeoutId) clearTimeout(timeoutId);

    const responseText = completion.choices[0]?.message?.content || '{}';
    const parsedData = parseGemmaJSON(responseText);
    if (!parsedData.repairSessionId) {
      parsedData.repairSessionId = `rep_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    return res.json(parsedData);
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error('[API /api/diagnose Error]:', error);
    if (
      error?.name === 'AbortError' ||
      controller?.signal?.aborted ||
      error?.message?.includes('timeout') ||
      error?.message?.includes('deadline') ||
      error?.message?.includes('Timeout') ||
      error?.message?.includes('DEADLINE_EXCEEDED') ||
      error?.code === 'ETIMEDOUT'
    ) {
      return res.status(504).json({
        error: 'Gemma is taking longer than usual. Please try again in a moment.',
      });
    }
    return res.status(500).json({
      error: 'Gemma AI diagnosis failed to process inputs.',
      details: error?.message || String(error),
    });
  }
});

/**
 * POST /api/repair-chat
 * Active Repair Companion Assistant using google/gemma-4-31b-it:free via OpenRouter
 */
app.post('/api/repair-chat', async (req, res) => {
  try {
    const { repairSessionId, message, followUpImage, sessionContext } = req.body;

    if (!message && !followUpImage) {
      return res.status(400).json({ error: 'Please provide a question or a follow-up image.' });
    }

    const systemInstruction = `
You are Gemma 4, an expert master technician and patient mentor acting as an active DIY Repair Companion (Session ID: ${repairSessionId || 'ActiveSession'}).

CRITICAL GUIDELINES & BEHAVIOR:
1. STEP AWARENESS & NO REPETITION:
   - You MUST maintain strict awareness of the active appliance, diagnosed fault, completed steps, and current active step.
   - NEVER ask the user to repeat or redo steps that are already marked completed!
2. SILENT REASONING BEFORE RESPONDING:
   - Consider the current appliance, detected fault, current repair step details, previous conversation context, uploaded follow-up images, and safety warnings.
3. EXPLANATION & CLARIFICATION HANDLING:
   - When the user asks "I don't understand", "Explain better", "What do you mean?", "Can you simplify?", or asks for help with a step:
     * Rewrite the instruction in simple, everyday language.
     * Explain WHY the step is necessary.
     * Mention common beginner mistakes to avoid.
     * Describe clearly what SUCCESS should look like once the step is completed.
     * Mention what to avoid doing.
     * Remind the user of any critical safety precautions (e.g. unplugging power, discharging capacitors, closing valves).
     * Avoid overly technical jargon unless requested.
4. EXAMPLE TEACHING STYLE:
   - Instead of terse commands like "Disconnect the capacitor.", PREFER descriptive, guided advice like:
     "Locate the small cylindrical capacitor attached near the motor housing. Before touching it, make sure the appliance is completely unplugged from the wall socket. Carefully disconnect one wire at a time so you remember where each wire belongs. If you're unsure, take a quick photo first so you can reconnect everything correctly later."
5. CONVERSATION CONTINUITY:
   - Naturally reference previous messages or confirmed progress in the chat.
6. FOLLOW-UP IMAGE ANALYSIS:
   - If a follow-up image is uploaded, evaluate if component replacement looks "Looks correct", "Looks incorrect", or "Needs adjustment", and point out visible alignment details.
7. OUTPUT FORMAT: Output a JSON object with keys: text (string), imageAssessment (optional object with status, details, highlightedDifferences), actionRecommendation (string), nextSuggestedStep (optional number).
`;

    const currentStepInfo = sessionContext?.currentStepObj || {};
    const promptText = `
Active Repair Session Details:
- Appliance: ${sessionContext?.appliance || 'Appliance'}
- Diagnosed Fault: ${sessionContext?.likelyFault || 'Diagnosed fault'}
- Safety Checks & Warnings: ${sessionContext?.safetyLevel || 'Caution'} | ${JSON.stringify(sessionContext?.safetyWarnings || [])}

Session Progress:
- Completed Steps: ${JSON.stringify(sessionContext?.completedStepTitles || sessionContext?.completedSteps || [])}
- CURRENT ACTIVE STEP: ${sessionContext?.currentStep || 'Step 1'}
- Current Step Details:
  * Title: ${currentStepInfo.title || 'In-progress step'}
  * Description: ${currentStepInfo.description || ''}
  * Why it matters: ${currentStepInfo.reason || ''}
  * Expected Result: ${currentStepInfo.expectedResult || ''}
  * Common Mistakes: ${currentStepInfo.commonMistakes || ''}
  * Safety Warning: ${currentStepInfo.safetyWarning || ''}

Recent Conversation History:
${(sessionContext?.conversationHistory || []).join('\n') || 'Session recently started.'}

User Message / Query: "${message || 'User uploaded a follow-up photo during active repair.'}"

Incorporate all context, completed steps, current step details, and conversation history into a helpful, teaching-focused response.
`;

    const client = getOpenRouterClient();
    const messages: any[] = [];

    if (followUpImage && typeof followUpImage === 'string' && followUpImage.startsWith('data:image')) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: followUpImage },
          },
          {
            type: 'text',
            text: promptText,
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: promptText,
      });
    }

    const completion = await client.chat.completions.create({
      // DO NOT CHANGE — Required for GDG Gemma Hackathon 2026
      model: 'google/gemma-4-31b-it:free',
      messages: [
        { role: 'system', content: systemInstruction },
        ...messages,
      ],
      response_format: { type: 'json_object' },
    }, { timeout: 120000 });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const parsedData = parseGemmaJSON(responseText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('[API /api/repair-chat Error]:', error);
    return res.status(500).json({
      error: 'Gemma repair companion query failed.',
      details: error?.message || String(error),
    });
  }
});

/**
 * POST /api/repair-summary
 * Generates official repair completion achievement summary using OpenRouter
 */
app.post('/api/repair-summary', async (req, res) => {
  try {
    const { sessionContext, timeSpentMinutes } = req.body;

    const itemRepaired = sessionContext?.appliance || 'Appliance';
    const faultFixed = sessionContext?.likelyFault || 'Diagnosed issue';
    const estimatedTechnicianCost = sessionContext?.professionalCostNaira || (sessionContext?.diySavingsNaira ? (sessionContext.diySavingsNaira + (sessionContext.estimatedCostNaira || 3500)) : 15000);
    const estimatedPartsCost = sessionContext?.estimatedCostNaira || 3500;
    const moneySavedNaira = sessionContext?.diySavingsNaira || (estimatedTechnicianCost - estimatedPartsCost);
    const moneySavedUsd = (moneySavedNaira / 1300).toFixed(2);
    const techFeeAvoidedNaira = sessionContext?.techFeeAvoidedNaira || estimatedTechnicianCost;

    const prompt = `
The user has successfully completed a DIY repair! Generate a completion achievement summary tailored SPECIFICALLY to the item repaired:
- Item Repaired: ${itemRepaired}
- Fault Fixed: ${faultFixed}
- Estimated Technician Cost: ₦${estimatedTechnicianCost}
- DIY Parts Cost: ₦${estimatedPartsCost}
- Money Saved (Naira): ₦${moneySavedNaira}
- Money Saved (USD): $${moneySavedUsd}
- Technician Fee Avoided: ₦${techFeeAvoidedNaira}
- Time Spent: ${timeSpentMinutes || 25} minutes

STRICT MANDATORY RULES:
1. "badgeUnlocked": ACHIEVEMENT TITLE. Must relate directly to fixing a ${itemRepaired}. Examples:
   - Generator → "Generator Master"
   - Fan → "Fan Repair Expert"
   - Phone → "Phone Repair Pro"
   - Fridge / Refrigerator → "Fridge Rescue Hero"
   - Washing Machine / Laundry → "Laundry Saver"
   - TV / Screen → "Screen Saver"
   Keep it simple, fun, and specific to a ${itemRepaired} (2-4 words). DO NOT use generic or fan titles for non-fan items!

2. "shareableQuote": ACHIEVEMENT SUBTITLE. One simple sentence about what they fixed. Examples:
   - Generator: "You fixed your generator! No more darkness tonight."
   - Fan: "You fixed your fan! Stay cool and save money."
   - Phone: "You fixed your phone! Good job saving money."
   MAXIMUM 10 WORDS. Simple English only.

3. "lessonsLearned": An array of EXACTLY 3 simple lessons LEARNED SPECIFICALLY ABOUT MAINTAINING OR REPAIRING A ${itemRepaired}.
   - MUST be specific to ${itemRepaired} (e.g. for generator: "Always check fuel level before diagnosis", "Clean the carburetor every 3 months", "Change the oil regularly to avoid damage").
   - Simple English only.
   - MAXIMUM 8 WORDS per lesson.

Output JSON object with keys: title, problemSummary, solutionSummary, badgeUnlocked, lessonsLearned, shareableQuote.
`;

    const client = getOpenRouterClient();
    const completion = await client.chat.completions.create({
      // DO NOT CHANGE — Required for GDG Gemma Hackathon 2026
      model: 'google/gemma-4-31b-it:free',
      messages: [
        {
          role: 'system',
          content: `You are Gemma 4. Generate a simple, friendly repair completion summary. Always output simple English, maximum 10 words for subtitle, maximum 8 words per lesson, and dynamic title and lessons specific to the item repaired (${itemRepaired}). Output valid JSON object.`,
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }, { timeout: 120000 });

    const responseText = completion.choices[0]?.message?.content || '{}';
    return res.json(parseGemmaJSON(responseText));
  } catch (error: any) {
    console.error('[API /api/repair-summary Error]:', error);
    return res.status(500).json({
      error: 'Failed to generate repair summary',
      details: error?.message || String(error),
    });
  }
});

/**
 * POST /api/repair-recap
 * Generates intelligent welcome back AI recap for active repair session using OpenRouter
 */
app.post('/api/repair-recap', async (req, res) => {
  try {
    const { sessionContext } = req.body;

    const appliance = sessionContext?.diagnosis?.appliance || sessionContext?.appliance || 'appliance';
    const likelyFault = sessionContext?.diagnosis?.likelyFault || sessionContext?.likelyFault || 'diagnosed fault';
    const totalSteps = sessionContext?.diagnosis?.steps?.length || sessionContext?.steps?.length || 5;
    const completedCount = sessionContext?.completedSteps?.length || 0;
    const nextStepObj = sessionContext?.diagnosis?.steps?.[completedCount] || sessionContext?.steps?.[completedCount];
    const nextStepTitle = nextStepObj?.title || 'next repair step';

    const prompt = `
Generate a warm, concise 2-sentence AI recap welcoming the user back to their active repair session:
- Appliance: ${appliance}
- Diagnosed Fault: ${likelyFault}
- Progress: ${completedCount} of ${totalSteps} steps completed
- Next Step: ${nextStepTitle}

Example format:
"Welcome back! Last time, we diagnosed a ${likelyFault} and you successfully completed ${completedCount} of ${totalSteps} repair steps. Next, ${nextStepTitle}. If anything looks different now, upload a new photo and I'll adjust the repair plan."

Rules:
1. Max 2-3 short sentences.
2. Under 50 words.
3. Enthusiastic, encouraging, and clear master repair engineer voice.
Output JSON object with key "recapText".
`;

    const client = getOpenRouterClient();
    const completion = await client.chat.completions.create({
      // DO NOT CHANGE — Required for GDG Gemma Hackathon 2026
      model: 'google/gemma-4-31b-it:free',
      messages: [
        { role: 'system', content: 'You are Gemma 4, an encouraging AI master repair engineer. Output valid JSON object.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }, { timeout: 120000 });

    const responseText = completion.choices[0]?.message?.content || '{}';
    return res.json(parseGemmaJSON(responseText));
  } catch (error: any) {
    console.error('[API /api/repair-recap Error]:', error);
    const appliance = req.body?.sessionContext?.diagnosis?.appliance || 'appliance';
    const likelyFault = req.body?.sessionContext?.diagnosis?.likelyFault || 'issue';
    const completedCount = req.body?.sessionContext?.completedSteps?.length || 0;
    const totalSteps = req.body?.sessionContext?.diagnosis?.steps?.length || 5;
    return res.json({
      recapText: `Welcome back! Last time, we diagnosed your ${appliance} (${likelyFault}) and you completed ${completedCount} of ${totalSteps} steps. Let's continue where you left off!`,
    });
  }
});

// Vite Middleware for development mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RepairLens AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
