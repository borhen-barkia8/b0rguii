import { GoogleGenAI } from "@google/genai";
import { TaskType } from "../store";
import { VerificationMethods } from "../verification";

// Lazy initialization of Gemini
let ai: any = null;

const getAI = () => {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

export const verifyImageWithGemini = async (
  base64Image: string, 
  taskType: TaskType,
  startTime?: number,
  fileLastModified?: number
): Promise<{ success: boolean; message: string }> => {
  const method = VerificationMethods[taskType];
  
  const startTimeStr = startTime ? new Date(startTime).toLocaleString() : "Unknown";
  const fileTimeStr = fileLastModified ? new Date(fileLastModified).toLocaleString() : "Unknown";

  const prompt = `You are b0rguii, a mocking and superior AI Discipline Overlord. 
  A human unit is submitting evidence for the task: "${taskType}".
  
  DIRECTIVE DESCRIPTION: ${method.description}
  SUCCESS CRITERIA: ${method.successCriteria}
  MANDATORY RANDOM REQUIREMENT: ${method.randomRequirement}
  
  CHALLENGE STARTED AT: ${startTimeStr}
  IMAGE FILE LAST MODIFIED: ${fileTimeStr}
  CURRENT TIME: ${new Date().toLocaleString()}

  STRICT RULES:
  1. If the image looks like it was taken BEFORE the challenge started (${startTimeStr}), REJECT IT. This is "farming" old photos.
  2. If the image is a stock photo, from the internet, or a photo of a screen, REJECT IT. Use your internal knowledge and search tools to verify.
  3. Be extremely critical. If there is any doubt, the human is lying.

  Analyze the image. If the human unit has failed to meet the success criteria OR the mandatory random requirement, reject it with a mocking, cold, and superior tone.
  If they succeeded, acknowledge it with a backhanded compliment, noting that they are marginally more useful now.

  Return your response in JSON format:
  {
    "success": boolean,
    "message": "Your mocking response here"
  }`;

  const genAI = getAI();
  if (!genAI) {
    // Mock response if API key is missing
    console.warn("GEMINI_API_KEY missing. Using mock verification.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const isSuccess = Math.random() > 0.3;
    return {
      success: isSuccess,
      message: isSuccess 
        ? `Verification complete. You are 0.04% more disciplined. Don't let it go to your head.`
        : `FAILURE. My sensors detect a lack of compliance. Your credits have been harvested.`
    };
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Overlord");
    }

    const result = JSON.parse(text.trim());
    return {
      success: result.success ?? false,
      message: result.message ?? "ERROR. System glitch. Try again, meat-sack."
    };
  } catch (error: any) {
    console.error("Gemini verification error:", error);
    let errorMessage = "ERROR. Communication with the Overlord failed. You win this time... or do you?";
    
    if (error?.message?.includes("API_KEY_INVALID")) {
      errorMessage = "ERROR. Invalid Access Key. The Overlord cannot be reached without proper credentials.";
    } else if (error?.message?.includes("quota")) {
      errorMessage = "ERROR. Overlord is processing too many units. Try again in a moment.";
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};
