const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000
var app = express();

const { Pool } = require('pg');
var pool;
pool = new Pool({
    connectionString: 'postgres://postgres:129409Zydayy@localhost/Tokimon_Family'
});
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/Add_New', (req, res) => {
    res.render('Add_New.ejs')
});

app.get('/', (req, res) => { res.render('Tokimon_family.ejs') });
app.get('/Display_one', (req, res) => {
    res.render('Display_one.ejs')
});
app.post('/Display_one', (req, res) => {
    params = JSON.parse(JSON.stringify(req.body))
    console.log(params)
    NAME = params['name']
    var getUsersQuery = `SELECT * FROM public."TOKIMON" WHERE "T_NAME" =  '${NAME}'`
    console.log(getUsersQuery);
    pool.query(getUsersQuery, (error, result) => {
        if (error)
            res.end(error);
        var results = { 'rows': result.rows };
        console.log(results);
        res.render('Display_one.ejs', results)
    });
});
app.get('/Change_Attribute', (req, res) => {
    var getUsersQuery = 'SELECT * FROM public."TOKIMON"';
    pool.query(getUsersQuery, (error, result) => {
        if (error)
            res.end(error);
        var results = { 'rows': result.rows };
        res.render('Change_Attribute.ejs', results)
    });
});

app.post('/Change_Attribute', (req, res) => {
    params = JSON.parse(JSON.stringify(req.body))
        //console.log(params)
    var total = 0
    for (var key in params) {
        if (key != 'trainer' && key != 'name') {
            if (isNaN(parseInt(params[key]))) {
                console.log(`wrong type for ${key}, putting value as 0`)
                params[key] = 0
            } else {
                params[key] = parseInt(params[key])
                total += params[key]
            }
        }
    }
    total = total - params['weight'] - params['height']
    updateQuery = `UPDATE public."TOKIMON" SET "ELECTRIC"=${params.electric}, "FIGHT"=${params.fight}, "FIRE"=${params.fire}, "FLY"=${params.fly}, "FROZEN"=${params.frozen}, "HEIGHT"=${params.height}, "TRAINER"='${params.trainer}, "WATER"=${params.water}', "WEIGHT"=${params.weight}, "TOTAL"=${total} WHERE "T_NAME" = '${params.name}'`
        //console.log(updateQuery)
    pool.query(updateQuery, function(err, result, fields) {
        if (err) {
            console.log(`fail to update to Tokimon ${params.name}`)
            res.redirect('/');
        } else {
            console.log(`success to update to Tokimon ${params.name}`)
            res.render('Add_New.ejs')
        }
    });

});

app.post('/Add_New', (req, res) => {
    params = JSON.parse(JSON.stringify(req.body))
    var total = 0
    for (var key in params) {
        if (key != 'trainer' && key != 'tokimon_name') {
            if (isNaN(parseInt(params[key]))) {
                console.log(`wrong type for ${key}, putting value as 0`)
                params[key] = 0
            } else {
                params[key] = parseInt(params[key])
                total += params[key]
            }
        }
    }
    total = total - params['weight'] - params['height']
    insertQuery = `INSERT INTO public."TOKIMON"(
        "ELECTRIC", "FIGHT", "FIRE", "FLY", "FROZEN", "HEIGHT", "TRAINER", "T_NAME", "WATER", "WEIGHT", "TOTAL")
    VALUES( ${params.electrify} , ${params.fight}, ${params.fire} , ${params.fly} , ${params.freeze}, ${params.height} , '${params.trainer}' , '${params.tokimon_name}', ${params.water} , ${params.weight} , ${total})`
        //console.log(insertQuery)
    pool.query(insertQuery, function(err, result, fields) {
        if (err) {
            console.log("fail to insert to Tokimon family")
            res.redirect('/');
        } else {
            console.log("success to insert from Tokimon family")
            res.render('Add_New.ejs')
        }
    });
});

app.get('/Delete', (req, res) => {

    res.render('Delete.ejs')
});

app.post('/Delete', (req, res) => {
    NAME = JSON.parse(JSON.stringify(req.body))["tokimon_name"]
        //onsole.log(NAME)
    deleteQuery = `DELETE FROM public."TOKIMON" WHERE "T_NAME" =  '${NAME}'`
    console.log(deleteQuery)
    pool.query(deleteQuery, function(err, result, fields) {
        //console.log("delet reslut", result)
        if (err) {
            console.log("fail to delete from Tokimon family")
            res.redirect('/');
        } else {
            if (result.rowCount == 0) {
                console.log("delete 0 rows")
                res.redirect('/');
            } else {
                console.log("success to delete from Tokimon family")
                res.render('Delete.ejs')
            }
        }
    });
});
app.get('/Display_All', (req, res) => {
    var getUsersQuery = 'SELECT * FROM public."TOKIMON"';
    console.log(getUsersQuery);
    pool.query(getUsersQuery, (error, result) => {
        if (error)
            res.end(error);
        var results = { 'rows': result.rows };
        console.log(results);
        res.render('Display_All.ejs', results)
    });
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))