const { v4: uuidv } = require('uuid');
const express = require("express");


const fs = require("fs");

// const uuid = require("./helpers/uuid");
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');
const path = require("path");
// const notesData = require("./db/db.json");
const notesData = require(path.join(__dirname, "db", "db.json"));
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    console.info(`{req.method} request received to add a note`);
    const {title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
      
      readAndAppend(newNote, './db/db.json');
      
      const response = {
        status: 'success',
        body: newNote,
      };
      
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('ERROR: Review cannot be posted at this time.');
    }
  });

// app.post("/api/notes", (req, res) => {
//   console.info(`{req.method} request received to add a note`);
//   const {title, text } = req.body;

//   if (title && text) {
//     const newNote = {
//         title,
//         text,
//         id: uuidv4(),
//     };

//     readAndAppend(newNote, './db/db.json');
    
//     const response = {
//       status: 'success',
//       body: newNote,
//     };
    
//     console.log(response);
//     res.status(201).json(response);
//   } else {
//     res.status(500).json('ERROR: Review cannot be posted at this time.');


//     // fs.readFile('./db/db.json', 'utf8', (err, data) => {
//     //     if (err) {
//     //         console.error(err);
//     //     } else {
//     //         const parsedNotes = JSON.parse(data);

//     //         parsedNotes.push(newNote);

//     //         fs.writeFile(
//     //             './db/db.json',
//     //             JSON.stringify(parsedNotes, null, 4),
//     //             (writeErr) =>
//     //                 writeErr
//     //                     ? console.error(writeErr)
//     //                     : console.info('Notes are up to date.')
//     //         );
//     //     }
// //     // });

// //     const response = {
// //         status: 'success',
// //         body: newNote,
// //     };
// //     console.log(response);
// //     res.status(201).json(response);
// //   } else {
// //     res.status(500).json('ERROR: Review cannot be posted at this time.');
// //   }
// };

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
