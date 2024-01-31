# Intro to SQLite
This repo provides a very basic template for using `sqlite` with `express`. It is part of the [Software Engineering](https://edu.lester-lee.com/software-engineering/) course.

## Assignment
Write the rest of the missing endpoints in `index.js` to create a simple backend for a CRUD app.  This will require you to write code in `db.js` as well!

The [documentation for sqlite3](https://github.com/mapbox/node-sqlite3/wiki/API) will be very helpful.

Make sure that you return the correct HTTP status code as well.

### index.js
Most of this file should look familiar. Look at past assignments to review what each section of this file does.

You can ignore the middleware code -- at a very basic level, this code allows us to test our front end later on in this course.

### db.js
The database `foo.db` contains one table named `user`.

Use DB Browser to explore this database before you write any code!

The remaining end points:

Get all users:

app.get("/users", db.getAllUsers);

Create a new user:

app.post("/user", db.createUser);

Update a user's name:

app.put("/user/:id", db.updateUserName);

Delete a user by id:

app.delete("/user/:id", db.deleteUser);
