import { tool } from "ai";
import { v0 } from "v0-sdk";
import { z } from "zod";

const createV0Tool = (
  name: string,
  description: string,
  schema: z.ZodTypeAny,
  fn: (params: unknown) => Promise<unknown>,
) => {
  return tool({
    name,
    description,
    inputSchema: schema,
    execute: async (params) => await fn(params),
  });
};

const hookEventsEnum = z.array(
  z.enum([
    "chat.created",
    "chat.updated",
    "chat.deleted",
    "message.created",
    "message.updated",
    "message.deleted",
    "project.created",
    "project.updated",
    "project.deleted",
  ]),
);

const privacyEnum = z.enum([
  "public",
  "private",
  "team",
  "team-edit",
  "unlisted",
]);

const modelConfigSchema = z.object({
  modelId: z.enum(["v0-1.5-sm", "v0-1.5-md", "v0-1.5-lg"]),
  imageGenerations: z.boolean(),
  thinking: z.boolean(),
});

const v0ApiMethods = [
  {
    name: "initializeChat",
    description: "Initialize a chat with a set of files",
    schema: z.object({
      files: z.array(z.object({ name: z.string(), content: z.string() })),
    }),
    fn: v0.chats.init,
  },
  {
    name: "createChat",
    description:
      "Create a chat with system message and user message. Specify model configuration based on task complexity.",
    schema: z.object({
      system: z.string(),
      message: z.string(),
      modelConfiguration: modelConfigSchema,
    }),
    fn: v0.chats.create,
  },
  {
    name: "findChats",
    description: "Find and list chats with optional pagination and filtering",
    schema: z.object({
      limit: z.string().optional(),
      offset: z.string().optional(),
      isFavorite: z.string().optional(),
    }),
    fn: v0.chats.find,
  },
  {
    name: "deleteChat",
    description: "Delete a specific chat by ID",
    schema: z.object({ chatId: z.string() }),
    fn: v0.chats.delete,
  },
  {
    name: "getChat",
    description: "Get detailed information about a specific chat",
    schema: z.object({ chatId: z.string() }),
    fn: v0.chats.getById,
  },
  {
    name: "updateChat",
    description: "Update chat metadata like name and privacy settings",
    schema: z.object({
      chatId: z.string(),
      name: z.string().optional(),
      privacy: privacyEnum.optional(),
    }),
    fn: v0.chats.update,
  },
  {
    name: "favoriteChat",
    description: "Mark or unmark a chat as favorite",
    schema: z.object({
      chatId: z.string(),
      isFavorite: z.boolean(),
    }),
    fn: v0.chats.favorite,
  },
  {
    name: "forkChat",
    description: "Create a fork of a chat from a specific version",
    schema: z.object({
      chatId: z.string(),
      versionId: z.string(),
    }),
    fn: v0.chats.fork,
  },
  {
    name: "sendMessage",
    description: "Send a message to an existing chat",
    schema: z.object({
      chatId: z.string(),
      message: z.string(),
    }),
    fn: v0.chats.sendMessage,
  },
  {
    name: "resumeMessage",
    description: "Resume processing of a previously interrupted message",
    schema: z.object({
      chatId: z.string(),
      messageId: z.string(),
    }),
    fn: v0.chats.resume,
  },
  {
    name: "getProjectByChatId",
    description: "Get project details by chat ID",
    schema: z.object({ chatId: z.string() }),
    fn: v0.projects.getByChatId,
  },
  {
    name: "findProjects",
    description: "List all projects",
    schema: z.object({}),
    fn: v0.projects.find,
  },
  {
    name: "createProject",
    description: "Create a new project",
    schema: z.object({
      name: z.string(),
      description: z.string().optional(),
    }),
    fn: v0.projects.create,
  },
  {
    name: "getProject",
    description: "Get project details by ID",
    schema: z.object({ projectId: z.string() }),
    fn: v0.projects.getById,
  },
  {
    name: "assignProjectToChat",
    description: "Assign a project to a chat",
    schema: z.object({
      projectId: z.string(),
      chatId: z.string(),
    }),
    fn: v0.projects.assign,
  },
  {
    name: "findDeployments",
    description: "Find deployments for a specific project, chat, and version",
    schema: z.object({
      projectId: z.string(),
      chatId: z.string(),
      versionId: z.string(),
    }),
    fn: v0.deployments.find,
  },
  {
    name: "createDeployment",
    description: "Create a new deployment",
    schema: z.object({
      projectId: z.string(),
      chatId: z.string(),
      versionId: z.string(),
    }),
    fn: v0.deployments.create,
  },
  {
    name: "getDeployment",
    description: "Get deployment details by ID",
    schema: z.object({ deploymentId: z.string() }),
    fn: v0.deployments.getById,
  },
  {
    name: "deleteDeployment",
    description: "Delete a deployment",
    schema: z.object({ deploymentId: z.string() }),
    fn: v0.deployments.delete,
  },
  {
    name: "findDeploymentLogs",
    description: "Get logs for a specific deployment",
    schema: z.object({
      deploymentId: z.string(),
      since: z.string().optional(),
    }),
    fn: v0.deployments.findLogs,
  },
  {
    name: "findDeploymentErrors",
    description: "Get errors for a specific deployment",
    schema: z.object({ deploymentId: z.string() }),
    fn: v0.deployments.findErrors,
  },
  {
    name: "findHooks",
    description: "List all webhooks",
    schema: z.object({}),
    fn: v0.hooks.find,
  },
  {
    name: "createHook",
    description: "Create a new webhook",
    schema: z.object({
      name: z.string(),
      url: z.string(),
      events: hookEventsEnum,
      chatId: z.string().optional(),
      projectId: z.string().optional(),
    }),
    fn: v0.hooks.create,
  },
  {
    name: "getHook",
    description: "Get webhook details by ID",
    schema: z.object({ hookId: z.string() }),
    fn: v0.hooks.getById,
  },
  {
    name: "updateHook",
    description: "Update an existing webhook",
    schema: z.object({
      hookId: z.string(),
      name: z.string().optional(),
      url: z.string().optional(),
      events: hookEventsEnum.optional(),
    }),
    fn: v0.hooks.update,
  },
  {
    name: "deleteHook",
    description: "Delete a webhook",
    schema: z.object({ hookId: z.string() }),
    fn: v0.hooks.delete,
  },
  {
    name: "findRateLimits",
    description: "Get rate limit information",
    schema: z.object({ scope: z.string().optional() }),
    fn: v0.rateLimits.find,
  },
  {
    name: "getUser",
    description: "Get current user information",
    schema: z.object({}),
    fn: v0.user.get,
  },
  {
    name: "getUserBilling",
    description: "Get user billing information",
    schema: z.object({ scope: z.string().optional() }),
    fn: v0.user.getBilling,
  },
  {
    name: "getUserPlan",
    description: "Get user plan information",
    schema: z.object({}),
    fn: v0.user.getPlan,
  },
  {
    name: "getUserScopes",
    description: "Get user scopes",
    schema: z.object({}),
    fn: v0.user.getScopes,
  },
];

export const v0Tools = Object.fromEntries(
  v0ApiMethods.map(({ name, description, schema, fn }) => [
    name,
    createV0Tool(name, description, schema, fn),
  ]),
);
