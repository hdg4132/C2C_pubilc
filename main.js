//마우스로 영화명을 클릭하면.
const movie_name = document.querySelector('.movie_name');
const movie_name_list = document.querySelector('.movie_name_list');
movie_name.addEventListener('click', function(){ //무비네임을 클릭 시 아래 액션이 실행
  if(movie_name_list.classList.contains('on')){ // 이미 클래스 on 이 들어있을때
    movie_name_list.classList.remove('on')

  }else{ //아닐때
    movie_name_list.classList.add('on')

  }
 
})

// date 타입에 현재 일자 세팅
let offset = new Date().getTimezoneOffset() * 60000
let today = new Date(Date.now() - offset);

document.getElementById('currentDate').value = new
Date().toISOString().substring(0,10);

document.getElementById('currentDate').min = today.toISOString().substring(0,10)

//max 날짜는 3개월 오늘 날짜 전일
today.setMonth(today.getMonth()+1)
today.setDate(today.getDate()-1)
document.getElementById('currentDate').max = today.toISOString().substring(0,10)

