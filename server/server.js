const express = require('express'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const mysql = require('mysql2'); 
const path = require('path'); 
const bcrypt = require("bcrypt");

const app = express(); 
const port = 8000; 

app.use(cors()); // CORS 설정을 추가합니다.
app.use(bodyParser.json()); // JSON 형식의 요청 본문을 파싱합니다.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const connection = mysql.createConnection({
  // 데이터베이스에 연결합니다.
  host: "localhost",
  user: "root",
  password: "1234",
  database: "cinema_db",
  port: 3306,
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
app.post('/login', (req, res) => {
  const { email, password, usertype } = req.body;
  console.log(email)
  console.log(password)

  // MySQL 쿼리 실행
  const sql = `SELECT * FROM user WHERE email = ? AND password = ?`;
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('로그인 오류: ' + err.stack);
      res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.' });
      return;
    }

    if (results.length > 0) {
      // 로그인 성공
      res.status(200).json({ success: true, data: results });
    } else {
      // 로그인 실패
      res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }
  });
});

// -----------------------------------240625 kth login 파트 -------------------------------------------------

app.get("/signup", (req, res) => {
  const sqlQuery = "SELECT * FROM movie.signup;";
  connection.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server running on port ${port}`); 
});