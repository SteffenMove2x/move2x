const express = require("express");
const db = require('../db');
const router = express.Router();


//Score

router.get('/api/score', async (req, res, next) => {
    try{
        let results = await db.readAll();
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.post('/api/score', async (req, res, next) => {
    try{
        var currentScore = req.body.currentScore;
        var maxScore = req.body.maxScore;
        let results = await db.insert(currentScore, maxScore);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/score/:id', async (req, res, next) => {
    try{
        var currentScore = req.body.currentScore;
        var maxScore = req.body.maxScore;
        let results = await db.editOne(req.params.id, currentScore, maxScore);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.get('/api/score/:id', async (req, res, next) => {
    try{
        let results = await db.readOne(req.params.id);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.delete('/api/score/:id', async (req, res, next) => {
    try{
        let results = await db.deleteOne(req.params.id);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


router.post('/api/scorefk', async (req, res, next) => {
    try{
        var fk_scenario = req.body.fk_scenario;
        var currentScore = req.body.currentScore;
        var maxScore = req.body.maxScore;
        let results = await db.insertNewScoreWithFK(currentScore, maxScore, fk_scenario);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/scorefk/:fk_scenario', async (req, res, next) => {
    try{
        var currentScore = req.body.currentScore;
        var maxScore = req.body.maxScore;
        let results = await db.editOneScoreWithFK(req.params.fk_scenario, currentScore, maxScore);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.get('/api/scorefk/:fk_scenario', async (req, res, next) => {
    try{
        let results = await db.readOneScoreFromFK(req.params.fk_scenario);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


//Team

router.get('/api/team/:name', async (req, res, next) => {
    try{
        let results = await db.readOneTeam(req.params.name);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.post('/api/team', async (req, res, next) => {
    try{
        var teamName = req.body.teamName;
        var date = req.body.date;
        let results = await db.insertTeam(teamName, date);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

//Scenario

router.get('/api/scenario/:fk_team', async (req, res, next) => {
    try{
        let results = await db.readAllScenarioWithFk(req.params.fk_team);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.post('/api/scenario', async (req, res, next) => {
    try{
        var fk_team = req.body.fk_team;
        let results = await db.insertScenario(fk_team);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


//Orderss

router.get('/api/orderssabs', async (req, res, next) => {
    try{
        let results = await db.readAllOrderssAbs();
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


router.get('/api/orderss/:fk_scenario', async (req, res, next) => {
    try{
        let results = await db.readAllOrderss(req.params.fk_scenario);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.get('/api/orders/:id', async (req, res, next) => {
    try{
        let results = await db.readOneOrders(req.params.id);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.get('/api/orders/:name/:fk_scenario', async (req, res, next) => {
    try{
        let results = await db.readOneOrdersIdFromNameAndScenarioFk(req.params.name, req.params.fk_scenario);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.post('/api/orders', async (req, res, next) => {
    try{
        var name = req.body.name;
        var expFinishTime = req.body.expFinishTime;
        var fk_scenario = req.body.fk_scenario;
        let results = await db.insertOneOrders(name, expFinishTime, fk_scenario);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/starttime/:id', async (req, res, next) => {
    try{
        var startTime = req.body.startTime;
        var isStarted = req.body.isStarted;
        let results = await db.updateOneOrdersStartTime(req.params.id, startTime, isStarted);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/endtime/:id', async (req, res, next) => {
    try{
        var endTime = req.body.endTime;
        var isEnded = req.body.isEnded;
        var finishTime = req.body.finishTime;
        let results = await db.updateOneOrdersEndTime(req.params.id, endTime, isEnded, finishTime);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/usedtime/:id', async (req, res, next) => {
    try{
        var usedTime = req.body.usedTime;
        let results = await db.updateOneOrdersUsedTime(req.params.id, usedTime);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/processfail/:id', async (req, res, next) => {
    try{
        var processFails = req.body.processFails;
        let results = await db.updateOneOrdersProcessFail(req.params.id, processFails);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/qualityfail/:id', async (req, res, next) => {
    try{
        var qualityFails = req.body.qualityFails;
        let results = await db.updateOneOrdersQualityFail(req.params.id, qualityFails);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/pauseduration/:id', async (req, res, next) => {
    try{
        var pauseDuration = req.body.pauseDuration;
        let results = await db.updateOneOrdersPauseDuration(req.params.id, pauseDuration);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/usedtimewithpauses/:id', async (req, res, next) => {
    try{
        var usedTimeWithPauses = req.body.usedTimeWithPauses;
        let results = await db.updateOneOrdersUsedTimeWithPauses(req.params.id, usedTimeWithPauses);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/finishround/:id', async (req, res, next) => {
    try{
        var finishRound = req.body.finishRound;
        let results = await db.updateOneOrdersFinishRound(req.params.id, finishRound);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/finishtimediff/:id', async (req, res, next) => {
    try{
        var finishTimeDiff = req.body.finishTimeDiff;
        let results = await db.updateOneOrdersFinishTimeDiff(req.params.id, finishTimeDiff);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/orders/thisscore/:id', async (req, res, next) => {
    try{
        var thisScore = req.body.thisScore;
        let results = await db.updateOneOrdersThisScore(req.params.id, thisScore);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

//OrdersProducts

router.post('/api/ordersproduct', async (req, res, next) => {
    try{
        var amount = req.body.amount;
        var fk_orders = req.body.fk_orders;
        var fk_product = req.body.fk_product;
        let results = await db.insertOneOrdersProduct(amount, fk_orders, fk_product);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.get('/api/ordersproduct/:fk_orders', async (req, res, next) => {
    try{
        let results = await db.readOPFromFk(req.params.fk_orders);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

//Products

router.get('/api/product/:id', async (req, res, next) => {
    try{
        let results = await db.readProductsFromID(req.params.id);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


//PAUSE
router.get('/api/pause/:id', async (req, res, next) => {
    try{
        let results = await db.readOnePause(req.params.id);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.get('/api/pauseid', async (req, res, next) => {
    try{
        let results = await db.readLastPauseId();
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.post('/api/pausestart', async (req, res, next) => {
    try{
        var pauseStartTime = req.body.pauseStartTime;
        let results = await db.insertPauseStart(pauseStartTime);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/pauseend/:id', async (req, res, next) => {
    try{
        var pauseEndTime = req.body.pauseEndTime;
        var pauseDuration = req.body.pauseDuration;
        let results = await db.updatePauseEnd(req.params.id, pauseEndTime, pauseDuration);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


//Timer functions

var isTimeStartet = false;

var timeObject = 
    {
    isPaused: true,
    timeBeforePause:0,
    date: null,
    phase: 0
    }

//get timeobject
router.get('/returntime', function(req,res,next){
    res.send(timeObject);
});

//set date in timeobject (start timer)
router.get('/starttimer', function(req,res,next){
    if(isTimeStartet == false && timeObject.isPaused == true){
        timeObject.date = new Date().getTime();
        isTimeStartet = true;
        timeObject.isPaused = false;
        timeObject.phase = timeObject.phase + 1;

    }else if(isTimeStartet == true && timeObject.isPaused == true){
        timeObject.date = new Date().getTime();
        timeObject.isPaused = false;
        timeObject.phase = timeObject.phase + 1;

    }
    res.send(timeObject);
});

//set delta to seconds passed since startet time and set new date in timeObject (pause timer)
router.get('/pausetimer', function(req,res,next){
    if(isTimeStartet == true && timeObject.isPaused == false){
        timeObject.timeBeforePause = timeObject.timeBeforePause + (((new Date).getTime() - timeObject.date) / 1000);
        timeObject.isPaused = true;
    }
    res.send(timeObject);
});

//reset the timeObject (reset timer)
router.get('/resettimer', function(req,res,next){
    timeObject.isPaused = true;
    timeObject.timeBeforePause = 0;
    timeObject.date = null;
    isTimeStartet = false;
    timeObject.phase = 0;

    res.send(timeObject);
});

//Date from db

router.post('/api/time', async (req, res, next) => {
    try{
        var startTime = req.body.startTime;
        let results = await db.insertStartTime(startTime);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});

router.put('/api/time/:id', async (req, res, next) => {
    try{
        var startTime = req.body.startTime;
        let results = await db.editOne(req.params.id, startTime);
        res.json(results);
    } catch(e){
        console.log(e)
        res.sendStatus(500);
    }
});


//keep track of team id and scenario id

var currentIDs = 
    {
    teamID: 0,
    scenarioID: 0
    }

    router.get('/returnids', function(req,res,next){
        res.send(currentIDs);
    });

    router.get('/setteamid/:id', function(req,res,next){
        currentIDs.teamID = req.params.id
    
        res.send(currentIDs);
    });

    router.get('/setscenarioid/:id', function(req,res,next){
        currentIDs.scenarioID = req.params.id
    
        res.send(currentIDs);
    });


    var currentPreset = {
        preset:null
    };

    router.get('/setcurrentpreset/:preset', function(req,res,next){
        currentPreset.preset = req.params.preset;

        res.send(currentPreset);
    });

    router.get('/returncurrentpreset', function(req,res,next){
        res.send(currentPreset);
    });


module.exports = router;