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

const connection = mysql.createConnection({ // 데이터베이스에 연결합니다.
  host: "localhost",
  user: "root",
  password: "1234",
  database: "movie",
  port: 3306,
});


// -----------------------------------240625 kwj signup 파트 ------------------------------------------------
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

// -----------------------------------240625 kwj signup 파트 ------------------------------------------------

// -----------------------------------240625 kth login 파트 -------------------------------------------------

// 로그인 처리 API
app.post("/login", (req, res) => {
  const { email, password, usertype } = req.body;
  console.log(email)
  console.log(password)

  try {
    // 이메일을 사용하여 데이터베이스에서 사용자를 찾습니다.
    connection.query(
      "SELECT * FROM signup WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.error("서버에서 에러 발생:", err);
          res.status(500).send({ success: false, message: "서버 에러 발생" });
        } else {
          if (result.length > 0) {  // 사용자가 존재하면
            const isPasswordMatch = await bcrypt.compare(
              password,
              result[0].password
            );
            if (isPasswordMatch && usertype == result[0].usertype) {
              if (!req.session) {
                req.session = {};
              }
              req.session.usertype = result[0].usertype; 
              req.session.userid = result[0].userid; 

              res.send({ success: true, message: "로그인 성공", data: result });
            } else {
              res.send({
                success: false,
                message: "정보가 일치하지 않습니다.",
              });
            }
          } else {
            res.send({ success: false, message: "유저 정보가 없습니다." });
          }
        }
      }
    );
  } catch (error) {
    console.error("비밀번호 비교 중 오류:", error);
    res.status(500).send({ success: false, message: "서버 에러 발생" });
  }
});

// -----------------------------------240625 kth login 파트 -------------------------------------------------


// -----------------------------------240627 예매내역 호출 ---------------------------------------------------
// 사용자의 예매 내역을 가져오는 API
app.get("/orders", (req, res) => {
  const { userId } = req.query;
  
  const sql = "SELECT * FROM orders WHERE userId = ?";
  connection.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('예매 내역 조회 중 오류:', err);
          return res.status(500).json({ success: false, message: '예매 내역 조회 중 오류가 발생했습니다.' });
      }
      return res.status(200).json({ success: true, data: results });
  });
});
// -----------------------------------240627 kth 예매내역 호출 ------------------------------------------------

// -----------------------------------240627 kth 로그인된 계정 탈퇴(삭제) --------------------------------------
// 사용자 탈퇴(삭제) API
app.delete("/deleteAccount", (req, res) => {
  const { userId } = req.body;

  // DELETE 쿼리를 실행하여 사용자 계정 삭제
  const sql = "DELETE FROM signup WHERE id = ?";
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('사용자 탈퇴 중 오류:', err);
      return res.status(500).json({ success: false, message: '사용자 탈퇴 중 오류가 발생했습니다.' });
    }
    return res.status(200).json({ success: true, message: '사용자 탈퇴 완료' });
  });
});

// -----------------------------------240627 kth 로그인된 계정 탈퇴(삭제)  ---------------------------------

// -----------------------------------240627 kth 회원정보 수정  ---------------------------------
// 회원 정보 수정 API
app.put("/Userinfoupdate", async (req, res) => {
  const { username, password, address, detailaddress, phonenumber, userid} =
    req.body;

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "UPDATE signup SET username = ?, password = ?, address = ?, detailaddress = ?, phonenumber = ? where id = ?";
    connection.query(
      sql,
      [username, hashedPassword, address, detailaddress, phonenumber, userid],
      (err, result) => {
        if (err) {
          console.error("MySQL에서 데이터 수정 중 오류:", err);
          return res.status(500).json({
            success: false,
            message: "회원 정보 수정 중 오류가 발생했습니다.",
            error: err.message,
          });
        }

        if (result.affectedRows > 0) {
          // 수정 성공
          console.log("사용자 정보가 성공적으로 수정되었습니다.");
          return res.status(200).json({
            success: true,
            message: "사용자 정보가 성공적으로 수정되었습니다.",
          });
        } else {
          // 이메일에 해당하는 사용자가 없는 경우
          console.log("해당 이메일을 가진 사용자가 없습니다.");
          return res.status(404).json({
            success: false,
            message: "해당 이메일을 가진 사용자가 없습니다.",
          });
        }
      }
    );
  } catch (error) {
    console.error("회원 정보 수정 중 오류:", error);
    return res.status(500).json({
      success: false,
      message: "내부 서버 오류",
      details: error.message,
    });
  }
});

// -----------------------------------240627 kth 회원정보 수정  ---------------------------------
app.get("/getUserInfo", (req, res) => {
  const userid = req.params
  const sqlQuery = "Select * from movie.signup where =userid;";

  connection.query(sqlQuery, [userid], (err, result) => {
    res.send(result)
  })
})
app.get("/signup", (req, res) => {
  const sqlQuery = "SELECT * FROM movie.signup;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log("서버 구동");
});
