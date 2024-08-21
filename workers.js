import {Client, logger, Variables} from "camunda-external-task-client-js";
import axios from 'axios';
import sqlite3 from "sqlite3";

const config = {baseUrl: "http://localhost:8080/engine-rest", use: logger};

const db = new sqlite3.Database('db.sqlite');

const client = new Client(config);


client.subscribe("send-credentials", async function ({task, taskService}) {

    console.log("Called send-credentials");

    const email = task.variables.get("student_contact_email");

    const userFromDb = await getUserFromDb(email);

    try {
        await createTasklistUser(userFromDb);
    } catch (e) {

    }

    console.log(`Created user ${userFromDb} with email ${email}`);

    const processVariables = new Variables();

    processVariables.set("student_id", userFromDb.id + "");


    await taskService.complete(task, processVariables);
});


client.subscribe("get-courses", async function ({task, taskService}) {


    console.log("Called get-courses");

    const email = task.variables.get("student_contact_email");

    const userFromDb = await getUserFromDb(email);


    const courses = await getCoursesFromDb(userFromDb.university_id);

    const processVariables = new Variables();
    const localVariables = new Variables();
    const x = courses.map(course => course.course_name)
    processVariables.set("courses", x);
    localVariables.set("courses", x);


    await taskService.complete(task, processVariables, localVariables);


});


client.subscribe("save-courses", async function ({task, taskService}) {


    console.log("Called save-courses");

    const selected = task.variables.get("odabirpredmeta");

    console.log(selected);

    await taskService.complete(task);


});


client.subscribe("send-invoice", async function ({task, taskService}) {


    console.log("Šaljem uplatnicu");

    await taskService.complete(task);


});


client.subscribe("isvu-send", async function ({task, taskService}) {


    console.log("isvu-send  ");

    const query = `UPDATE student
                   SET student_paid = 1
                   WHERE student_email = ?`;

    await db.run(query, [task.variables.get("student_contact_email")]);


    await taskService.complete(task);


});


client.subscribe("student-enrolled", async function ({task, taskService}) {


    console.log("student-enrolled  ");

    console.log("Student je upisan");


    await taskService.complete(task);


});


async function getCoursesFromDb(university_id) {

    const query = `SELECT *
                   FROM courses
                   WHERE university_id = ?`;

    return new Promise((resolve, reject) => {
        db.all(query, [university_id], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });

}

function getUserFromDb(email) {
    const query = `SELECT *
                   FROM student
                   WHERE email = ?`;

    return new Promise((resolve, reject) => {
        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}


async function createTasklistUser(user) {
    const email = user.email;
    try {
        await axios.post('http://localhost:8080/engine-rest/user/create', {
            profile: {
                id: user.id + "",
                firstName: email,
                lastName: email,
                email: email
            },
            credentials: {
                password: email
            }
        });
    } catch (e) {
    }
    try {
        await axios.put('http://localhost:8080/engine-rest/group/students/members/' + user.id)
    } catch (e) {
    }

    console.log(`Created user ${user.id} with password ${email}`);

}







