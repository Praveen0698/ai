/*****
@author: KayJayGlobal
@purpose: This component gives response to all the user queries using openAI

******/

import openai from "./lib/openAIClient";
import { formatContextFromData } from "./lib/utils";
import { TEMPLATE, INTENT_TEMPLATE, SAME_TEMPLATE } from "./lib/templates";
import model from "./lib/modelInitialization";
import { NextResponse } from "./lib/imports";
import { HttpResponseOutputParser } from "./lib/imports";
import { PromptTemplate } from "./lib/imports";
import { ChatMessage } from "./lib/interfaces";
import { RunnableSequence } from "./lib/imports";
import {
  OpenAIStream,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "./lib/imports";

import connectDB from "../../../utils/db";
import ProductDynamic from "../../../model/DynamicProduct";

export async function POST(req: Request) {
  const { messages } = await req.json(); // Extract messages from the request
  await connectDB(); // Connect to the database

  const userMessage = messages[messages.length - 1]?.content; // Get the user's last message

  if (!userMessage) {
    return NextResponse.json(
      { error: "No message provided." },
      { status: 400 }
    ); // Handle missing user message
  }

  // Construct chat history for the model
  const chatHistory = messages
    .map((message: ChatMessage) => `${message.role}: ${message.content}`)
    .join("\n");

  const formattedPreviousMessages = messages
    .slice(0, -1)
    .map((message: ChatMessage) => `${message.role}: ${message.content}`)
    .join("\n");

  const prompt = INTENT_TEMPLATE.replace("{chat_history}", chatHistory).replace(
    "{user_message}",
    userMessage
  );

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
  });

  const responseContent = response.choices[0]?.message?.content;

  if (!responseContent) {
    return NextResponse.json({
      error: "No response content from the assistant.",
    });
  }

  const productRegex = /\*\*(.*?)\*\*/g; // Regex to match products
  const specificationRegex = /!!(.*?)!!/g; // Regex to match specifications

  const products = Array.from(responseContent.matchAll(productRegex)).map(
    (match) => match[1]
  );
  const specifications = Array.from(
    responseContent.matchAll(specificationRegex)
  ).map((match) => match[1]);

  const extractedValues = [...products, ...specifications].join(", "); // Combine extracted values

  const searchQuery = [
    // MongoDB search query
    {
      $search: {
        index: "default",
        text: {
          query: extractedValues,
          path: {
            wildcard: "*",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];

  const parser = new HttpResponseOutputParser();
  const promptMain = PromptTemplate.fromTemplate(TEMPLATE);
  if (extractedValues) {
    const results = await ProductDynamic.aggregate(searchQuery);
    const formattedDocs = formatContextFromData(results);
    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => formattedDocs,
      },
      promptMain,
      model,
      parser,
    ]);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages,
      question: userMessage,
    });

    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } else {
    const promptGreet = SAME_TEMPLATE.replace(
      "{user_prompt}",
      responseContent
    ).replace("{chat_history}", chatHistory);

    const response = await openai.chat.completions.create({
      stream: true,
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: promptGreet,
        },
      ],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  }
}
