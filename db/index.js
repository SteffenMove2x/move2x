const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    password: 'af55a1e3',
    user: 'bcf5c42dc0f337',
    database: 'heroku_4c2231be0522056',
    host: 'eu-cdbr-west-03.cleardb.net',
    port: '3306',
    insecureAuth : true
});

let db = {};

//Score

db.readAll = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM score', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.insert = (currentScore, maxScore) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO score (currentScore, maxScore) VALUES ("${currentScore}", "${maxScore}",)`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.readOne = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM score WHERE id = ?', id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.editOne = (id, currentScore, maxScore) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE score SET currentScore="${currentScore}", maxScore="${maxScore}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.deleteOne = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM score WHERE id = ?', id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.editOneScoreWithFK = (fk_scenario, currentScore, maxScore) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE score SET currentScore="${currentScore}", maxScore="${maxScore}" WHERE fk_scenario = ?`, fk_scenario, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.insertNewScoreWithFK = (currentScore, maxScore, fk_scenario) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO score (currentScore, maxScore, fk_scenario) VALUES ("${currentScore}", "${maxScore}", "${fk_scenario}")`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.readOneScoreFromFK = (fk_scenario) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM score WHERE fk_scenario = ?', fk_scenario, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

//Team

db.readOneTeam = (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM team WHERE name = ?', name, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.insertTeam = (teamName, date) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO team (name, date) VALUES ("${teamName}", "${date}")`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

//Scenario

db.readAllScenarioWithFk = (fk_team) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM scenario WHERE fk_team = ?', fk_team, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.insertScenario = (fk_team) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO scenario (fk_team) VALUES ("${fk_team}")`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};


//Orders

db.readAllOrderssAbs = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM orders', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.readAllOrderss = (fk_scenario) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM orders WHERE fk_scenario = ?', fk_scenario, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.readOneOrders = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM orders WHERE id = ?', id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.readOneOrdersIdFromNameAndScenarioFk = (name, fk_scenario) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM orders WHERE name = "${name}" AND fk_scenario = "${fk_scenario}"`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.insertOneOrders = (name, expFinishTime, fk_scenario) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO orders (name, expFinishTime, fk_scenario) VALUES ("${name}", "${expFinishTime}", "${fk_scenario}")`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.updateOneOrdersStartTime = (id, startTime, isStarted) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET startTime="${startTime}", isStarted="${isStarted}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersEndTime = (id, endTime, isEnded, finishTime) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET endTime="${endTime}", isEnded="${isEnded}", finishTime="${finishTime}"  WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersUsedTime = (id, usedTime) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET usedTime="${usedTime}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersProcessFail = (id, fails) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET pFail="${fails}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersQualityFail = (id, fails) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET qFail="${fails}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersPauseDuration = (id, pauseDuration) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET pauseDuration="${pauseDuration}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersUsedTimeWithPauses = (id, usedTimeWithPauses) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET usedTimeWithPauses="${usedTimeWithPauses}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersFinishRound = (id, finishRound) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET finishRound="${finishRound}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersFinishTimeDiff = (id, finishTimeDiff) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET finishTimeDiff="${finishTimeDiff}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.updateOneOrdersThisScore = (id, thisScore) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE orders SET thisScore="${thisScore}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

//OrdersProduct

db.insertOneOrdersProduct = (amount, fk_orders, fk_product) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO ordersproduct (amount, fk_orders, fk_product) VALUES ("${amount}", "${fk_orders}", "${fk_product}")`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.readOPFromFk = (fk_orders) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM ordersproduct WHERE fk_orders = ?', fk_orders, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};


//Products

db.readProductsFromID = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM product WHERE id = ?', id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

//pause in db

db.readOnePause = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM pause WHERE id = ?', id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};

db.readLastPauseId = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM pause ORDER BY ID DESC LIMIT 1', (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
};


db.insertPauseStart = (pauseStartTime) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO pause (pauseStart) VALUES ("${pauseStartTime}")`, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

db.updatePauseEnd = (id, pauseEndTime, pauseDuration) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE pause SET pauseEnd="${pauseEndTime}", pauseDuration="${pauseDuration}" WHERE id = ?`, id, (err, results) => {
            if(err){
                return reject(err);
            }
            return resolve(results);
        });
    });
};

module.exports = db;