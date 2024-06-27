import axios from "axios";

function FileUpload() {
    const upload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', e.target.file.files[0]);
        axios
        .post(`//localhost:8000/write`, formData)
        .then((response) => {
        if (response.data.success){
            Navigator(()=>{"/"});
            window.location.reload();
            console.log(response)
        } else {
            alert(`전송에 실패하였습니다 code:${response}`)
            console.log(response)
        }
        })
    };
    
    return(
        <div className="write_con file">
            <p className="write_label">파일첨부</p>
            <label for="file_input">파일선택</label>
            <input type='file' name='file' />
            <button type='submit'  onSubmit={upload}>업로드</button>
        </div>
    );
  }

  export default FileUpload;