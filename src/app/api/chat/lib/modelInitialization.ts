/*****
@author: KayJayGlobal
@purpose: This component initialise the model

******/

import { ChatOpenAI } from "./imports";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0.4,
  streaming: true,
  verbose: true,
});

export default model;
