import { useEffect } from "react";
import "./TicketBack.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
export const TicketBack = () => {
    // 유저 상태확인용 useLocation,
  const location = useLocation();

    // 데이터 흐름확인용 임시티켓
    const ticket = 
    {
      date: "2024-06-05",
      time: "14:00 ~ 16:00",
      seat: ["A1", "C1"],
      price: 14000,
      normal: 1,
      extra: 1,
    }

  localStorage.setItem("ticket", JSON.stringify(ticket));

  useEffect(() => {}, [location]);
  return (
    <div>
      <div>
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
                <h4>예매 중입니다</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Link /> state 속성을통해서 background를 키로 전달하고 location을 값으로 전달합니다. */}
      <Link to="/ticket/modal" state={{ background: location }}>
        here <Outlet />
      </Link>
    </div>
  );
};
