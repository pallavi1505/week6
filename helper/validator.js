const {
    body
} = require('express-validator');



exports.validateAgent = [body('student_id', 'Student id cannot be empty').notEmpty().trim().escape(),
body('student_first_name', 'Student first name cannot be empty').notEmpty().trim().escape(),
body('student_last_name', 'Student last name cannot be empty').notEmpty().trim().escape(),
body('age', 'Swtudent Age cannot be empty').notEmpty().trim().escape(),
body('gender', 'Student Gender cannot be empty').notEmpty().trim().escape(),
];