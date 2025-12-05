// api/stats.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    // Track visit if POST request
    if (req.method === 'POST') {
      // Increment total visits
      await redis.incr('totalViews');
      // Increment today's visits (with date key)
      const todayKey = `visits:${new Date().toISOString().slice(0, 10)}`;
      await redis.incr(todayKey);

      return res.status(200).json({ success: true });
    }

    // GET request → return stats
    if (req.method === 'GET') {
      const totalViews = await redis.get('totalViews') || 0;

      const todayKey = `visits:${new Date().toISOString().slice(0, 10)}`;
      const todayViews = await redis.get(todayKey) || 0;

      // For simplicity, we'll fetch last 7 days for weekViews
      let weekViews = 0;
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = `visits:${date.toISOString().slice(0, 10)}`;
        weekViews += parseInt(await redis.get(key) || 0);
      }

      const totalDownloads = await redis.get('totalDownloads') || 0;

      return res.status(200).json({
        totalViews,
        todayViews,
        weekViews,
        totalDownloads,
        securityStatus: "Secure",
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Error in /api/stats:', err);
    return res.status(500).json({ error: 'Server Error' });
  }
}
