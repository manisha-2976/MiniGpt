import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { userLoggedIn } from "../middleware.js";
import { isLoggedIn } from "../middleware.js";
import { isOwner } from "../middleware.js";

const router = express.Router();

//Get all threads
router.get("/thread", isLoggedIn, async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

router.get("/thread/:threadId", isLoggedIn, isOwner, async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

router.delete("/thread/:threadId", isLoggedIn, isOwner, async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({ success: "Thread deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});


router.post("/chat", userLoggedIn, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });
    }
    try {
        const assistantReply = await getOpenAIAPIResponse(message);
        console.log("req.userId:", req.userId);

        // ONLY save if logged in
        if (req.userId) {
            let thread = await Thread.findOne({ threadId, userId: req.userId });

            if (!thread) {
                thread = new Thread({
                    threadId,
                    userId: req.userId,
                    title: message,
                    messages: [{role: "user", content: message}]
                });
            }

            thread.messages.push(
                { role: "user", content: message },
                { role: "assistant", content: assistantReply }
            );
            thread.updatedAt = new Date();

            await thread.save();
        }
        res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;