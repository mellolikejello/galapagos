var compression = require('compression');
var express = require('express');
var path = require('path');
var url = require('url');

var server;
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use(express.static(path.resolve(__dirname)));
app.use(compression());

var home = function(req, res) {
	res.render('index.html');
}

var router = function(app) {
    app.get('/', home);
};

router(app);

server = app.listen(port, function(err) {
    if(err) {
        throw err;
    }
    console.log('Listening on port ' + port);
});


