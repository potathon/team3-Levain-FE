import React, { useState } from "react";
import "../styles/pages/Password.css";
import { SubmitBtn } from "../components/Button";
import InfoInput from "../components/InfoInput";
import bg2 from "../assets/bg2.png";
import axios from "axios";
import { API_PASSWORD, API_PASSWORD_CHECK } from "../config";

function Password() {
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [newPwdConfirm, setNewPwdConfirm] = useState("");
    const [currentPwdHelper, setCurrentPwdHelper] = useState("");
    const [newPwdHelper, setNewPwdHelper] = useState("");
    const [newPwdConfirmHelper, setNewPwdConfirmHelper] = useState("");
    const [isValid, setIsValid] = useState(false);

    const handleCurrentPwdChange = (e) => {
        setCurrentPwd(e.target.value);
        setCurrentPwdHelper("");
    };

    const handleNewPwdChange = (e) => {
        const value = e.target.value;
        setNewPwd(value);
        setNewPwdHelper("");
        validateForm(value, newPwdConfirm);
    };

    const handleNewPwdConfirmChange = (e) => {
        const value = e.target.value;
        setNewPwdConfirm(value);
        setNewPwdConfirmHelper("");
        validateForm(newPwd, value);
    };

    const handleCurrentPwdBlur = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setCurrentPwdHelper("토큰이 없습니다. 다시 로그인해주세요.");
            return;
        }

        try {
            await axios.post(API_PASSWORD_CHECK, { oldPassword: currentPwd }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCurrentPwdHelper("");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setCurrentPwdHelper("현재 비밀번호가 올바르지 않습니다.");
            } else {
                setCurrentPwdHelper("비밀번호 확인 중 오류가 발생했습니다.");
            }
        }
    };

    const validateForm = (password, confirmPassword) => {
        const { isValid: isPwdValid, message: pwdMessage } = validateNewPassword(password);
        const { isValid: isMatchValid, message: matchMessage } = validatePasswordMatch(password, confirmPassword);

        if (!isPwdValid) {
            setNewPwdHelper(pwdMessage);
            setIsValid(false);
            return;
        }

        if (!isMatchValid) {
            setNewPwdConfirmHelper(matchMessage);
            setIsValid(false);
            return;
        }

        setIsValid(true);
        setNewPwdHelper("");
        setNewPwdConfirmHelper("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid) {
            setCurrentPwdHelper("입력한 정보를 다시 확인해주세요.");
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            setCurrentPwdHelper("토큰이 없습니다. 다시 로그인해주세요.");
            return;
        }

        try {
            const changeResponse = await axios.put(API_PASSWORD, { oldPassword: currentPwd, newPassword: newPwd, newPasswordCheck: newPwdConfirm }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (changeResponse.status === 200) {
                setCurrentPwdHelper("");
                setNewPwdHelper("");
                setNewPwdConfirmHelper("");
                setCurrentPwd("");
                setNewPwd("");
                setNewPwdConfirm("");
                alert("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                setCurrentPwdHelper("비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("비밀번호 변경 중 오류가 발생했습니다.", error);
            alert("비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    const validateCurrentPassword = async (password) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return { isValid: false, message: "토큰이 없습니다. 다시 로그인해주세요." };
        }

        try {
            const response = await axios.post(API_PASSWORD_CHECK, { password }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                return { isValid: true, message: "" };
            } else {
                return { isValid: false, message: "현재 비밀번호가 일치하지 않습니다." };
            }
        } catch (error) {
            console.error("비밀번호 확인 중 오류가 발생했습니다.", error);
            return { isValid: false, message: "비밀번호 확인 중 오류가 발생했습니다." };
        }
    };

    const validateNewPassword = (password) => {
        const regex = /^\d{4,6}$/; // 4-6자리 숫자
        if (!regex.test(password)) {
            return { isValid: false, message: "비밀번호는 4-6자리 숫자로만 이루어져야 합니다." };
        }
        return { isValid: true, message: "" };
    };

    const validatePasswordMatch = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
        }
        return { isValid: true, message: "" };
    };

    return (
        <div className="Password" style={{ backgroundImage: `url(${bg2})` }}>
            <form id="password-form" onSubmit={handleSubmit}>
                <div className="password-title">비밀번호 변경</div>
                <div className="password-input-section">
                    <InfoInput
                        placeholder="현재 비밀번호"
                        type="password"
                        value={currentPwd}
                        onChange={handleCurrentPwdChange}
                        onBlur={handleCurrentPwdBlur}
                        helper={currentPwdHelper}
                        marginRight="195px"
                    />
                    <InfoInput
                        placeholder="새 비밀번호"
                        type="password"
                        value={newPwd}
                        onChange={handleNewPwdChange}
                        helper={newPwdHelper}
                        marginRight="125px"
                    />
                    <InfoInput
                        placeholder="새 비밀번호 확인"
                        type="password"
                        value={newPwdConfirm}
                        onChange={handleNewPwdConfirmChange}
                        helper={newPwdConfirmHelper}
                        marginRight="220px"
                    />
                </div>
                <SubmitBtn ButtonName="submit" />
            </form>
        </div>
    );
}

export default Password;
