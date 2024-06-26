const express = require('express'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const mysql = require('mysql2'); 
const path = require('path'); 

const app = express(); 
const port = 5000; 

app.use(cors()); // CORS 설정을 추가합니다.
app.use(bodyParser.json()); // JSON 형식의 요청 본문을 파싱합니다.

const db = mysql.createConnection({ 
  host: '127.0.0.1', 
  user: 'root', 
  password: '1234', 
  database: 'cinema_db' 
});

db.connect(err => { 
  if (err) {
    console.error('DB connection failed:', err.stack); 
    return;
  }
  console.log('DB connected'); // 데이터베이스 연결 성공 시 메시지 출력
});

// 예약 목록을 가져오는 엔드포인트
app.get('/reservations', (req, res) => {
  const query = 'SELECT * FROM 예약'; 
  db.query(query, (err, results) => {
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
    const [movieRows] = await db.promise().query('SELECT id FROM movie WHERE name = ?', [selectedMovie]);
    console.log('Movie Rows:', movieRows); 
    if (movieRows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' }); // 영화가 존재하지 않는 경우 404 상태 코드와 에러 메시지 반환
    }
    const 영화고유번호 = movieRows[0].id;

    const [timetableRows] = await db.promise().query('SELECT 타임테이블번호 FROM 영화상영시간 WHERE 영화고유번호 = ? AND DATE(상영시간) = ?', [영화고유번호, selectedDate]);
    console.log('Timetable Rows:', timetableRows); 
    if (timetableRows.length === 0) {
      return res.status(404).json({ error: 'Timetable not found for the selected date' }); // 상영시간표가 존재하지 않는 경우 404 상태 코드와 에러 메시지 반환
    }
    const 타임테이블번호 = timetableRows[0].타임테이블번호;

    const seatIdsPromises = selectedSeats.map(seat => {
      const 열좌표 = seat[0]; 
      const 행좌표 = seat.slice(1); 
      return db.promise().query('SELECT 좌석고유번호 FROM 좌석정보 WHERE `열 좌표` = ? AND `행 좌표` = ?', [열좌표, 행좌표]);
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
      await db.promise().query('INSERT INTO 예약 (좌석고유번호, 영화고유번호, 타임테이블번호, 예약시간, 생성시간) VALUES (?, ?, ?, ?, NOW())', [좌석고유번호, 영화고유번호, 타임테이블번호, 예약시간]);
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
  const [seats] = await db.promise().query(query, [id, date, time]); 

  console.log(seats);
  return res.send(seats); // 예약된 좌석 목록 반환
});

// 영화 목록을 가져오는 엔드포인트
app.get('/movie', (req, res) => {
  const query = 'SELECT * FROM movie'; 
  db.query(query, (err, results) => {
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

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on port ${port}`); 
});
