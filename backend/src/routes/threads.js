import express from "express";
import Thread from "../models/Thread.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/threads — get all threads for logged-in user
router.get("/", async (req, res, next) => {
  try {
    const threads = await Thread.find({ userId: req.user._id })
      .select("-messages") // Don't send messages in list — saves bandwidth
      .sort({ updatedAt: -1 });

    res.status(200).json({ threads });
  } catch (err) {
    next(err);
  }
});

// GET /api/threads/:id — get single thread with all messages
router.get("/:id", async (req, res, next) => {
  try {
    const thread = await Thread.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ thread });
  } catch (err) {
    next(err);
  }
});

// POST /api/threads — create new thread
router.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;

    const thread = await Thread.create({
      userId: req.user._id,
      title: title || "New Chat",
      messages: [],
    });

    res.status(201).json({ thread });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/threads/:id — update thread title
router.patch("/:id", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const thread = await Thread.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ thread });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/threads/:id — delete a thread
router.delete("/:id", async (req, res, next) => {
  try {
    const thread = await Thread.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ message: "Thread deleted" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/threads — delete all threads for user
router.delete("/", async (req, res, next) => {
  try {
    await Thread.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: "All threads deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
