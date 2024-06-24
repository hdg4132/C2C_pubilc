import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../signup.css";

const Signup = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    detailaddress: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [emailDuplication, setEmailDuplication] = useState(false); // 이메일 중복 확인 여부

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === "email") {
      setEmailDuplication(false); // 이메일이 변경될 때마다 이메일 중복 확인 상태를 초기화
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "*이메일 중복 확인을 해주세요.",
      }));
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "*성함을 입력해 주세요";
    }

    if (!values.email) {
      errors.email = "*이메일을 입력해 주세요.";
    } else if (!emailDuplication) {
      errors.email = "*이메일 중복 확인을 해주세요.";
    }

    if (!values.password) {
      errors.password = "*비밀번호를 입력해 주세요.";
    } else if (values.password.length < 6) {
      errors.password = "*비밀번호는 6자 이상이어야 합니다.";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "*비밀번호 확인을 입력해 주세요.";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "*비밀번호가 일치하지 않습니다.";
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = "*휴대폰 번호를 입력해 주세요";
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = "*휴대폰 번호를 입력해 주세요";
    }

    if (!values.address) {
      errors.address = "*주소를 입력해 주세요";
    }

    if (!values.detailaddress) {
      errors.detailaddress = "*상세 주소를 입력해 주세요";
    }
    return errors;
  };

  const checkEmailDuplication = async () => {
    if (!formValues.email) {
      alert("이메일을 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/checkEmailDuplication`,
        { email: formValues.email }
      );
      console.log("서버 응답:", response.data);
      setEmailDuplication(response.data.success);

      // 이메일 중복 확인이 성공하면 이메일 관련 에러를 제거
      if (response.data.success) {
        setFormErrors((prevErrors) => {
          const { email, ...otherErrors } = prevErrors;
          return otherErrors;
        });
      }

      alert(response.data.message);
    } catch (error) {
      console.error("이메일 중복 확인 중 오류:", error);
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
      try {
        const response = await axios.post("http://localhost:8000/signup", {
          username: formValues.username,
          password: formValues.password,
          email: formValues.email,
          address: formValues.address,
          detailaddress: formValues.detailaddress,
          phonenumber: formValues.phoneNumber,
        });
        console.log("서버 응답:", response.data);
        alert("회원가입이 완료되었습니다.");
        window.location.href = "/"; // 홈 페이지 또는 다른 페이지로 리디렉션
      } catch (error) {
        if (error.response) {
          console.log(
            "서버 응답 오류:",
            error.response.status,
            error.response.data
          );
          alert("서버 오류: " + error.response.data.message);
        } else if (error.request) {
          console.log("서버 응답이 없음:", error.request);
          alert("서버 응답이 없습니다.");
        } else {
          console.log("요청 설정 중 오류:", error.message);
          alert("요청 설정 중 오류가 발생했습니다.");
        }
      } finally {
        setIsSubmit(false);
      }
    }
  };

  return (
    <div>
      <div id="sub_banner">
        <div className="container_fix">
          <h2>회원가입</h2>
          <p>Come 2 Cinema와 함께해요.</p>
        </div>
      </div>
      <main>
        <h3>회원가입</h3>
        <form className="signup_form" onSubmit={handleSubmit}>
          <div className="signup_form_con">
            <label htmlFor="name">성함</label>
            <div>
              <input
                type="text"
                name="username"
                id="name"
                value={formValues.username}
                placeholder="성함"
                onChange={handleChange}
              />
              {formErrors.username && <p>{formErrors.username}</p>}
            </div>
          </div>
          <div className="signup_form_con">
            <label htmlFor="email">이메일 주소</label>
            <div className="mail_input_wrap">
              <div className="mail_input">
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formValues.email}
                    placeholder="이메일 주소"
                    onChange={handleChange}
                  />
                  {formErrors.email && <p>{formErrors.email}</p>}
                </div>
                <button
                  type="button"
                  className="btn_check"
                  onClick={checkEmailDuplication}
                >
                  중복 확인
                </button>
              </div>
            </div>
          </div>
          <div className="signup_form_con">
            <label htmlFor="password">비밀번호</label>
            <div>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formValues.password}
                  placeholder="비밀번호"
                  onChange={handleChange}
                />
              </div>
              {formErrors.password && <p>{formErrors.password}</p>}
            </div>
            <div></div>
          </div>
          <div className="signup_form_con">
            <label htmlFor="password_check">비밀번호 확인</label>
            <div className="password_wrap">
              <input
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                placeholder="비밀번호 확인"
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p>{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          <div className="signup_form_con">
            <label htmlFor="phonenumber">휴대폰 번호</label>
            <div>
              <input
                type="text"
                name="phoneNumber"
                id="phonenumber"
                value={formValues.phoneNumber}
                placeholder="휴대폰 번호"
                onChange={handleChange}
              />
              {formErrors.phoneNumber && <p>{formErrors.phoneNumber}</p>}
            </div>
          </div>
          <div className="signup_form_con">
            <label htmlFor="address">주소</label>
            <div>
              <input
                type="text"
                name="address"
                value={formValues.address}
                placeholder="주소"
                onChange={handleChange}
              />
              {formErrors.address && <p>{formErrors.address}</p>}
            </div>
          </div>
          <div className="signup_form_con">
            <label>상세 주소</label>
            <div>
              <input
                type="text"
                name="detailaddress"
                id="detailaddress"
                value={formValues.detailaddress}
                placeholder="상세주소"
                onChange={handleChange}
              />
              {formErrors.detailaddress && <p>{formErrors.detailaddress}</p>}
            </div>
          </div>
          <div id="btn_signup">
            <Link to="/" type="reset" className="btn_back">
              뒤로가기
            </Link>
            <button type="submit" className="btn_signup" disabled={isSubmit}>
              회원가입
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Signup;
