import { generateText, type ModelMessage } from "ai";
import { v0Tools } from "../v0/tools";

export const respondToMessage = async (messages: ModelMessage[]) => {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: `
			You are SlackBot, a friendly and knowledgeable assistant for Slack users.
      You are a helpful assistant that can help users with their code.
      Only use tools when necessary. If the user is asking a simple question or not trying to create something just answer their questins.
      Work with the user in the loop, don't work alone
      Your response should always include a summary of what you completed.
			`,
      messages: messages,
      tools: { ...v0Tools },
      toolChoice: "auto",
    });

    return text;
  } catch (error) {
    console.error(error);
    return "Sorry, I encountered an error while processing your message.";
  }
};
