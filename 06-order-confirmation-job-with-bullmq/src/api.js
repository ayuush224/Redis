import express from 'express';
import { emailQueue, connection } from './queue';
import { Backoffs } from 'bullmq';

const app = express();

app.post("/welcome-email", async(req, res) => {
    const job = emailQueue.add(
        "send-welcome-email",
        {
            to : req.body.to,
            name : req.body.name || "Learner"
        },
        {
            attempts : 3,
            backoff : {
                type : "exponential",
                delay : 1000
            }
        }
    );
    res.json({message : "Welcome email job added to queue", jobId : job.id});
});