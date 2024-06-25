const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const mysqlPromise = require("mysql2/promise");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const dotenv = require("dotenv");

const path = require("path");
const app = express();
const port = 8000;

// URL 인코딩된 데이터를 해석하는 미들웨어를 설정합니다.
app.use(express.urlencoded({ extended: true }));
// JSON 데이터를 해석하는 미들웨어를 설정합니다.
app.use(express.json());
// CORS 설정을 추가합니다. 클라이언트 측 URL을 허용합니다.
app.use(cors());

// 환경변수 설정 파일을 불러옵니다.
dotenv.config();

// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname + '/public')));

// 환경변수에서 데이터베이스 연결 정보를 가져옵니다.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// 데이터베이스에 연결합니다. 단일 연결을 생성하고 간단한 작업수행
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: true
});

// 프로미스를 지원하는 데이터베이스 연결 풀을 생성합니다. 프로미스 기반 비동기 처리
const PromiseConnection = mysqlPromise.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: true
});

// MySQL 연결
connection.connect((err) => {
  if (err) {
    console.error(" MySQL 접속에러: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.post("/checkEmailDuplication", (req, res) => {
  const { email } = req.body;

  // 데이터베이스에서 이메일이 이미 존재하는지 확인합니다.
  const sql = "SELECT * FROM signup WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) {
      console.error("MySQL에서 이메일 중복 확인 중 오류:", err);
      return res.status(500).json({
        success: false,
        message: "이메일 중복 확인 중 오류가 발생했습니다.",
        error: err.message,
      });
    }

    if (result.length > 0) {
      // 이미 등록된 이메일인 경우
      return res.status(200).json({
        success: false,
        message: "이미 등록된 이메일입니다.",
      });
    } else {
      // 중복되지 않은 이메일인 경우
      return res.status(200).json({
        success: true,
        message: "사용 가능한 이메일입니다.",
      });
    }
  });
});

connection.connect((err) => {
  if (err) {
    console.error(" MySQL 접속에러: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});


app.post("/signup", async (req, res) => {
  // 클라이언트에서 받은 요청의 body에서 필요한 정보를 추출합니다.
  const { username, password, email, address, detailaddress, phonenumber } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO signup (username, email, password, address, detailaddress, phonenumber) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [username, email, hashedPassword, address, detailaddress, phonenumber],
      (err, result) => {
        if (err) {
          // 쿼리 실행 중 에러가 발생한 경우 에러를 처리합니다.
          console.error("MySQL에 데이터 삽입 중 오류:", err);
          return res.status(500).json({
            success: false,
            message: "회원가입 중 오류가 발생했습니다.",
            error: err.message,
          });
        }
        // 회원가입이 성공한 경우 응답을 클라이언트에게 보냅니다.
        console.log("사용자가 성공적으로 등록됨");
        return res.status(200).json({
          success: true,
          message: "사용자가 성공적으로 등록됨",
        });
      }
    );
  } catch (error) {
    // 회원가입 중 다른 내부적인 오류가 발생한 경우 에러를 처리합니다.
    console.error("회원가입 중 오류:", error);
    return res.status(500).json({
      success: false,
      message: "내부 서버 오류",
      details: error.message,
    });
  }
});

app.get("/signup", (req, res) => {
  const sqlQuery = "SELECT * FROM movie.signup;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//--------------------------------------------------hms ticket 파트-----------------------------------------------------------//
app.post("/reqOrder", async (req, res, next) => {
  try {
    const {orderSheet} = req.body;
    console.log(orderSheet)

    // order 테이블 추가 쿼리
    const insertQuery =
      "INSERT INTO orders(orderNumber, userId, movieId, date, time, orderName, emailInfo, phoneNumber, seat, totalCount, totalAmount, payment, imageURL) VALUES (?)";

    orderSheet.map(async (article) => {
      const data = [
        article.orderNumber,
        article.userId,
        article.id,
        article.date,
        article.time,
        article.name,
        article.emailInfo,
        article.phoneNumber,
        article.seat,
        article.totalCount,
        article.totalAmount,
        article.payment,
        article.imageURL,
      ];

      await PromiseConnection.query(insertQuery, [data]);
      // await console.log(data);
      // nodemailer 셋업과정입니다
      // node.js 라이브러리로 데이터, 혹은 메세지를
      // 해당 서비스제공자 이메일로 전송하는 패키지
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // smtp 서비스 제공자가 보안 연결(TLS) 요구할때
        auth: {
          user: "hdg4132@gmail.com",
          pass: "ootq oopr aary zjla",
        },
      });
      
      // 이메일에 들어갈 컨텐츠
      const htmlContent = `
      <div>
        <header id="header"></header>
        <div>
          <div>
            <div className="banner">
              <img src="https://ifh.cc/g/LRgfdL.png" 
              width="900px"
              height="250px" 
              alt="배너">
            </div>
            <div>
              <div className="complete-body-head">
                <h1>예매완료</h1>
              </div>
              <div className="complete-body">
                <h3>예매가 완료 되셨습니다</h3>
                <p> 예매 감사드립니다 <p style="font-size:20px; color:blue;">${article.date}일 ${article.time}시</p></p>
                <p> <p style="font-size:20px; color:blue;">${article.seat}석</p> 예매되셨습니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>`

      // 이메일 전송 정보
      const mailOptions = {
        from: "hdg4132@gmail.com", //보내는 사람 메일주소
        to: article.emailInfo, // 받는사람 메일주소
        subject: "예매되셨습니다", //메일제목
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("이메일 전송 에러났어요", error);
        } else {
          console.log("이메일이 전송되었습니다", info.response);
        }
      });
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//--------------------------------------------------/hms ticket 파트-----------------------------------------------------------//

app.listen(port, () => {
  console.log("서버 구동");
});
