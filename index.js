//-----------------------------
//#region Setup
//-----------------------------
const express = require("express");
const app = express();
const db = require("./db");
const record = require('node-record-lpcm16');
const bodyParser = require('body-parser');
const PORT = 4000;
//#endregion Setup

//-----------------------------
//#region App Config
//-----------------------------
app.use(express.json());
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
  res.json({ info: "Demo app for sqlite3" });
});

app.get("/user/:id", db.getUserById);

app.get("/users", db.getAllUsers);
app.post("/user", db.createUser);
app.put("/user/:id", db.updateUserName);
app.delete("/user/:id", db.deleteUser);

// New route for capturing microphone input and storing it as BLOB
app.post("/captureAudio", (request, response) => {
  const { id } = request.body;

  const capture = record.start({
    sampleRate: 44100,
    verbose: true,
    silence: '5.0',
  });

  let audioBuffer = Buffer.from([]);

  capture
    .on('data', (chunk) => {
      audioBuffer = Buffer.concat([audioBuffer, chunk]);
    })
    .on('end', () => {
      const query = 'INSERT INTO audioData (ID, AudioData) VALUES (?, ?)';
      
      db.run(query, [id, audioBuffer], function (error) {
        if (error) {
          console.error(error.message);
          response.status(400).json({ error: error.message });
          return;
        }
        
        response.json({ id });
      });

      record.stop();
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
