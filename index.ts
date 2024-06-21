const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyATiZI0p-B18m8qsF3P3PEnRtlcNLiRD_U");

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}
async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = "Summarize this paragraph and my images into 2 sentences: The old, leather backpack had been in the attic for years, a dusty relic from a forgotten adventure. It was Amelia's grandmother's, passed down through generations, its worn leather whispering tales of distant lands. Amelia, a curious girl with a thirst for the unknown, had always felt a strange connection to the backpack."

  const imagePart = [
    fileToGenerativePart("images.jpg", "image/jpeg"),
  ]

  const result = await model.generateContent([prompt, ...imagePart]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();