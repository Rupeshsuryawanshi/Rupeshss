const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all user
app.get('/user', (req, res) => {
    mysqlConnection.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.get('/user/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an user
app.delete('/user/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an user
app.post('/user', (req, res) => {
    let user = req.body;
    mysqlConnection.query("INSERT INTO user (name,salary) VALUES ('"+user.name+"','"+user.salary+"')", (err, rows, fields) => {
        if (!err)
            res.send('INSERT  successfully.');
        else
            console.log(err);
    })
})




  

//Update an employees
app.put('/user', (req, res) => {
    
    mysqlConnection.query("SELECT * FROM user WHERE id='"+req.body.id+"'", function (err, result2) {
        if(err){
          res.send({status:"false",msg:"invalid",data:err})
        } else{
          if(result2.length>0){
            var total_salary= parseInt(result2[0].salary)+parseInt(req.body.salary);
            var sql =  "UPDATE user SET salary = "+total_salary+" WHERE id ="+req.body.id;
            mysqlConnection.query(sql, function (err, result) {
              if (err) {
                throw err;
              }
              else{
                res.send('UPDATE  successfully.');
              }
            })
        }
    }
})
})

