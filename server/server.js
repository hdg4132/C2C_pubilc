const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const path = require("path");
const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname)));

const connection = mysql.createConnection({
  // 데이터베이스에 연결합니다.
  host: "localhost",
  user: "root",
  password: "1234",
  database: "movie",
  port: 3306,
});

// MySQL 연결

connection.connect((err) => {
  if (err) {
    console.error(" MySQL 접속에러: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

// -----------------------------------240626 kwj signup 파트 ------------------------------------------------

const usedUserNumbers = new Set(); // 중복 방지를 위한 Set

async function generateUserid(usertype) {
  const prefix = {
    personal: 1,
  }[usertype];

  do {
    randomDigits = Math.floor(10000 + Math.random() * 90000);
    id = `${prefix}${randomDigits}`;
  } while (usedUserNumbers.has(id)); // 중복된 userid가 있다면 다시 생성

  usedUserNumbers.add(id); // Set에 추가
  return id;
}

//-------------------------------이메일 중복 체크 ---------------------------------

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

//---------------------------회원가입 기능구현----------------------------------------------

app.post("/signup", async (req, res) => {
  // 클라이언트에서 받은 요청의 body에서 필요한 정보를 추출합니다.
  const {
    username,
    password,
    email,
    address,
    detailaddress,
    phonenumber,
    usertype: clientUsertype,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await generateUserid(clientUsertype);
    const usertypeNumber = {
      personal: 1,
    };

    const serverUsertype = usertypeNumber[clientUsertype];

    const sql =
      "INSERT INTO signup (id, username, email, password, address, detailaddress, phonenumber, usertype) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(
      sql,
      [
        id,
        username,
        email,
        hashedPassword,
        address,
        detailaddress,
        phonenumber,
        serverUsertype,
      ],
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

// -----------------------------------240626 kwj signup 파트 ------------------------------------------------

app.get("/signup", (req, res) => {
  const sqlQuery = "SELECT * FROM movie.signup;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("서버 구동");
});
