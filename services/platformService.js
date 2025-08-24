import axios from "axios";

const PLATFORM_URL = process.env.PLATFORM_URL;

/**
 * Send outbound call results to the platform in the expected webhook format
 */
async function sendCallResults({ id, status, conversation }) {
  try {
    const payload = { id, status };

    // Include conversation only if it's provided and non-empty
    if (conversation && conversation.length > 0) {
      payload.conversation = conversation.map(msg => ({
        from: msg.from, // "AI" or "Patient"
        text: msg.text,
        timestamp: new Date(msg.timestamp).toISOString() // ensure ISO 8601
      }));
    }

    const res = await axios.post(`${PLATFORM_URL}/api/outbound-calls/webhook`, payload);

    return res.data;
  } catch (err) {
    console.error("Error sending results to platform:", err.response?.data || err.message);
    throw new Error("Failed to send results to platform");
  }
}

export default { sendCallResults };
