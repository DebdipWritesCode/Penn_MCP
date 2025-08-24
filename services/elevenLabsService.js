import axios from "axios";
import sendCallResults from "./platformService.js";

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const BASE_URL = "https://api.elevenlabs.io/v1";

export async function scheduleCall({
  clinic_id,
  user_id,
  agent_id,
  agent_phone_number_id,
  phone_number,
  scheduled_time_unix,
}) {
  try {
    const res = await axios.post(
      `${BASE_URL}/convai/batch-calling/submit`,
      {
        call_name: `clinic-${clinic_id}-user-${user_id}-${Date.now()}`,
        agent_id,
        agent_phone_number_id,
        scheduled_time_unix,
        recipients: [{ phone_number }],
        metadata: { clinic_id, user_id }, // keep track of clinic/user in metadata
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_API_KEY,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error scheduling call:", err.response?.data || err.message);
    throw new Error("Failed to schedule call");
  }
}

export async function getCallStatus(batchId, platformCallId) {
  try {
    // 1️⃣ Get batch call
    const batchRes = await axios.get(
      `${BASE_URL}/convai/batch-calling/${batchId}`,
      {
        headers: { "xi-api-key": ELEVEN_API_KEY },
      }
    );

    const batchData = batchRes.data;
    const batchStatus = batchData.status;

    if (!batchData.recipients || batchData.recipients.length === 0) {
      throw new Error("No recipients found in batch call");
    }

    // 2️⃣ Get the first recipient
    const recipient = batchData.recipients[0];
    const conversationId = recipient.conversation_id;

    // 3️⃣ Fetch conversation
    let conversation = [];
    let callDuration = 0;

    if (conversationId) {
      const convRes = await axios.get(
        `${BASE_URL}/convai/conversations/${conversationId}`,
        {
          headers: { "xi-api-key": ELEVEN_API_KEY },
        }
      );

      const convData = convRes.data;
      callDuration = convData.metadata?.call_duration_secs || 0;

      // Map ElevenLabs transcript to platform format
      conversation = (convData.transcript || []).map((msg) => ({
        from: msg.role === "user" ? "Patient" : "AI",
        text: msg.message,
        // Convert start time + offset to ISO string
        timestamp: new Date(
          (convData.metadata.start_time_unix_secs +
            (msg.time_in_call_secs || 0)) *
            1000
        ).toISOString(),
      }));
    }

    // 4️⃣ Map ElevenLabs status to platform status if needed
    // Here we just use the recipient status for simplicity
    let platformStatus;
    switch (recipient.status) {
      case "completed":
        platformStatus = "Completed";
        break;
      case "failed":
        platformStatus = "Failed";
        break;
      case "no_response":
        platformStatus = "NoResponse";
        break;
      case "cancelled":
        platformStatus = "Cancelled";
        break;
      case "rescheduled":
        platformStatus = "Rescheduled";
        break;
      default:
        platformStatus = "Upcoming";
    }

    // 5️⃣ Send to platform
    const platformResponse = await sendCallResults.sendCallResults({
      id: platformCallId, // ID in your platform
      status: platformStatus,
      conversation,
    });

    return platformResponse;
  } catch (err) {
    console.error(
      "Error in getCallStatusWithConversation:",
      err.response?.data || err.message
    );
    throw new Error("Failed to fetch and send call status");
  }
}
