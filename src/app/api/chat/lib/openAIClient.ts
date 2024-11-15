/*****
@author: KayJayGlobal
@purpose: This component enable openAI using api key

******/
import { OpenAI } from "./imports";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
