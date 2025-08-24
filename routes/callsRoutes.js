import express from "express";
import { scheduleCallController, callWebhook, getCallStatusController, postCallWebhook } from "../controllers/callsController.js";

const router = express.Router();

// // Schedule outbound call
// router.post("/schedule", scheduleCall);

// // ElevenLabs webhook for call transcript/status
// router.post("/webhook", callWebhook);

// // Retrieve call status
// router.get("/:callId/status", getCallStatus);

router.post("/webhook/post-call", postCallWebhook);

export default router;
