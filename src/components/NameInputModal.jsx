import React, { useState, useEffect } from 'react';
import '../styles/components/NameInputModal.css';

function NameInputModal({ isVisible, onClose, onSave }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isVisible) {
            setName(''); // 모달이 열릴 때마다 이름을 초기화
        }
    }, [isVisible]);

    const handleSave = () => {
        if (name.trim().length === 0) { // trim()을 사용하여 공백만 있는 경우를 방지
            alert('이름을 입력해주세요.');
            return;
        }
        if (name.length > 7) {
            alert('이름은 7글자까지 가능합니다.');
            return;
        }
        onSave(name.trim()); // 이름의 앞뒤 공백을 제거하여 저장
    };

    if (!isVisible) return null;

    return (
        <div className="name-input-modal" onClick={onClose}>
            <div className="name-input-modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="name-input-close-button" onClick={onClose}>&times;</span>
                <h2>장식 이름 입력</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength="7"
                    placeholder="이름을 입력하세요 (최대 7글자)"
                />
                <button onClick={handleSave}>저장</button>
            </div>
        </div>
    );
}

export default NameInputModal;
