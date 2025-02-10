const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

   export const GenerateTopicsAiModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Learn pyhton ::As you are coaching teacher \n    - User want to learn about the topic \n    -Generate 7-10 Course title for study (short)\n    - make sure it is releated to description\n    - output will be array of string in json format only \n    - Do not add any plain text in output"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"course_titles\": [\n    \"Python Basics: Variables & Data Types\",\n    \"Control Flow: Logic & Loops in Python\",\n    \"Functions: Building Reusable Code Blocks\",\n    \"Data Structures: Lists, Dictionaries & More\",\n    \"Object-Oriented Programming (OOP) with Python\",\n    \"File Handling: Reading & Writing Data\",\n    \"Modules & Packages: Extending Python\",\n    \"Error Handling: Debugging Your Code\",\n    \"Introduction to Python Libraries: NumPy & Pandas\",\n    \"Basic Python project: Automate routine task\"\n  ]\n}\n```"},
          ],
        },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
