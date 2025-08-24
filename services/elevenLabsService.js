import fetch from "node-fetch";

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const BASE_URL = "https://api.elevenlabs.io/v1";

async function scheduleCall({ clinic_id, user_id, agent_id, phone_number, scheduled_time }) {
  const res = await fetch(`${BASE_URL}/convai/batch-calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": ELEVEN_API_KEY
    },
    body: JSON.stringify({
      agent_id,
      scheduled_time,
      phone_number,
      metadata: { clinic_id, user_id }
    })
  });

  if (!res.ok) throw new Error(`Failed to schedule call: ${res.statusText}`);
  return res.json();
}

async function getCallStatus(callId) {
  const res = await fetch(`${BASE_URL}/convai/calls/${callId}`, {
    headers: { "xi-api-key": ELEVEN_API_KEY }
  });
  if (!res.ok) throw new Error("Failed to fetch call status");
  return res.json();
}

export default { scheduleCall, getCallStatus };
