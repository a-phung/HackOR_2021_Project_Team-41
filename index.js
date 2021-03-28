var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));
// app.use('/about-vaccine', require('./about-vaccine.js'));
app.use('/local-info', require('./local-info.js'));


app.set('port', 30000);

app.get('/', (req, res) => {
  res.render('homepage', {
    title: 'Home',
    style: 'homepage.css',
    page: 'homepage'});
});

app.get('/local-info', (req, res) => {
  res.render('local-info', {
    title: 'Local Information',
    style: 'local-info.css',
    page: 'local-info'});
});


app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });
  
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});

  
app.listen(process.env.PORT || app.get('port'), function(){
    console.log(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate`);
});

