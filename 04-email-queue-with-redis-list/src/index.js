import Redis from 'ioredis';
import express from 'express';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
    // there can be any kind of data inside a JOB
    const job = {
        to : req.body.to,
        subject : req.body.subject || "No Subject",
        body : req.body.body || "No Content",
        createdAt : new Date().toISOString()
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ queued : true });
})

app.get("/email/process-one", async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY);
    if(!rawJob){
        res.json({message : "No jos is in the queue"})
    }
    const job = JSON.parse(rawJob);
    //Simulate sending emails
    res.json({message : "Email sent", job}); 
});

app.listen(3000, () => {
    console.log("SErver is listening on PORT 3000");
});