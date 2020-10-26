const express = require("express");
const apiRouter = require("./routes")
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static('dist/Move2x'));

app.use('/', apiRouter);

app.get('*', (req, res) => {
    // var options = {
    //     root: path.join(__dirname, 'dist/Move2x')
    // }
    // return res.sendfile('index.html', options);
    res.sendFile(__dirname + '/dist/Move2x/index.html');
});

var server = app.listen(process.env.PORT || '5000', () => {
    console.log(`Server is running on port: ${process.env.PORT || '5000'}`);
});

