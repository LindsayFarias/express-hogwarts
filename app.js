const express = require('express');
const app = express();
const students = require('./students.json');
const grades = require('./grades.json');
const register = require('./register.json');
const bodyParser= require('body-parser');
let port = 3001

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/students/', async function(req, res){
    let result;
    let originalUrl = req.originalUrl.split('')
    let query= decodeURIComponent(req.query.search)

    if(originalUrl.includes('?')){
        result = await students.find((element) => element.name == query)
    } else {
        result = students
    }
    res.send(result)
})

app.get('/students/:studentId', async function(req, res) {
    let id = parseInt(req.params.studentId, 10)
    let student = await students.find((element) => element.studentId === id)
    res.send(student.details)
})

app.get('/grades/:studentId', async function(req, res){
    let id = parseInt(req.params.studentId, 10)
    let gradeData = await grades.find((element) => element.studentId === id)
    res.send(gradeData.grades)
})

app.post('/grades', (req, res) => {
    let result;
    const newGrade = req.body;
    if(
        newGrade.studentId &&
        newGrade.grade
    ) {
        let grade = newGrade.grade
        let updateStudent = grades.filter((student) => student.studentId === newGrade.studentId);
        let updatedScores = {...updateStudent[0].grades, ...grade};
        updateStudent.grades = updatedScores;
        result = {
            status: 'success',
            message: 'new grades posted'
        };
    } else {
        result = {
            status: 'failed',
            message: 'failed to post new grade'
        };
        res.status(400);
    }
    res.json(result);
})

app.post('/register', (req, res) => {
    let result;
    const newUser = req.body;
    if(
        newUser.username &&
        newUser.email
    ) {
        register.push(
            {
                username: newUser.username,
                email: newUser.email
            }
        );
        console.log(register)
        result = {
            status: 'success',
            message: 'You have successfully registered'
        };
    } else {
        result = {
            status: 'failed',
            message: 'please input a username and email'
        };
        res.status(400);
    }
    res.json(result);
})

app.listen(port, ()=> console.log(`Student app listening at http://localhost:${port}`))
// GET /students - returns a list of all students--DONE
// this endpoint, optionally, accepts query parameters--DONE
// GET /students?search=<query> - returns a list of students filtered on name matching the given query--DONE
// GET /students/:studentId - returns details of a specific student by student id--DONE
// GET /grades/:studentId - returns all grades for a given student by student id--DONE
// POST /grades - records a new grade, returns success status in JSON response (meaning you do not need to actually store the grade in a database. You do need to validate that the user supplied at least a grade, and a studentId)--DONE
// POST /register - creates a new user, returns success status in JSON response (meaning you do not need to actually store the user info in a database. You do need to validate that the user supplied username and email)
