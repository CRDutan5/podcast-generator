import express from "express";
import transcriptRouter from "./routes/transcriptRoutes.js";
import podcastRouter from "./routes/podcastRoute.js";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", transcriptRouter);
app.use("/api", podcastRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello, Express!" });
});

export default app;
