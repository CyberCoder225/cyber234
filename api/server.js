// Example for Vercel / Node.js
import fetch from "node-fetch";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

export default async function handler(req, res) {
  try {
    // Increment visitor count
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/INCR/visits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`,
      },
    });

    const count = await response.json(); // Upstash returns number in JSON
    res.status(200).json({ value: count });
  } catch (err) {
    res.status(500).json({ error: "Failed to update visitor count" });
  }
}
