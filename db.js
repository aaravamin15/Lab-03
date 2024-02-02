//-----------------------------
//#region Database Connection
//-----------------------------
const path = require("path");
const dbFile = path.join(__dirname, "audioDatabase.db");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbFile, (error) => {
  if (error) return console.error(error.message);
  console.log(`Connected to database ${dbFile}`);
  
  // Create the 'audioData' table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS audioData (
      ID INTEGER PRIMARY KEY,
      AudioData BLOB
    )
  `;
  
  db.run(createTableQuery, (createTableError) => {
    if (createTableError) {
      console.error("Error creating table:", createTableError.message);
    } else {
      console.log("Table 'audioData' created successfully");
    }
  });
});

module.exports = db;

const getAudioDataById = (request, response) => {
  const id = parseInt(request.params.id);
  const query = 'SELECT * FROM audioData WHERE ID = ?';

  db.get(query, [id], (error, result) => {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    if (result) {
      response.json(result);
    } else {
      response.sendStatus(404);
    }
  });
};

const createAudioData = (request, response) => {
  const { id, audioData } = request.body; 
  const query = `INSERT INTO audioData (ID, AudioData) VALUES (?, ?)`; 

  db.run(query, [id, audioData], function (error) {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    response.json({ id, audioData });
  });
};

const updateAudioData = (request, response) => {
  const { id } = request.params;
  const { audioData } = request.body;
  const query = `UPDATE audioData SET AudioData = ? WHERE ID = ?`; // Use ID instead of id

  db.run(query, [audioData, id], function (error) {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    if (this.changes === 0) {
      response.sendStatus(404);
    } else {
      response.sendStatus(200);
    }
  });
};

const deleteAudioData = (request, response) => {
  const { id } = request.params;
  const query = `DELETE FROM audioData WHERE ID = ?`

  db.run(query, [id], function (error) {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    if (this.changes === 0) {
      response.sendStatus(404);
    } else {
      response.sendStatus(200);
    }
  });
};

module.exports = {
  getAudioDataById,
  createAudioData,
  updateAudioData,
  deleteAudioData,
};
