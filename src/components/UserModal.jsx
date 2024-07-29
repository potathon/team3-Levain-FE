import { useNavigate } from "react-router-dom"
import "../styles/components/UserModal.css"
import { useState, useEffect } from "react"

function UserModal({user}) {
    const nav = useNavigate()
    
    return (
        <div className="UserModal">
            <p>안녕하세요 👋</p>
            <p><strong>{user.nickname} </strong> 님!</p>
            <div className="coin-section">
                보유코인 : {user.reward}
            </div>
            <div
                onClick={()=>nav("/letter/my")}
                className="myPage-section">
                <div className="icon">
                    <img src= "src/assets/mail.png"/>
                </div>
                <span>내 편지함</span>
            </div>
            <div
                onClick={()=>nav("/password")}
                className="password-section">
                <div className="icon">
                    <img src= "src/assets/padlock.png"/>
                </div>
                <span>비밀번호 수정</span>
            </div>
            <div
                onClick={() => {
                    localStorage.removeItem("accessToken")
                    nav("/login")
                }}
                className="logout-section">
                <div className="icon">
                    <img src="src/assets/logout.png" />
                </div>
                <span>로그아웃</span>
            </div>
        </div>
    )
}

export default UserModal