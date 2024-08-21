const sqlite3 = require('sqlite3').verbose();


//delete db.sqlite if exists
const fs = require('fs');
const path = './db.sqlite';
if (fs.existsSync
(path)) {
    fs.unlinkSync(path);
    console.log('db.sqlite deleted');
}

const db = new sqlite3.Database('db.sqlite');


db.serialize(() => {
    db.run(`
        CREATE TABLE university
        (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE courses
        (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            course_name   TEXT NOT NULL,
            university_id INTEGER,
            FOREIGN KEY (university_id) REFERENCES university (id)
        )
    `);

    db.run(`
        CREATE TABLE student
        (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            email         TEXT    NOT NULL UNIQUE,
            student_email TEXT,
            student_paid  BOOLEAN NOT NULL DEFAULT 0,
            university_id INTEGER,
            FOREIGN KEY (university_id) REFERENCES university (id)
        )
    `);

    db.run(`
        CREATE TABLE selected_course
        (
            student_id INTEGER,
            course_id  INTEGER,
            PRIMARY KEY (student_id, course_id),
            FOREIGN KEY (student_id) REFERENCES student (id),
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    `);

    db.run(`
        INSERT INTO university (name)
        VALUES ('FIPU'),
               ('TFPU')
    `);

    db.run(`
        INSERT INTO courses (course_name, university_id)
        VALUES ('Funkcijsko programiranje', 1),
               ('Data science', 1),
               ('Elektrotehnika', 2),
               ('Kemija', 2)

    `);

    db.run(`
        INSERT INTO student (name, email, student_email, student_paid, university_id)
        VALUES ('Leo Radocaj', 'leo.radocaj2@gmail.com', '', 0, 1)
    `);


    console.log('Database setup and seeding complete.');
});

export default db;