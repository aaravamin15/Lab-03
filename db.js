//-----------------------------
//#region Database Connection
//-----------------------------
const path = require("path");
const sqlite = require("sqlite3").verbose();
const dbFile = path.join(__dirname, "foo.db");
const db = new sqlite.Database(dbFile, (error) => {
  if (error) return console.error(error.message);
  console.log(`Connected to database ${dbFile}`);
});

const getEntryById = (request, response) => {
  // Parse the id to generate a SQLite query
  const id = parseInt(request.params.id);
  const query = `SELECT * FROM entry WHERE id = ?`;

  // db.get will replace all ? in query sequentially with
  // items from the array passed as the second parameter
  // and then run the callback function passed as the third param
  // What does the callback function do?
  db.get(query, [id], (error, result) => {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    // If nothing is returned, then result will be undefined
    if (result) {
      response.json(result);
    } else {
      response.sendStatus(404);
    }
  });
};

// ----- FILL IN BELOW -----
// Write and export the rest of the functions needed by index.js!
// Create a new user

const createEntry = (request, response) => {
  const { name } = request.body;
  const query = `INSERT INTO entry (name) VALUES (?)`;

  db.run(query, [name], function (error) {
    if (error) {
      console.error(error.message);
      response.status(400).json({ error: error.message });
      return;
    }
    response.json({ id: this.lastID, name });
  });
};

// Update a user's data, given an id
const updateEntry = (request, response) => {
  const { id } = request.params;
  const { name } = request.body;
  const query = `UPDATE entry SET entry = ? WHERE id = ?`;

  db.run(query, [name, id], function (error) {
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

// Delete a user by id
const deleteEntry = (request, response) => {
  const { id } = request.params;
  const query = `DELETE FROM entry WHERE id = ?`;

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
//#endregion Routes

// This allows `index.js` to use functions defined in this file.
module.exports = {
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  };
