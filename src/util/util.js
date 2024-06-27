// 요일 구하는 함수
export function getDayOfWeek(date){ //ex) getDayOfWeek('2022-06-13')
  
      const week = ['일', '월', '화', '수', '목', '금', '토'];
  
      const dayOfWeek = week[new Date(date).getDay()];
  
      return dayOfWeek;
}