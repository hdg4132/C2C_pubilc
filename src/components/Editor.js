import { Link } from 'react-router-dom';
import Button from './Button';

const Editor=()=>{
    return(
        <div className="Editor">
            <div className="content_body">
                <div className="container_fix">
                    <div className="write_con">
                        <label for="" className="write_label">제목</label>
                        <input type="text" placeholder="제목을 입력하세요"/>
                    </div>
                    <div className="write_con">
                        <label for="" className="write_label">내용</label>
                        <textarea name="" id=""></textarea>
                    </div>
                    <div className="write_con file">
                        <p className="write_label">파일첨부</p>
                        <label for="file_input">파일선택</label>
                        <input type="file" id="file_input"/>
                    </div>
                </div>
            </div>
            <div className="content_tail">
                <div className="container_fix">
                    <div className="btn_list">
                        <Button text={'목록'} />
                        <Button text={'글쓰기'} color={'color'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor;