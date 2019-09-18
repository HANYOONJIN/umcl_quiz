var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var mysql =  require('mysql');
var fs = require('fs');
const { exec } = require('child_process');
var template = require('./lib/template.js');
var auth = require('./lib/auth.js');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;


var client = mysql.createConnection({
    user: 'root',
    password: 'q1w2e3r4',
    database: 'facebooklogin'
});

var app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret : 'secret key',
    resave : false,
    saveUninitialized: true,
    store:new FileStore()
}));

passport.serializeUser(function(user, done){
    console.log('serializeUser', user);
    done(null, user[0].email);
});

passport.deserializeUser(function(email, done){
    User.findByid(email, function(error, user){
        done(error, user);
    })
});

var facebookCredentials = require('./config/facebook.json');
facebookCredentials.profileFields = ['id', 'email', 'name'];

passport.use(new FacebookStrategy(facebookCredentials,
    function(accessToken, refreshToken, profile, done) {
        var email = profile.emails[0].value;
        var facebookid = profile.id;
        var name = profile.name.familyName + profile.name.givenName;

        //console.log('email',email);
        //console.log('facebookid',facebookid);
        //console.log('name',name);

        client.query('SELECT * FROM user where email = ?', [email], function(error, data){
            if(data.length == 0){
                client.query('INSERT INTO user(email, facebookid, name) VALUES (?, ?, ?)', [email, facebookid, name], function(error,data){
                console.log('Create Success!');
                done(null, data);  
            });
            }else{
                if(data[0].facebookid == facebookid){
                    return done(null, data);
                }
                else{
                    return done(null, false, {message: 'Incorrect facebookid'});
                }
            };
        });
    }
));

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope:'email' 
 }));
 
app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
    { successRedirect: '/',
      failureRedirect: '/auth/login'}
));
 

app.get('/', function(request, response){
    var html = template.html(auth.StatusUI(request,response));
        client.query('SELECT * FROM board', function(error, results){
            response.send(ejs.render(html, {
                html: results
        }))
    })
});

app.get('/delete/:number', function(request, response){
    if (!auth.IsOwner(request, response)) {
        response.send('<script>alert("회원인증이 되지 않은사용자입니다."); \
        location.href="/";</script>');

        return false;
    }else if(auth.IsOwner(request, response)){
        client.query('SELECT * FROM board where number = ? && email = ?', [request.param('number'), request.session.passport.user],function(error, data){
            if(data.length == 0){
                response.redirect('/');
            }
            else if(request.session.passport.user == data[0].email && data[0].number == request.param('number')){
                        client.query('DELETE FROM board WHERE number = ? && email = ?',[request.param('number'), data[0].email],function(){
                            response.redirect('/');
                    })
                }  
        })
    }
});

app.get('/insert', function(request, response){
    if (!auth.IsOwner(request, response)) {
        response.send('<script>alert("회원인증이 되지 않은사용자입니다."); \
        location.href="/";</script>');

        return false;
    }
    client.query('SELECT * FROM user where email = ?',[request.session.passport.user],function(error, results){
        fs.readFile('html/insert.html', 'utf8', function(error, data){
            response.send(ejs.render(data, {
                data: results[0]
            }))
        })
    })
});

app.post('/insert', function(request, response){
    var body = request.body;
    client.query('INSERT INTO board (email, title, content, input, output, exinput, exoutput, code) values (?, ?, ?, ?, ?, ?, ?, ?)', [body.email ,body.title, body.content, body.input, body.output, body.exinput, body.exoutput, body.code],function(){
        response.redirect('/');
        console.log('body.code:',body.code);
    });
});

app.get('/question/:number',function(request, response){
    client.query('SELECT * FROM board where number = ?',[request.param('number')], function(error, results){
        fs.readFile('html/inquestion.html', 'utf8', function(error, data){
            response.send(ejs.render(data, {
                data:results[0], completecode:' '
            }))
        })
    })
})

app.post('/question/:number',function(request, response){
    if (!auth.IsOwner(request, response)) {
        response.send('<script>alert("회원인증이 되지 않은사용자입니다."); \
        location.href="/";</script>');

        return false;
    }
    var data = request.body.code;
    var completecode;
  
    fs.writeFile('comfile.cpp', data, 'utf8', function(error){
      if(error){
        console.log(error);
      }
      exec('g++ -o comfile.exe comfile.cpp', (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return;
        }
        //gcc 컴파일러를 이용한 test.c를 컴파일 한 후 생겨난 test.exe파일을 실행
        exec('comfile.exe',(error, stdout) => {
            completecode = (String(stdout));
            client.query('SELECT * FROM board where number = ?',[request.param('number')], function(error, results){
                fs.readFile('html/inquestion.html', 'utf8', function(error, data){
                    response.send(ejs.render(data, {
                        data:results[0] ,completecode:completecode
                    }))
                })
                
                if(error){
                    console.log(error);
                }
                else{
                    //정답 여부 보류
                    if(completecode == results[0].exoutput){
                        console.log('Correct!');
                    }
                    else{
                        console.log('Wrong!');
                    }
                }
            })
        })
    })
    })
});


app.get('/logout', function(request,response){
    request.session.destroy(function(){
        response.redirect('/');
    }); 
});

app.listen(3000,function(){
    console.log('port on 3000!');
})