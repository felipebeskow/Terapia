var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const consign = require("consign");
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var terapia = require('./routes/terapia');

var app = express();

app.config = JSON.parse(fs.readFileSync('config.json','utf-8'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
    if ( app.config.https && ((req.headers["x-forwarded-proto"] || "").endsWith("http"))) //Checa se o protocolo informado nos headers é HTTP
        res.redirect(`https://${req.hostname}${req.url}`); //Redireciona pra HTTPS
    else //Se a requisição já é HTTPS
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/app', terapia);

app.auth = function(xmlhttprequest,req,res,f) {
  let ajax = new XMLHttpRequest();
  let message = '';
  let passou = false;

  ajax.open('PUT', app.config.host + '/lr');

  message = `_id=${req.body['_idLogin']}`;

  ajax.onload = e => {
    try{
      if( (JSON.parse(ajax.responseText)!=undefined) && (JSON.parse(ajax.responseText)['error']==undefined) ){
        passou = true;
        f();
      } else {
        console.log(req.body);
        res.status(400).json({
          'error': 'Login Negado'
        });                    
      }
    } catch(error) {
      console.error(error);
      res.status(400).json({
        'error': error,
        'ajax': ajax.responseText,
        'host': app.config.host,
        'passou': passou
      });
    }
  }

  ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  ajax.send(message);
};

app.authentic = (idLogin, resolve, reject) => {
  let ajax = new XMLHttpRequest();

  ajax.open('PUT', app.config.host + '/lr');

  ajax.onload = e => {
    try{
      if (JSON.parse(ajax.responseText)._id === idLogin){
        console.log("login aprovado");
        resolve();
      }
    } catch(error) {
      console.error(error);
      reject();
    }
  };
  ajax.onerror = () => {reject()};

  ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  ajax.send(`_id=${idLogin}`);
};

consign().include('apiRoutes').into(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
