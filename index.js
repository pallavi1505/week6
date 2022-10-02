//this is express server
const express = require('express')
const port = 5000
const dotenv = require('dotenv');
const pool = require('./helper/databaseConnector');
const app = express()

dotenv.config({path: '.env-local'});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/students', async function(req,res){
  try {
      const sqlQuery = 'SELECT * FROM students;';
      const rows = await pool.query(sqlQuery);
      res.status(200).json(rows);
  } catch (error) {
      console
      res.status(400).send(error.message)
  }
});

app.post('/students',async function(req,res){
    try {
        console.log(req.body);
        const sqlQuery = `INSERT INTO students VALUES (${req.body.student_id},"${req.body.student_first_name}","${req.body.student_last_name}",${req.body.age},"${req.body.gender}");`;
        const rows = await pool.query(sqlQuery);
        res.status(200).json(req.body);
    } catch (error) {
        res.status(400).send(error.message)
    }
});


app.put('/students', async function(req,res){
    try {   
    const sqlQuery = `UPDATE students SET age = "${req.body.age}", first_name = "${req.body.student_first_name}" ,last_name = "${req.body.student_last_name}" WHERE  student_id = "${req.body.student_id}";`
    const rows = await pool.query(sqlQuery);
    res.status(200).json(`User ${req.body.student_first_name} Successfully Updated`);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

app.patch('/students', async function(req,res){
    try {
    const sqlQuery = `UPDATE students SET age = "${req.body.age}" WHERE  student_id = "${req.body.student_id}";`
    const rows = await pool.query(sqlQuery);

    res.status(200).json(`User ${req.body.student_first_name} Successfully Updated`);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

app.delete('/students',async function(req,res){
  try {
      const sqlQuery = `DELETE FROM students WHERE student_id = "${req.body.student_id}";`;
      await pool.query(sqlQuery);
      res.status(200).json(`User ${req.body.student_first_name} Successfully Deleted`);
  } catch (error) {
      res.status(400).send(error.message)
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
