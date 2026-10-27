import express from "express";
import Thread from "../models/Thread.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// POST /api/chat — send message, get AI response, save to DB
router.post("/", async (req, res, next) => {
  try {
    const { threadId, messages } = req.body;

    if (!threadId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "threadId and messages are required" });
    }

    // Verify thread belongs to user
    const thread = await Thread.findOne({
      _id: threadId,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    // Format messages for Groq
    const formattedMessages = messages
      .filter((m) => m.role === "user" || m.role === "model")
      .map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.text,
      }));

    // Call Groq API — key stays server-side
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          max_tokens: 1024,
          messages: formattedMessages,
        }),
      }
    );

    if (!groqResponse.ok) {
      const error = await groqResponse.json().catch(() => ({}));
      return res.status(groqResponse.status).json({
        error: error?.error?.message || "Groq API error",
      });
    }

    const groqData = await groqResponse.json();
    const responseText = groqData?.choices?.[0]?.message?.content || "";

    if (!responseText) {
      return res.status(500).json({ error: "Empty response from Groq" });
    }

    // Save all messages to DB
    const lastUserMessage = messages[messages.length - 1];
    const aiMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role: "model",
      text: responseText,
    };

    // Update thread: add user message + AI response + update title if first message
    const isFirstMessage = thread.messages.length === 0;
    const updateData = {
      $push: {
        messages: {
          $each: [lastUserMessage, aiMessage],
        },
      },
    };

    if (isFirstMessage && lastUserMessage) {
      const words = lastUserMessage.text.trim().split(/\s+/).slice(0, 5);
      updateData.title =
        words.join(" ") +
        (lastUserMessage.text.trim().split(/\s+/).length > 5 ? "…" : "");
    }

    await Thread.findByIdAndUpdate(threadId, updateData);

    res.status(200).json({
      message: aiMessage,
      ...(isFirstMessage && {
        title: updateData.title,
      }),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
