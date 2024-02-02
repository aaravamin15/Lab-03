//-----------------------------
//#region Setup
//-----------------------------
const express = require("express");
const app = express();
const db = require("./db");
const bodyParser = require('body-parser');
const PORT = 4000;

//#endregion Setup

//-----------------------------
//#region App Config
//-----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line for URL-encoded data
app.use(bodyParser.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:8080",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
//#endregion App Config

//-----------------------------
//#region Database Routes
//-----------------------------
app.get("/", (req, res) => {
  res.json({ info: "AudioData App" });
});

app.get("/audio/:id", db.getAudioDataById);
app.post("/user", db.createAudioData);
app.put("/user/:id", db.updateAudioData);
app.delete("/user/:id", db.deleteAudioData);

// New route for capturing microphone input and storing it as BLOB
app.post('/captureAudio', (req, res) => {
  const { id } = req.body;

  // Simulating audio data (replace this with actual audio data)
  const simulatedAudioData = 'Sample audio data';

  // Convert simulated audio data to Buffer
  const audioBuffer = Buffer.from(simulatedAudioData);

  const query = 'INSERT INTO audioData (ID, AudioData) VALUES (?, ?)';

  db.run(query, [id, audioBuffer], (error) => {
    if (error) {
      console.error(error.message);
      return res.status(400).json({ error: error.message });
    }

    res.json({ id });
  });
});
//#endregion Database Routes

//-----------------------------
//#region Server
//-----------------------------
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
//#endregion Server
