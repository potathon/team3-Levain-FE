import React, { useState } from "react";
import "../styles/pages/LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { SubmitBtn } from "../components/Button";
import InfoInput from "../components/InfoInput";
import bg2 from "../assets/bg2.png";
import { API_LOGIN } from "../config";
import axios from "axios";

function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [userNameHelper, setUserNameHelper] = useState("");
    const nav = useNavigate();

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handleUserNameFocus = () => {
        setUserNameHelper("아이디는 '영어이름_성' 입니다.");
    };

    const handleUserNameBlur = () => {
        setUserNameHelper("");
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(API_LOGIN, {
                userName,
                password
            });
            if (response.status === 200) {
                const accessToken = response.data.data.token;
                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                    alert("로그인 성공");
                    setTimeout(() => {
                        nav('/main');
                    }, 1000);
                } else {
                    alert("토큰 없음");
                }
            } else {
                alert("로그인에 실패했습니다.");
                window.location.reload()
            }
        } catch (error) {
            // console.error("로그인 오류", error);
            alert("로그인에 실패했습니다.");
            window.location.reload()
        }
    };

    return (
        <div className="Login" style={{ backgroundImage: `url(${bg2})` }}>
            <form id="login-form" onSubmit={handleSubmit}>
                <div className="login-title">로그인</div>
                <div className="login-notice">
                    초기 비밀번호는 <strong>1234</strong> 입니다. <br /> 로그인 후 비밀번호를 변경해주세요.
                </div>
                <div className="login-input-section" style={{marginBottom:"70px"}}>
                    <InfoInput
                        placeholder="아이디"
                        type="text"
                        helper={userNameHelper}
                        marginRight="220px"
                        value={userName}
                        onChange={handleUserNameChange}
                        onFocus={handleUserNameFocus}
                        onBlur={handleUserNameBlur}
                    />
                    <InfoInput
                        placeholder="비밀번호"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <SubmitBtn ButtonName="login"/>
            </form>
        </div>
    );
}

export default LoginPage;
