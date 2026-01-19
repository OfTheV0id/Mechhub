import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5abdc916/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign Up Route
app.post("/make-server-5abdc916/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
        return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name || 'Student' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
        console.error("Signup error:", error);
        return c.json({ error: error.message }, 400);
    }

    return c.json({ data });
  } catch (err) {
      console.error("Unexpected error:", err);
      return c.json({ error: "Internal Server Error" }, 500);
  }
});

// --- Chat Persistence Routes ---

// Middleware-like helper to get user ID from token
const getUser = async (c: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
};

// GET /chats - List all chats for the user
app.get("/make-server-5abdc916/chats", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const chats = await kv.getByPrefix(`chat:${user.id}`);
    // Sort by updatedAt desc
    chats.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return c.json({ chats });
  } catch (error) {
    console.error("Get chats error:", error);
    return c.json({ error: "Failed to fetch chats" }, 500);
  }
});

// POST /chats - Create or Update a chat
app.post("/make-server-5abdc916/chats", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  try {
    const { id, title, messages } = await c.req.json();
    const chatId = id || crypto.randomUUID();
    
    // Construct the chat object
    // We store the ID inside the value so we can retrieve it later
    const chatData = {
      id: chatId,
      userId: user.id,
      title: title || "新对话",
      messages: messages || [],
      updatedAt: Date.now()
    };

    await kv.set(`chat:${user.id}:${chatId}`, chatData);
    
    return c.json(chatData);
  } catch (error) {
    console.error("Save chat error:", error);
    return c.json({ error: "Failed to save chat" }, 500);
  }
});

// DELETE /chats/:id - Delete a chat
app.delete("/make-server-5abdc916/chats/:id", async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  const chatId = c.req.param('id');
  
  try {
    await kv.del(`chat:${user.id}:${chatId}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return c.json({ error: "Failed to delete chat" }, 500);
  }
});

Deno.serve(app.fetch);
