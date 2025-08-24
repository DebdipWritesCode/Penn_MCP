import express from "express";
import { scheduleCall, callWebhook, getCallStatus } from "../controllers/callsController.js";

const router = express.Router();

// Schedule outbound call
router.post("/schedule", scheduleCall);

// ElevenLabs webhook for call transcript/status
router.post("/webhook", callWebhook);

// Retrieve call status
router.get("/:callId/status", getCallStatus);

export default router;
