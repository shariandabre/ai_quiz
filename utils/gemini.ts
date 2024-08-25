import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyAGV-Pt13A_MgV5YbrUY-OcRmOisr5KFsg';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateQuiz = async (content) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Create a multiple choice quiz based on the following content. Format the quiz as a JSON object with a title, and an array of questions and options . Each question should have a 'question' field 'options'field and an 'answer' field. Do not include any markdown formatting or code blocks in your response. create atleast 10 questions. The provided content will be in markdown format so dont include the markdown in the json. Here's the content:\n\n${content}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?/, '').replace(/\n?```/, '');

    console.log("Cleaned text:", text);  // Log the cleaned text for debugging

    const parsedQuiz = JSON.parse(text);

    if (typeof parsedQuiz.title === 'string' && Array.isArray(parsedQuiz.questions)) {
      return parsedQuiz;
    } else {
      console.error('Invalid quiz structure');
      return null;
    }
  } catch (error) {
    console.error('Error generating or parsing quiz:', error);
    return null;
  }
};
