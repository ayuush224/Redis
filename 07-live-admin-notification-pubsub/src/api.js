import express from 'express';
import Redis from 'ioredis';

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const app = express();

app.post("/notification", async (req, res) => {
    const payload = {
        title : req.body.title,
        createdAt : new Date().toISOString()
    }

    const receivers = publisher.publish("notification", JSON.stringify(payload));
    res.json({message : "Publisher published the messages"});
});

app.listen(3000, () => {
    console.log("Server is listening");
});