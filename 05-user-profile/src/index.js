import Redis from 'ioredis';
import express from 'express';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({saved : true});
});

app.get("/user/:id/json", async (req, res) => {
    const rawData = redis.get(`user:${req.params.id}:json`);
    if(!rawData){
        return res.json({ message : "user not Found", user : null});
    }
    const user = JSON.parse(rawData);
    res.json({ user });
});

app.post("/user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({savedAs : "hash"});
});

app.get("/user/:id/hash", async (req, res) => {
    const user = redis.hgetall(`user:${req.params.id}:json`);
    res.json({ user });
});

app.listen(3000, () => { 
    console.log("Server is listening on 3000");
});