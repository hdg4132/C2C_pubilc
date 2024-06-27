import React from 'react'; // React를 가져옴
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 도와주는 기능을 가져옴
import '../Ticket/Ticket.css'; // 스타일(디자인) 파일을 가져옴

const times = [ // 상영 시간을 배열로 만듬
  "14:10-16:32", "16:45-19:00", "19:30-21:45"
];

const TimeSelection = ({ onSelect, selectedTime }) => { // 상영 시간을 선택하는 컴포넌트를 만듬
  const navigate = useNavigate(); // 페이지 이동을 도와주는 함수를 사용

  return ( // 화면에 보여줄 내용을 작성하는 부분
    <div className="time-selection selection"> {/*상영 시간을 선택하는 영역*/}
      <h4>상영시간표</h4> {/*상영 시간표 제목*/}
      <ul className="time-slot"> {/*상영 시간 목록을 만드는 부분*/}
        {times.map((time, index) => ( // 배열에 있는 상영 시간을 하나씩 가져와서 화면에 표시
          <li
            key={index} // 각각의 시간을 구분하기 위한 고유 번호
            className={selectedTime === time ? 'selected' : ''} // 선택된 시간에는 'selected'라는 특별한 표시
            onClick={() => onSelect(time)} // 시간을 클릭하면 선택된 시간으로 설정
          >
            <span className="time-text">{time}</span><br /> {/*상영 시간을 보여줌*/}
            <span>43석 / 48석</span> {/*남은 좌석 수를 보여줌*/}
          </li>
        ))}
      </ul>
      <div className="choose"> {/*좌석 선택 버튼을 넣는 부분*/}
        <button
          className="select-seat" // 좌석 선택 버튼
          style={{ display: selectedTime ? 'block' : 'none' }} // 시간이 선택된 경우에만 버튼이 보임
          onClick={() => navigate('/seat-booking')} // 버튼을 클릭하면 좌석 선택 페이지로 이동시킴
        >
          좌석 <br />선택하기
        </button>
      </div>
    </div>
  );
};

export default TimeSelection; // TimeSelection 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게 함
