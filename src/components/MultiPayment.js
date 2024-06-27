
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // 랜덤 코드 생성 라이브러리

// import "./MultiPayment.css";

const MultiPayment = ({
  name,
  ticket,
  submitOrdersheet,
  paymentType,
  payMethod,
  disabled,
}) => {
  // const { paymentType, channelKey, payMethod, paymentName } = paymentData;
  const { REACT_APP_PortOne_StoreId } = process.env;
  const channelKey_kakao = process.env.REACT_APP_PortOne_Kakao_ChannelKey
  const channelKey = process.env.REACT_APP_PortOne_ChannelKey
  const paymentName = paymentType

  const [isScriptsLoaded, setIsScriptsLoaded] = useState(false);

  let payResponse;

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        // jQuery 라이브러리를 비동기적으로 로드합니다.
        await loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
        // Portone의 브라우저 SDK를 비동기적으로 로드합니다.
        await loadScript("https://cdn.portone.io/v2/browser-sdk.js");
        // 스크립트가 성공적으로 로드되면 상태를 업데이트합니다.
        setIsScriptsLoaded(true);
      } catch (error) {
        // 스크립트 로딩 중 에러가 발생하면 콘솔에 에러 메시지를 출력합니다.
        console.error(error.message);
      }
    };
    
    // 컴포넌트가 마운트될 때 스크립트를 로드합니다.
    loadScripts();
    
    // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
    return () => {
      // 로드된 jQuery 스크립트를 찾습니다.
      const jquery = document.querySelector('script[src="https://code.jquery.com/jquery-3.7.1.min.js"]');
      // 로드된 Portone 브라우저 SDK 스크립트를 찾습니다.
      const iamport = document.querySelector('script[src="https://cdn.portone.io/v2/browser-sdk.js"]');
      // jQuery 스크립트가 있으면 head에서 제거합니다.
      if (jquery) document.head.removeChild(jquery);
      // Portone 브라우저 SDK 스크립트가 있으면 head에서 제거합니다.
      if (iamport) document.head.removeChild(iamport);
    };
    }, []); // 빈 배열을 사용하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.
    
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
    let sumprice = ((ticket.price*totalSeat)+(extra*extraPrice));
    return sumprice
  }

  const onClickPayment = async () => {
    if (!isScriptsLoaded) {
      alert("스크립트가 아직 로드되지 않았습니다. 다시 시도해주세요.");
      return;
    }

    const { PortOne } = window;
    if (!PortOne) {
      alert("결제 SDK가 제대로 로드되지 않았습니다.");
      return;
    }

    try {

      if (paymentType == "카카오 페이") {
        payResponse = await PortOne.requestPayment({
          // Store ID 설정
          storeId: REACT_APP_PortOne_StoreId,
          // 채널 키 설정
          channelKey: channelKey_kakao,
          paymentId: `payment-${uuidv4()}`,
          orderName: `${name}`,
          totalAmount: totalTicketPrice(),
          currency: "CURRENCY_KRW",
          payMethod: payMethod,
          productType: "PRODUCT_TYPE_DIGITAL",
          easyPay: { easyPayProvider: "KAKAOPAY" },
        });
      } else {
      payResponse = await PortOne.requestPayment({
        storeId: REACT_APP_PortOne_StoreId,
        channelKey: channelKey,
        paymentId: `payment-${uuidv4()}`,
        orderName: `${name}`,
        totalAmount: totalTicketPrice(),
        currency: "CURRENCY_KRW",
        payMethod: payMethod,
        productType: "PRODUCT_TYPE_DIGITAL",
      });
    }

      if (payResponse.code) {
        alert(payResponse.message);
        return;
      }

      if (payResponse.transactionType === "PAYMENT") {
        submitOrdersheet(paymentType);
      }
    } catch (error) {
      alert("결제 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <>
      {paymentName == "카카오 페이" ? (
        <input
          className="payment_btn_kakaopay"
          type="button"
          disabled={disabled}
          onClick={onClickPayment}
          value={"결제하기"}
        />
      ) : (
        <input
          className="payment_btn_multi"
          type="button"
          disabled={disabled}
          onClick={onClickPayment}
          value={"결제하기"}
        />
      )}
    </>
  );
};

export default MultiPayment;