import { useEffect, useRef } from 'react'

 
const {kakao} = window;

const KakaoMap =()=>{
    const container = useRef(null);
      useEffect(()=>{
        var mapOption = { 
            center: new kakao.maps.LatLng(37.4503564603982, 126.702873928345), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

        var map = new kakao.maps.Map(container.current, mapOption); // 지도를 생성합니다

        // 마커가 표시될 위치입니다 
        var markerPosition  = new kakao.maps.LatLng(37.4503564603982, 126.702873928345); 

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);

      },[])
      
    return(
      <>
        <div className='kakao_map' ref={container}></div>

      </>
    )
}

export default KakaoMap;