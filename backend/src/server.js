import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import cors from "cors";
import { createServer } from "http";
import cron from "node-cron";
import fs from "fs";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";
import songsRoute from "./routes/songsRoute.js";
import albumsRoute from "./routes/albumsRoute.js";
import statsRoute from "./routes/statsRoute.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 8081;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
));

app.use(express.json()); //parsing req.body json
app.use(clerkMiddleware()); //adds auth object to req obj => req.auth.userId
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024, //10MB max filesize
    }
}));

//cron jobs: deletes tmp files in set interval
const tmpDir = path.join(process.cwd(),"tmp");
cron.schedule("0 * * * *", () => {
    if(fs.existsSync(tmpDir)) {
        fs.readdir(tmpDir, (err, files) => {
            if(err) {
                console.log("error", err);
                return;
            }
            for (const file of files) {
                fs.unlink(path.join(tmpDir, file), (err) => {})
            }
        });
    }

})

//routes:
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/songs", songsRoute);
app.use("/api/albums", albumsRoute);
app.use("/api/stats", statsRoute);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(path.resolve(__dirname,"../frontend/dist/index.html")))
    })
}

//error handler
app.use((err,req,res,next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
})

httpServer.listen(PORT, () => {
    console.log("Server is listening on " + PORT);
    connectDB();
});

//todo: socket.io