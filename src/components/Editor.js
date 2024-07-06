import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import {useState, useEffect} from 'react'
import axios from 'axios';

const Editor=({initData, onSubmit})=>{
  const nav = useNavigate();
  const [input, setInput] = useState({
    title: "",
    movie_status: "개봉예정",
    content: "",
    userid:"",
  });

  const userInfo = JSON.parse(sessionStorage.getItem("userData"));
  
  useEffect(() => {
    setInput({
      ...input,
      userid: userInfo.userid
    })
  }, [])

  const [img, setImg] = useState({
    fileName: "",
    filePath: "",

  });
  const onChangeFile = (e) => {
    setImg(e.target.files[0]);
  };


  const onChangeInput = (e) => {
    const { name, value} = e.target;

      setInput({
        ...input,
        [name]: value
      });
  };

  useEffect(() => {
    if (initData) {
      setInput({
        ...initData
      });
    }
  }, [initData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', input.title);
    formData.append('movie_status', input.movie_status);
    formData.append('content', input.content);
    formData.append('user_id', input.userid);
    if(img){
      formData.append('img', img);
      if(initData){
        formData.append('existingImg', initData.img); 
      }
    }
    
    console.log(formData)
    const url = initData ? `http://localhost:8000/board_movie/edit/${initData.id}` : 'http://localhost:8000/board_movie/write';  


    axios.post(url, formData)
    .then(response => {
      
      const { fileName } = response.data;
      setImg({ fileName, filePath: `http://localhost:8000/uploads/${fileName}` });
      

      const redirectUrl = initData ? `/movie/post/${initData.id}` : `/movie/post/${response.data.id}`;
      window.location.href = redirectUrl;
    })
    .catch(error => {
      console.error('There was an error submitting the data!', error);
    });

    
  };

   
    return(
        <div className="Editor">
            <form  onSubmit={handleSubmit}>
                <div className="content_body">
                    <div className="container_fix">
                        <div className="write_con">
                            <label htmlFor="" className="write_label">제목</label>
                            <input type="text" placeholder="제목을 입력하세요" name="title" onChange={onChangeInput} value={input.title} required/>
                        </div>
                        <p>{input.userid}</p>
                        <div className="write_con">
                            <label htmlFor="" className="write_label">개봉상태</label>
                            <select name="movie_status" value={input.movie_status} onChange={onChangeInput}>
                                <option value="개봉예정">개봉예정</option>
                                <option value="상영중">상영중</option>
                            </select>
                        </div>
                        <div className="write_con">
                            <label htmlFor="" className="write_label">내용</label>
                            <textarea name="content" id="" onChange={onChangeInput} value={input.content} required></textarea>
                        </div>
                        <div className="write_con file">
                        <p className="write_label">파일첨부</p>
                        <label htmlFor="file_input">파일선택</label>
                        <input type='file' name='img' onChange={onChangeFile} />
                        <button type='submit'>업로드</button>
                    </div>
                    </div>
                </div>  
                <div className="content_tail">
                    <div className="container_fix">
                        <div className="btn_list">
                            <Button onClick={()=>{nav(-1)}} text={'뒤로가기'} />
                            <Button text={initData ? '수정하기' : '글쓰기'} color={'color'} type="submit"/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Editor;