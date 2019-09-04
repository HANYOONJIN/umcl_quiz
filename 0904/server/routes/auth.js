import express from "express";
import conn from "../db/mysql.js";
import bkfd2Password from 'pbkdf2-password';
import nodemailer from 'nodemailer';

const hasher = bkfd2Password();
const router = express.Router();

router.post("/new", (req, res) => {
  console.log(req.body);

  //let usernameRegex = /^[a-z0-9]+$/;
    let usernameRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    if(!usernameRegex.test(req.body.username)) {
        return res.status(400).json({ // HTTP 요청에 대한 리스폰스 (json 형식으로)
            error: "BAD USERNAME",
            code: 1
        });
    }
 
    // CHECK PASS LENGTH
    // 비밀번호 유형 검사 (4보다 작거나, 들어온 비밀번호의 값이 문자열이 아닐 경우)
    if(req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

  const username = req.body.username;
  const password = req.body.password;
  const number = Math.floor(Math.random() * 10000);
  const bool = 'true';


  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rlawjddus11111@gmail.com',  // gmail 계정 아이디를 입력
        pass: 'rlawjddus1'          // gmail 계정의 비밀번호를 입력
    }
  });


  let mailOptions = {
      from: 'rlawjddus11111@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: username ,                     // 수신 메일 주소
      subject: '안녕하세요 HYJ입니다. 인증해주세요!',   // 제목
      html: '<p>아래의 숫자를 입력해주세요.</p>' +
            "<a href='http://localhost:3000/api/auth/mailcheck?email="+ username +"&token="+ number +"'>인증하기</a>" // 내용
  };

  let sql = "SELECT * FROM register WHERE email=?";
  let post = [username];
  conn.query(sql, post, (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "BAD PASSWORD"
     });
    } else {
        console.log(post);
      if (results.length === 0) {
        hasher({password}, function(err, pass, salt, hash){
        let sql = "INSERT INTO register (email, pass, salt, token, disable) VALUES(?,?,?,?,?)";
        let post = [username, hash, salt, number, bool];
        conn.query(sql, post, (err, results, fields) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              error: "db error",
              code: 2
           });
          } else {
            console.log('이게성공이냐');
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  console.log(error);
              }
              else {
                  console.log('Email sent: ' + info.response);
              }
          });
            return res.status(200).json({
              success: true,
              error: null
            });
          }
        });
      });
      } else {
        console.log('뭐냐고');
        return res.status(400).json({
          error: "USERNAME EXISTS",
          code: 3
        });
      }
    }
  });
});

router.post("/login", (req, res) => {

   if(typeof req.body.password !== "string") {
      return res.status(405).json({
        error: "PASSWORD IS NOT STRING",
        code: 1
    });
   }
    const username = req.body.username;
    const password = req.body.password;

    let sql = "SELECT id, email, pass, salt FROM register WHERE email = ?";
    const post = [username];
    conn.query(sql, post, (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.status(401).json({
                error: "THERE IS NO USER",
                code: 2
            });
      } else {
        if (results.length === 0) {
          return res.status(401).json({
            error: "THERE IS NO USER",
            code: 2
        });
        }
        hasher({password, salt:results[0].salt}, function(err, pass, salt, hash){
        const user_password = results[0].pass;
        if (hash === user_password) {
          let session = req.session;
            session.loginInfo = {
                _id: results[0].id,
                username: results[0].email
            };
          return res.json({
            success: true,
            id : session.loginInfo._id
        });
        } else {
          return res.status(406).json({
            error: "PASSWORD IS NOT CORRECT",
            code: 3
        });
        }
      });
      }
    });
  });
  
  router.get('/getinfo', (req, res) => {
    if(typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: "THERE IS NO LOGIN DATA",
            code: 1
        });
    }
 
    console.log(req.session.loginInfo);
    return res.status(200).json({info: req.session.loginInfo});
  });

  router.post('/logout', (req, res) => {
    // req.session.destroy() 메소드로 세션을 파괴
    req.session.destroy(err => { if(err) throw err; });
    return res.json({ success: true });
});

  router.post("/mailer", (req, res) => {
    let email = req.body.email; 
    let number = req.body.number;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rlawjddus11111@gmail.com',  // gmail 계정 아이디를 입력
            pass: 'rlawjddus1'          // gmail 계정의 비밀번호를 입력
        }
    });


    let mailOptions = {
        from: 'rlawjddus11111@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: email ,                     // 수신 메일 주소
        subject: '안녕하세요 HYJ입니다. 인증해주세요!',   // 제목
        html: '<p>아래의 숫자를 입력해주세요.</p>' +
              "<a href='http://localhost:3000/auth/?email="+ email +"&token="+ number +"'>인증하기</a>" // 내용
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect("/");
  });

  router.get("/mailcheck", (req, res) => {
    let email = req.query.email;
    let token = req.query.token;

    let sql = "SELECT token FROM register WHERE email=?";
    let sql2 = "UPDATE register SET disable = 'false' where email=?";
    let post = [email];

    conn.query(sql, post, (err, results) => {
      if (err) throw err;

      if(results[0].token===token){
        conn.query(sql2, post, (err, results) => {
          if (err) throw err;
        });
      }
      
    });
    res.redirect("/");
    // token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현
  })

export default router;
