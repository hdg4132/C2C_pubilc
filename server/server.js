const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const mysqlPromise = require("mysql2/promise");
const bodyParser = require('body-parser'); 
const path = require('path'); 
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require('fs');

const app = express(); 
const port = 8000; 

app.use(cors()); // CORS 설정을 추가합니다.
app.use(bodyParser.json()); // JSON 형식의 요청 본문을 파싱합니다.
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
connection.connect(err => { 
  if (err) {
    console.error('DB connection failed:', err.stack); 
    return;
  }
  console.log('DB connected'); // 데이터베이스 연결 성공 시 메시지 출력
});

// 예약 목록을 가져오는 엔드포인트
app.get('/reservations', (req, res) => {
  const query = 'SELECT * FROM 예약'; 
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
    }
    res.json(results); // 결과를 JSON 형식으로 반환
  });
});

// 새로운 예약을 생성하는 엔드포인트
app.post('/reservations', async (req, res) => {
  const { selectedMovie, selectedDate, selectedTime, selectedSeats } = req.body; 
  console.log('Reservation Request:', req.body); // 예약 요청 데이터 로그 출력

  try {
    console.log('Selected Movie:', selectedMovie); 
    const [movieRows] = await connection.promise().query('SELECT id FROM movie WHERE name = ?', [selectedMovie]);
    console.log('Movie Rows:', movieRows); 
    if (movieRows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' }); // 영화가 존재하지 않는 경우 404 상태 코드와 에러 메시지 반환
    }
    const 영화고유번호 = movieRows[0].id;

    const [timetableRows] = await connection.promise().query('SELECT 타임테이블번호 FROM 영화상영시간 WHERE 영화고유번호 = ? AND DATE(상영시간) = ?', [영화고유번호, selectedDate]);
    console.log('Timetable Rows:', timetableRows); 
    if (timetableRows.length === 0) {
      return res.status(404).json({ error: 'Timetable not found for the selected date' }); // 상영시간표가 존재하지 않는 경우 404 상태 코드와 에러 메시지 반환
    }
    const 타임테이블번호 = timetableRows[0].타임테이블번호;

    const seatIdsPromises = selectedSeats.map(seat => {
      const 열좌표 = seat[0]; 
      const 행좌표 = seat.slice(1); 
      return connection.promise().query('SELECT 좌석고유번호 FROM 좌석정보 WHERE `열 좌표` = ? AND `행 좌표` = ?', [열좌표, 행좌표]);
    });
    const seatIdsResults = await Promise.all(seatIdsPromises);
    const 좌석고유번호들 = seatIdsResults.map(result => {
      if (result.length === 0 || result[0].length === 0) {
        throw new Error(`Seat not found: ${result}`); // 좌석이 존재하지 않는 경우 에러 발생
      }
      return result[0][0].좌석고유번호; 
    });

    for (const 좌석고유번호 of 좌석고유번호들) {
      const 예약시간 = new Date().toISOString().slice(0, 19).replace('T', ' '); 
      await connection.promise().query('INSERT INTO 예약 (좌석고유번호, 영화고유번호, 타임테이블번호, 예약시간, 생성시간) VALUES (?, ?, ?, ?, NOW())', [좌석고유번호, 영화고유번호, 타임테이블번호, 예약시간]);
    }

    res.status(201).json({ message: 'Reservations created successfully' }); // 예약 생성 성공 시 201 상태 코드와 성공 메시지 반환
  } catch (err) {
    console.error('Error inserting reservation:', err.message); 
    res.status(500).send({ error: err.message }); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
  }
});

// 특정 영화의 특정 날짜 및 시간에 대한 예약된 좌석 목록을 가져오는 엔드포인트
app.get("/seat", async (req, res) => {
  const id = req.query.id; 
  const date = req.query.date; 
  const time = req.query.time; 
  console.log(id);
  console.log(date);
  console.log(time);

  const query = 'SELECT seat FROM orders where (movieId = ? and date = ? and time = ?)'; 
  const [seats] = await connection.promise().query(query, [id, date, time]); 

  console.log(seats);
  return res.send(seats); // 예약된 좌석 목록 반환
});

// 영화 목록을 가져오는 엔드포인트
app.get('/movie', (req, res) => {
  const query = 'SELECT * FROM movie'; 
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err); // 에러 발생 시 500 상태 코드와 에러 메시지 반환
    }
  
    results.forEach(movie => {
      const imageName = movie.thumbnail.split('/').pop(); 
      movie.thumbnail = `http://localhost:${port}/images/${imageName}`; // 썸네일 URL을 완전한 경로로 변경
    });
    res.json(results); // 결과를 JSON 형식으로 반환
  });
});

// 정적 파일 제공을 위한 미들웨어 설정
app.use('/images', express.static(path.join(__dirname, 'images'))); 

// 루트 엔드포인트
app.get('/', (req, res) => {
  res.send('Welcome to the Cinema Booking API'); 
});

// -----------------------------------240625 kwj signup 파트 ------------------------------------------------
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

connection.connect((err) => {
  if (err) {
    console.error(" MySQL 접속에러: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
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
            if (isPasswordMatch) {
              if (!req.session) {
                req.session = {};
              }
              req.session.usertype = result[0].usertype; 
              req.session.userid = result[0].id; 

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
                <img src="${article.imageURL}" 
                  width: 208px;
                  height: 297px; 
                  alt="포스터">
                <h2 style="font-size:25px; color:blue;">${article.movieName}</h2>
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


//-----------------------------------sjh 게시판 글쓰기-----------------------------------

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, cb) {
    cb(null, "imgfile" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  // limits: { fileSize: 1000000 } // 파일 최대 용량
});



app.get('/board_movie', (req, res) => { //영화 게시판 목록 불러오기
  const sql = 'SELECT * FROM board_movie';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.post('/board_movie/write', upload.single('img'), (req, res) => { //영화 게시판 글쓰기
  const { title, movie_status, content, user_id } = req.body;
  const img = req.file ? req.file.filename : null;

  console.log({ title, movie_status, content } +',...'+ req.file.filename)

  const sql = 'INSERT INTO board_movie (title, movie_status, img, content, user_id) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [title, movie_status, img, content, user_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json({ id: results.insertId, title, movie_status, img, content, user_id});
  });
});

app.get('/board_movie/post/:id', (req, res) => { //영화게시판 게시글 상세페이지
  const postId = req.params.id;
  const sql = 'SELECT * FROM board_movie WHERE id = ?';
  connection.query(sql, [postId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send('Post not found');
    }
    res.json(results[0]);
  });
});



app.post('/board_movie/edit/:id', upload.single('img'), (req, res) => { //영화 게시판 수정
  const { id } = req.params;
  const { title, movie_status, content } = req.body;
  const img = req.file ? req.file.filename : req.body.existingImg; // 이미지 교체 시 replace

  const sql = 'UPDATE board_movie SET title = ?, movie_status = ?, img = ?, content = ? WHERE id = ?';
  connection.query(sql, [title, movie_status, img, content, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if(req.file){
      fs.unlink(`${__dirname}/uploads/${req.body.existingImg}`, function(err) {
       
        res.status(200).json({ id, title, movie_status, img, content });
      }) 
    }
  });
});

app.post("/board_movie/post/delete", (req, res) => {//영화게시판 게시글 삭제
  const { id, img } = req.body;
  // const value = [id];
  console.log(req.body)
  const sqlQuery = "DELETE FROM board_movie WHERE id = ?";
  connection.query(sqlQuery, id, (err, result) => {
    if (err) {
      console.error("에러", err);
      res.status(500).send("서버에러");
    } else {
      fs.unlink(`${__dirname}/uploads/${img}`, function(err) {

        res.json({isDeleted:"true"});
      })
    }
    
  });
})

//-----------------------------------//sjh 게시판 글쓰기-----------------------------------


app.listen(port, () => {
  console.log(`Server running on port ${port}`); 
});