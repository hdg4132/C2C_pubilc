import React, { useState } from 'react';
import './Footer.css';

//마우스로 영화명을 클릭하면
const movie_name = document.querySelector('.movie_name');
const movie_name_list = document.querySelector('.movie_name_list');
movie_name.addEventListener('click', function(){ //무비네임을 클릭 시 아래 액션이 실행
  if(movie_name_list.classList.contains('on')){ // 이미 클래스 on 이 들어있을때
    movie_name_list.classList.remove('on')

  }else{ //아닐때
    movie_name_list.classList.add('on')

  }
 
})