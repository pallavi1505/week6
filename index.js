//this is express server
const express = require('express')
const port = 5000
const dotenv = require('dotenv');
const pool = require('./helper/databaseConnector');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');
const cors= require('cors')
const { body, validationResult } = require('express-validator');
const app = express()

dotenv.config({path: '.env-local'});

const options = {
    swaggerDefinition : {
        info:{
            title:"Students API",
            description:"To make CRUD operations on Students table in 'Sample' db.",
            version:"1.0.0",
            host:`http://localhost:5000`,
            basePath:'/'
        },  
    },
    apis:['./index.js']
};


const specs = swaggerJsDoc(options);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
app.use(cors());

//to avoid creating models
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', (req, res) => {
  try {
    res.send('ITIS 6117 System Integration Week 5.')
} catch (error) {
    console.log(error)
}
})

/** 
 * @swagger 
 * /students:
 *   get: 
 *      summary : Returns names of all the students
 *      produces : application/json
 *      responses :
 *          '200' :
 *              description: success
 */
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

const {
    validateAgent
} = require('./helper/validator');

/**
 * @swagger
 * /students:
 *    post:
 *      requestBody:
 *          description: Use to insert a new student
 *          content:
 *              application/json:
 *                  example:
 *                       student_id : 12,
 *                       student_first_name : xyz,
 *                       student_last_name : abc,  
 *                       age : 20,
 *                       gender : F        
 *      responses:
 *          '200':
 *              description: Successfully inserted a student xyz
 *          '400':
 *              description: Bad request body
 */
app.post('/students',body('student_id').isNumeric().notEmpty(),body('student_first_name').notEmpty(),
body('student_last_name').notEmpty(),body('age').isNumeric(),body('gender').notEmpty(),async function(req,res){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const sqlQuery = `INSERT INTO students VALUES (${req.body.student_id},"${req.body.student_first_name}","${req.body.student_last_name}",${req.body.age},"${req.body.gender}");`;
        const rows = await pool.query(sqlQuery);
        res.status(200).json(req.body);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

/**
 * @swagger
 * /students:
 *    put:
 *      requestBody:
 *          description: Use to update student age,firstname, last name, age using student's id as primary key
 *          content:
 *              application/json:
 *                  example:
 *                       student_id : 12,
 *                       student_first_name : xyz,
 *                       student_last_name : abc,  
 *                       age : 20,
 *                       gender : F            
 *      responses:
 *          '200':
 *              description: Successfully updated xyz
 *          '400':
 *              description: Bad request body
 */
app.put('/students',body('student_id').isNumeric().notEmpty(),async function(req,res){
    try {   
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    const sqlQuery = `UPDATE students SET age = "${req.body.age}", first_name = "${req.body.student_first_name}" ,last_name = "${req.body.student_last_name}" WHERE  student_id = "${req.body.student_id}";`
    const rows = await pool.query(sqlQuery);
    res.status(200).json(`User ${req.body.student_first_name} Successfully Updated`);
    } catch (error) {
        res.status(400).send(error.message)
    }
});


/**
 * @swagger
 * /students:
 *    patch:
 *      requestBody:
 *          description: Use to update student age using student's id as primary key
 *          content:
 *              application/json:
 *                  example:
 *                       student_id : 12,
 *                       student_first_name : xyz,
 *                       student_last_name : abc,  
 *                       age : 20,
 *                       gender : F                 
 *      responses:
 *          '200':
 *              description: Successfully updated xyz
 *          '400':
 *              description: Bad request body
 */
app.patch('/students',body('student_id').isNumeric().notEmpty(),async function(req,res){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    const sqlQuery = `UPDATE students SET age = "${req.body.age}" WHERE  student_id = "${req.body.student_id}";`
    const rows = await pool.query(sqlQuery);

    res.status(200).json(`User ${req.body.student_first_name} Successfully Updated`);
    } catch (error) {
        res.status(400).send(error.message)
    }
});


/**
 * @swagger
 * /students:
 *    delete:
 *      requestBody:
 *          description: Use to delete a student from the table using student's id as primary key
 *          content:
 *              application/json:
 *                  example:
 *                      example:
 *                       student_id : 12,
 *                       student_first_name : xyz,
 *                     
 *      responses:
 *          '200':
 *              description: Successfully updated a xyz
 *          '400':
 *              description: Bad request body
 */
app.delete('/students',body('student_id').isNumeric().notEmpty(),async function(req,res){
  try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
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
