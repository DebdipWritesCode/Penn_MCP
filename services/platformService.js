import axios from "axios";

const PLATFORM_URL = process.env.PLATFORM_URL;

async function sendCallResults({ call_id, status, transcript, clinic_id, user_id }) {
  try {
    const res = await axios.post(`${PLATFORM_URL}/api/calls/results`, {
      call_id,
      status,
      transcript,
      clinic_id,
      user_id
    });

    return res.data;
  } catch (err) {
    console.error("Error sending results to platform:", err.response?.data || err.message);
    throw new Error("Failed to send results to platform");
  }
}

export default { sendCallResults };
