const Express = require('express');
const httpModule = require('http');

const app = Express();
const http = httpModule.Server(app);

const roomRouter = require('./src/routes/roomRouter');
app.use('/rooms', roomRouter);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on *:3000');
});

//Nodejs 奇怪的錯誤防止Process 死掉
process.on('uncaughtException', function (err) {
  console.log(err);
})