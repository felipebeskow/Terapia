const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

consign().include('routes').into(app);

app.get('/', (req, res)=>{

    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end(`
        <!DOCTYPE html>
        <html lang="pt-br">
            <head>
                <meta charset="utf-8">
                <tittle>API Terapia</tittle>
            </head>
            <body>
                <pre>Bem vindo à API Terapia.<br>Escrita em Javascript e rodando sobre o Node.JS.<br>Usufrua dela com responsabilidade</pre>
            </body>
        </html>
    `);

});

app.listen(3000, '127.0.0.1', ()=>{
    console.log("Tô vivo!");
})