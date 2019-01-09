const express = require('express');
const mysql = require('mysql');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const db = config.get('db');

const router = express.Router();

const connection = mysql.createConnection({
    host     : db.hostname,
    user     : db.username,
    password : db.password,
    database : db.database
});

router.post('/', async (req, res) => {
    const { error } = validateKeepalive(req.body); 
    if (error) return res.status(400).send(error.details[0].message);  

    await connection.query("SELECT count(*) as count,name,email,id,role FROM student where name = '"+req.body.username+"' and password ='"+req.body.password+"'",  function (err, rows, fields) {
        if (err) throw err

        if(rows[0].count == 0) return res.status(400).send('Invalid Username Or Password');

        const token = jwt.sign({name:rows[0].name,email:rows[0].email,id:rows[0].id,role:rows[0].role},'jwttokenkey');

        return res.status(200).send(token);
    });
   
});



function validateKeepalive(data) {
  const schema = {
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required()
  };

  return Joi.validate(data, schema);
}

module.exports = router;