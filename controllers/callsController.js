import { scheduleCall, getCallStatus } from "../services/elevenLabsService.js"
import platformService from "../services/platformService.js";

// Schedule a call
export async function scheduleCallController(req, res) {
  try {
    const { clinic_id, user_id, agent_id, phone_number, scheduled_time } = req.body;

    // Call ElevenLabs API
    const response = await scheduleCall({
      clinic_id,
      user_id,
      agent_id,
      phone_number,
      scheduled_time
    });

    res.json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Webhook from ElevenLabs (transcript & status after call ends)
export async function callWebhook(req, res) {
  try {
    const { call_id, status, transcript, clinic_id, user_id } = req.body;

    // Forward to your platform
    await platformService.sendCallResults({
      call_id,
      status,
      transcript,
      clinic_id,
      user_id
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// Get call status
export async function getCallStatusController(req, res) {
  try {
    const callId = req.params.callId;
    const status = await getCallStatus(callId);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
