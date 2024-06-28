import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TicketCompleteOrder.css";

const TicketCompleteOrder = () => {
  const location = useLocation(); // useNavigate 훅스를 통해 가져온 데이터를 다루기 위한 기능
  const navigate = useNavigate();

  // 메인 || 샵 이동 핸들러
  const onClickShopNavigateHandler = () => {
    navigate("/");
    window.location.reload()
  };

  // 마이 페이지 이동 핸들러
  const onClickMyOrderListNavigateHandler = () => {
    navigate("/Mypage");
  };

  const movie = location.state.orderData

  if (!location.state) {
    // 올바른 접근 방법이 아닐 경우 - navigate를 통해 들어오지 않아 state가 없는경우
    return (
      <div>
        <div className="completeOrder">
        <header id="header">

        </header>
        <div>
          <div className="banner">
              <h1>빠른 예매</h1>
              <br />
              <p>Come 2 Cinema에서 만나요</p>
            </div>
          <div>
          <div className="complete-body-head">
              <h3>잘못된 접근입니다</h3>
              </div>
              <div className="complete-body">
            <h1>요청하신 페이지를 찾을 수 없습니다.</h1>
            <h3>올바른 접근이 아니거나 요청 데이터를 찾을 수 없습니다.</h3>
            <h3>
              메인으로 돌아가려면 <Link to={"/"}>이곳</Link>을 클릭해주세요.
            </h3>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  } else {
    // 정상적으로 이 경로에 접근한 경우

    return (
      <div className="completeOrder">
        <header id="header"></header>
        <div>
          <div>
            <div className="banner">
              <h1>빠른 예매</h1>
              <br />
              <p>Come 2 Cinema에서 만나요</p>
            </div>
            <div>
            <div className="complete-body-head">
              <h3>빠른예매</h3>
              </div>
              <div className="complete-body">
                <h4>예매완료</h4>
                <p>{movie.deliveryMovieName} 예매가 완료되었습니다</p>
                <input
                  type="button"
                  onClick={onClickMyOrderListNavigateHandler}
                  value={"예매내역 확인"}
                />
                <input
                  type="button"
                  onClick={onClickShopNavigateHandler}
                  value={"메인으로"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TicketCompleteOrder;
