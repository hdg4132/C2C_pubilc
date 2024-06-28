import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from './Paging.js';
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

function MyPage() {
    const Server_URL = process.env.REACT_APP_Server_Side_Address || 'http://localhost:8000';
    const [currentPage, setCurrentPage] = useState(1);
    const [showPopup, setShowPopup] = useState(false); // 팝업 상태 변수 추가
    const [orders, setOrders] = useState([]); // 예매내역 상태 변수 추가
    const itemsPerPage = 10;
    const userInfo = JSON.parse(sessionStorage.getItem('userData'))
    const userId = userInfo.userid; // 실제 로그인한 사용자의 ID로 설정해야 합니다.
    const navigate = useNavigate();



    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('userData'))
        if (userInfo != null){

        } else {
          alert("로그인을 하셔야 합니다")
          navigate("/")
        }
      }, [])

      const fetchOrders = async () => {
        try {
            const response = await axios.get(`${Server_URL}/orders?userId=${userId}`);
            if (response.data.success) {
                setOrders(response.data.data);
                console.log(response.data.data)
            } else {
                console.error('에러 orders:', response.data.message);
            }
        } catch (error) {
            console.error('에러 data:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []); // 페이지 로드 시 예매내역을 불러오도록 변경

    

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDeleteAccount = async () => {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (!userData) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await axios.delete(`${Server_URL}/deleteAccount`, {
                data: { userId: userData.id },
            });

            if (response.data.success) {
                setShowPopup(true); // 팝업 보이기
            } else {
                alert("사용자 탈퇴에 실패하였습니다.");
            }
        } catch (error) {
            console.error("사용자 탈퇴 오류:", error);
            alert("사용자 탈퇴 중 오류가 발생하였습니다.");
        }
    };

    const handleConfirm = () => {
        setShowPopup(false); // 팝업 숨기기
        sessionStorage.clear(); // 세션 정보 초기화
        navigate("/login"); // 로그인 페이지로 이동
    };

    const displayOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className="subBanner_mypage">
                <div className="container_fix">
                    <h2 className="Banner_text page">마이페이지</h2>
                    <p className="Banner_text sub">Come 2 Cinema와 함께해요</p>
                </div>
            </div>
            <div className="mypage">
                <div className="mypage_header">
                    <p className="mypage_text">마이페이지</p>
                    <div className="Line3">
                    </div>
                </div>
                <div className="mypage_side">
                    <div className="sidebox">
                        <ul className="sidebox_List">
                            <li className="sidebox_text">나의 예매내역</li>
                            <li className="sidebox_text">
                                <button className="sidebox_quitbutton" onClick={() => navigate("/Userinfoupdate")}>회원정보 수정</button>
                                </li>
                            <li className="sidebox_text">
                                <button className="sidebox_quitbutton" onClick={handleDeleteAccount}>탈퇴하기</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="MyTicketing">
                    <h3>나의 예매내역</h3>
                    <div className="post_line" />
                    {displayOrders.map((orders) => (
                        <div key={orders.id}>
                            <div className="movie_info">
                                <div className="movieImage" style={{ backgroundImage: `url(${orders.imageURL})` }} />
                                <div className="info_text">
                                    <p className="movie_text1">{orders.orderName}</p>
                                    <p className="movie_text2">{orders.date} {orders.time} | {orders.seat}</p>
                                    <p className="movie_text3">{orders.totalAmount}원 ({orders.totalCount}매)</p>
                                </div>
                            </div>
                            <div className="post_line" />
                        </div>
                    ))}
                    <Pagination
                        totalItems={orders.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            {showPopup && (
                <div className="popup show">
                    <p>회원탈퇴 완료했습니다.</p>
                    <button onClick={handleConfirm}>확인</button>
                </div>
            )}
        </div>
    );
}

export default MyPage;
