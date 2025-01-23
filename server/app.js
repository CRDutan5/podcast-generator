import express from "express";
import transcriptRouter from "./routes/transcriptRoutes.js";
import podcastRouter from "./routes/podcastRoute.js";

const app = express();

app.use(express.json());
app.use("/api", transcriptRouter);
app.use("/api", podcastRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello, Express!" });
});

export default app;
