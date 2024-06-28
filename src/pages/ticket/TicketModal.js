import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './TicketModal.css'
import Checkbox from "../../components/CheckBox";
import MultiPayment from "../../components/MultiPayment";
import { getDayOfWeek } from "../../util/util";

export const TicketModal = () => {

  const Server_URL = process.env.REACT_APP_Server_Side_Address
  const { REACT_APP_PortOne_ChannelKey, REACT_APP_PortOne_Kakao_ChannelKey } = process.env;
  const [nameInfo, setNameInfo] = useState(); // input 태그의 이름 정보 상태 저장
  const [phoneNumberInfo, setPhoneNumberInfo] = useState(); // input 태그의 연락처 정보 상태 저장
  const [emailInfo, setEmailInfo] = useState(); // input 태그의 주소 정보 상태 저장

  const navigate = useNavigate();
  const location = useLocation(); // <Link> prop으로 전달 받은 데이터를 사용하기 위한 훅스

  const paymentMethods = [
    {
      paymentType: "카드 결제",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "CARD",
      paymentName: "카드 결제",
    },
    {
      paymentType: "실시간 계좌이체",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "TRANSFER",
      paymentName: "실시간 계좌이체",
    },
    {
      paymentType: "모바일 결제",
      channelKey: REACT_APP_PortOne_ChannelKey,
      payMethod: "MOBILE",
      paymentName: "모바일 결제",
    },
    {
      paymentType: "카카오 페이",
      channelKey: REACT_APP_PortOne_Kakao_ChannelKey,
      payMethod: "EASY_PAY",
      paymentName: "카카오 페이",
    },
  ];
 
  // localStorage에서 현재 예약중인 영화 데이터를 받아옴
  const movies = JSON.parse(localStorage.getItem("movie"));

  // 세션 스토리지에서 userInfo를 받아옴
  const userInfo = JSON.parse(sessionStorage.getItem("userData"));

  // localStorage에서 티켓 데이터를 받아옴
  const ticket = JSON.parse(localStorage.getItem('ticket'));
  const price = ticket.price;

  const [extra, setExtra] = useState(0); // 일반석 개수 저장
  const [normal, setNormal] = useState(0); // 특수석 개수 저장
  const [totalSeat, setTotalSeat] = useState(0); // 총 좌석 개수저장
  
  // 좌석 정보가 들어오면 seats 변수에 저장
  const seats = ticket.selectedSeats;
   
  useEffect (() =>{
  const calSeat = () => {
    var sumExtra = 0;
    var sumNormal = 0;
    {seats && seats.map((seat)=>{
            // 좌석 판별 A, B, C열이면 특수석으로 분류하고 개수증가
    if(seat.includes("A")){
      sumExtra += 1
    } else if(seat.includes("B")){
      sumExtra += 1
    } else if(seat.includes("C")){
      sumExtra += 1
    } else{
      sumNormal += 1
    }
    setExtra(sumExtra)
    setNormal(sumNormal)
    setTotalSeat(sumExtra+sumNormal)
  })}}
  calSeat()
}, [])

// 좌석 가격
let totalTicketPrice = () =>{
  const extraPrice = 5000;
  let sumprice = ((price*totalSeat)+(extra*extraPrice));
  return sumprice
}

// 좌석 가격 자릿수 ,표시
let priceCal = () => {
  const total = totalTicketPrice()
  const markTotal = `${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return markTotal;
}

// 좌석 위치
let seatList = () => {
  var sumSeat = ""
  seats.map((seat) => sumSeat += (seat+","))
  return sumSeat
}

// 결제정보 체크
// 
  const [checked, setChecked] = useState(paymentMethods[0]);
  const [payment, setPayment] = useState("");
  const [payMethod, setPayMethod] = useState("");

  // 라디오 버튼을 클릭하면 체크된 값을 불러온다 
  const handleCheckRadio = (e) => {
    setChecked(e.target.value);
  };

  // 값이 바뀌면 useEffect로 갱신
  useEffect (() => {
    setPayment(checked.paymentType);
    setPayMethod(checked.payMethod)

    console.log(payment)
    console.log(payMethod)
  }, [checked])


// 회원정보 동일체크
  const [isChecked, setIsChecked] = useState(false);
  const onClickLoadRecipient = () => {};

// 체크박스 작동시 함수
  const handleCheck = (e) => {
    // e.preventdefault()
    setIsChecked(!isChecked);
  };
// 체크박스가 체크되면 사용자 데이터를 로컬스토리지에서 읽어와 useState에 넣는다
  useEffect(() => {
    isChecked
      ? onClickLoadRecipient(
          setNameInfo(userInfo.username),
          setPhoneNumberInfo(userInfo.phonenumber),
          setEmailInfo(userInfo.email)
        )
      : onClickLoadRecipient(
          setNameInfo(""),
          setPhoneNumberInfo(""),
          setEmailInfo("")
        );
  }, [isChecked]);

  // 약관 체크
  // 약관이 체크되지 않으면 결제버튼 비활성화를 위한 함수
  const [contCheck, setContCheck] = useState(true);
  const [contChecked, setContChecked] = useState(false);
  // useEffect용 빈 함수선언
  const onContChecked = () => {};
  // 체크버튼 클릭하면 체크상태 useState에 저장하는 함수
  const handleContCheck = (e) => {
    // e.preventdefault()
    setContChecked(!contChecked);
  };
  useEffect(() =>{
    contChecked
    ? onContChecked(
      setContCheck(!contCheck),
    ) : onContChecked(
      setContCheck(!contCheck),
    )

  }, [contChecked])

  // 제3자 정보제공 동의 체크
  // 정보제공 동의가 체크되지 않으면 결제버튼 비활성화를 위한 함수
  const [agreeCheck, setAgreeCheck] = useState(true);
  const [agreeChecked, setAgreeChecked] = useState(false);
  // useEffect용 빈 함수선언
  const onAgreeChecked = () => {};
  // 체크버튼 클릭하면 체크상태 useState에 저장하는 함수
  const handleAgreeCheck = (e) => {
    // e.preventdefault()
    setAgreeChecked(!agreeChecked);
  };
  useEffect(() =>{
    agreeChecked
    ? onAgreeChecked(
      setAgreeCheck(!agreeCheck),
    ) : onAgreeChecked(
      setAgreeCheck(!agreeCheck),
    )

  }, [agreeChecked])

// 입력정보확인이 안되었을때 결제버튼 비활성화를 위한 useState
  const [viewOrdererSheet, setViewOrdererSheet] = useState(false);
// 입력정보란이 비어있다면 알람처리
  const onClickNextUsePointSheet = () => {
    if (!nameInfo || !phoneNumberInfo || !emailInfo) {
      alert("필수 사항 입력 부탁드립니다.");
      setViewOrdererSheet(false);
      return;
    } 
    setViewOrdererSheet(true);
  };

  // 서버측에 주문서를 DB에 등록하는 메소드
  const submitOrdersheet = (payment) => {

    // 현재 시간과 날짜를 구하는 내장 객체
    const date = new Date();

    // createOrderNumber에는 주문번호를 생성한다.
    const createOrderNumber =
      String(userInfo.userid) +
      String(date.getFullYear()) +
      String(date.getMonth() + 1) +
      String(date.getDate()) +
      String(date.getHours()) +
      String(date.getMinutes()) +
      String(date.getSeconds()) +
      "-" +
      String(movies.id);

    // 서버에 전달할 데이터를 담을 변수 배열 설정
    const reqOrderSheet = [];

    // userCart(주문 상품들의 정보가 들어있는 배열)
    // forEach()를 통해 요소(좌석) 마다 name, email 등의 키:값을 추가한 후,
    // 그 요소를 reqOrderSheet 배열에 저장한다.
    seats.forEach((data) => {
      reqOrderSheet.push({
        date: ticket.selectedDate,            // 예매 일자
        time: ticket.selectedTime,            // 예매 시간
        seat: data,                           // 예매 좌석
        price: price,                         // 티켓 가격
        normal: normal,                       // 일반석 개수
        extra: extra,                         // 프리미엄석 개수
        orderNumber: createOrderNumber,       // 주문번호
        userId: userInfo.userid,              // 사용자의 고유 id
        movieName: movies.name,               // 영화명
        id: movies.id,                        // 영화 고유번호
        name: nameInfo,                       // 사용자 이름
        emailInfo: emailInfo,                 // 사용자 이메일
        phoneNumber: phoneNumberInfo,         // 사용자 전화번호
        totalCount: normal+extra,             // 좌석개수
        totalAmount: totalTicketPrice(),      // 티켓 총가격
        payment: payment,                     // 지불방법
        imageURL: movies.thumbnail,           // 영화 이미지URL
      });
    });

    console.log(reqOrderSheet)
    // completeOrder state용 데이터
    const completeOrderData = {
      deliveryMovieName: movies.name,
    };

    // 서버에 엔드포인트 "/reqOrder" 로 POST 요청,
    // 전달할 데이터는 orderSheet 이름의 reqOrderSheet 객체 변수
    axios
      .post(`${Server_URL}/reqOrder`, {
        orderSheet: reqOrderSheet,
        orderUserId: userInfo.userId,
      })
      // 서버에서 성공적으로 실행되었다면, 다음 then() 코드가 실행된다.
      .then(() => {
        const removeTicket = null;
        localStorage.setItem("ticket", removeTicket);
        navigate("/completeOrder", { state: { orderData: completeOrderData } });
      });
    
  };

  return (
    <div className="modalDiv">
      <div className="modal">
        <div className="modal-head">
          <h3>좌석선택</h3>
        </div>
        <div className="modal-body">
          <div className="modal-side-left">
            <div className="modal-left-head">
              <h3>인원선택</h3>
            </div>
            <div className="modal-left-body">
              <p>최대 2매까지 예매 가능</p>
            </div>
          </div>
          <div className="modal-mid">
            <form>
              <div className="mid-head">
                <h3>주문자 정보</h3>
                {/* 자동입력을 위한 체크박스 */}
                <Checkbox id="check" checked={isChecked} onChange={handleCheck}>
                  {"회원정보와 동일"}
                </Checkbox>
              </div>
              <table>
                <thead></thead>
                <tbody className="personal-check">
                  <tr className="full_name">
                    <div>
                      <label htmlFor="full_name">성함</label>
                    </div>
                    <div>
                        {/* 주문자 정보 입력란 */}
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={nameInfo}
                        onChange={(e) => setNameInfo(e.target.value)}
                        required
                      />
                    </div>
                  </tr>
                  <tr className="tel">
                    <div>
                      <label htmlFor="tel">핸드폰</label>
                    </div>
                    <div>
                      <input
                        type="tel"
                        id="tel"
                        name="tel"
                        value={phoneNumberInfo}
                        placeholder="000-0000-0000"
                        onChange={(e) => setPhoneNumberInfo(e.target.value)}
                        required
                      />
                    </div>
                  </tr>
                  <tr className="emailInfo">
                    <div>
                      <label htmlFor="emailInfo">이메일</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        id="emailInfo"
                        name="emailInfo"
                        value={emailInfo}
                        onChange={(e) => setEmailInfo(e.target.value)}
                        required
                      />
                    </div>
                  </tr>
                </tbody>
              </table>
              <div className="check-button">
                {/* 입력사항 확인버튼 */}
              <button className="usePointSheet" onClick={onClickNextUsePointSheet}>입력사항 확인</button>
              </div>
            </form>
            <div className="multipay">
              <h3>결제 수단</h3>
              <form>
                {/* 결제수단 선택버튼 라디오타입으로 1개 선택되면 나머지 취소됨 */}
                {/* checked는 checked useState가 해당 paymentType이 되면 자동으로 체크상태가 되도록(라벨 클릭시 작동용) */}
                <input
                  id="카드 결제"
                  type="radio"
                  value={paymentMethods[0]}
                  checked={checked.paymentType === "카드 결제"}
                  onChange={handleCheckRadio}
                />
                <label htmlFor="카드 결제" onClick={() => setChecked(paymentMethods[0])}>카드결제</label>
                
                <input
                  id="실시간 계좌이체"
                  type="radio"
                  value={paymentMethods[1]}
                  checked={checked.paymentType === "실시간 계좌이체"}
                  onChange={handleCheckRadio}
                />
                <label htmlFor="실시간 계좌이체" onClick={() => setChecked(paymentMethods[1])}>실시간 계좌이체</label>
                <input
                  id="모바일 결제"
                  type="radio"
                  value={paymentMethods[2]}
                  checked={checked.paymentType === "모바일 결제"}
                  onChange={handleCheckRadio}
                />
                <label htmlFor="모바일 결제" onClick={() => setChecked(paymentMethods[2])}>모바일 결제</label>
                <input
                  id="카카오 페이"
                  type="radio"
                  value={paymentMethods[3]}
                  checked={checked.paymentType === "카카오 페이"}
                  onChange={handleCheckRadio}
                />
                <label htmlFor="카카오 페이" onClick={() => setChecked(paymentMethods[3])}>카카오 페이</label>
             </form>
            </div>
            <div className="contract">
              <h3>이용약관</h3>
              <input 
                id="이용약관"
                type="checkbox"
                checked={contChecked}
                onChange={handleContCheck}
              />
              <label htmlFor="이용약관" onClick={handleContCheck}>
                <span>
                  주문자 확인 및 예매처리를 위해 휴대폰번호, 이메일, (배송수령 시) 주소, (입력필요 시) 생년월일을 수집하며, 이용목적 달성 이후 파기합니다.
              </span>
              </label>
              <input 
                id="정보제공동의"
                type="checkbox"
                checked={agreeChecked}
                onChange={handleAgreeCheck}
              />
              <label htmlFor="정보제공동의" onClick={handleAgreeCheck}>
              <span>
              제 3자 정보제공에 동의합니다
              </span>
              </label>
            </div>
          </div>
          <div className="modal-side-right">
            {/* 영화 이미지 출력 */}
            <img src={movies.thumbnail}></img>
            <div className="Summary">
                {/* 티켓정보 출력 */}
              <h3>{`${movies.name}`}</h3>
              <p className="date">{`${ticket.selectedDate}`} ({getDayOfWeek(ticket.selectedDate)})</p> 
                                                              {/* util의 요일구하는 함수 getDayOfWeek를 불러와 요일표시 */}
              <p className="time">{`${ticket.selectedTime}`}</p>
              <p className="seat-list">{seatList()}</p>
            </div>
            <div className="price-check">
            <span className="seat-check"> 
              {/* 좌석등급에 따른 매수 출력 */}
              <p>일반석 {normal}매</p>
              <p>특수석 {extra}매</p>
            </span>
            {/* 결제금액계산 */}
            <span className="total-price"><h3>총금액</h3> <span><span className="priceCal">{`${priceCal()}`}</span>원</span></span>
            </div>
            {/* 입력정보란 확인이 안되면 버튼안보이게 하는 class */}
            <div className={
              viewOrdererSheet ? "orderersheet_display_open" : "orderersheet_display_close"
            }>
                {/* 결제 수단용 component */}
            <div className="payment" >
              <MultiPayment
                id = "payment"
                // 약관체크 확인용 비활성화 조건
                disabled={!(contCheck && agreeChecked)}
                // 결제 타입
                paymentType={payment}
                // 결제 수단
                payMethod={payMethod}
                // 결제정보를 위한 티켓props
                ticket={ticket}
                // 영화이름
                name={movies.name}
                // 버튼 클릭시 작동함수
                submitOrdersheet={submitOrdersheet}
              ></MultiPayment>
              {/* <label htmlFor="payment">결제하기</label> */}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
