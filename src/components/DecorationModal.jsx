import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/DecorationModal.css';
import lockedIcon from '../assets/locked.png';
import addIcon from "../assets/ornament/add.png";
import NameInputModal from './NameInputModal';
import { API_ICONS, API_USER_ME, API_PURCHASE } from '../config';
import axios from 'axios';

function DecorationModal({ isVisible, onClose, onSelect, userName }) {
    const [selectedId, setSelectedId] = useState(null);
    const [coins, setCoins] = useState(0);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseOrnament, setPurchaseOrnament] = useState(null);
    const [unlockedOrnaments, setUnlockedOrnaments] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [showNameInputModal, setShowNameInputModal] = useState(false);
    const [newOrnamentImage, setNewOrnamentImage] = useState(null);
    const [ornamentName, setOrnamentName] = useState('');
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
    const [ornaments, setOrnaments] = useState([]);
    const token = localStorage.getItem("accessToken");

    const fetchIcons = async () => {
        try {
            const response = await axios.get(API_ICONS, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const fetchedOrnaments = response.data.data.map(icon => ({
                    id: icon.iconId,
                    image: `http://localhost:8080${icon.iconPath}`,
                    name: icon.iconName,
                    locked: !icon.purchased,
                    price: icon.price
                }));

                const freeOrnaments = fetchedOrnaments
                    .filter(ornament => ornament.price === 0)
                    .map(ornament => ornament.id);

                const purchasedOrnaments = fetchedOrnaments
                    .filter(ornament => !ornament.locked)
                    .map(ornament => ornament.id);

                const addOrnament = {
                    id: fetchedOrnaments.length + 1,
                    image: newOrnamentImage || addIcon,
                    name: '장식 추가',
                    locked: !newOrnamentImage,
                    price: 5
                };

                setOrnaments([...fetchedOrnaments, addOrnament]);
                setUnlockedOrnaments([...new Set([...purchasedOrnaments, ...freeOrnaments])]);
            }
        } catch (error) {
            console.error('아이콘 정보를 가져오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchIcons();
    }, [token, newOrnamentImage]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUserMe = await axios.get(API_USER_ME, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCoins(responseUserMe.data.data.reward);
            } catch (error) {
                console.error("사용자 정보를 가져오는데 실패했습니다:", error);
            }
        };

        fetchData();
    }, [token]);

    const handleSelect = (ornament) => {
        if (ornament.locked && !unlockedOrnaments.includes(ornament.id)) {
            if (ornament.name === '장식 추가') {
                handleAdd();
            } else {
                setPurchaseOrnament(ornament);
                setShowPurchaseModal(true);
            }
            return;
        }
        if (selectedId === ornament.id) {
            setSelectedId(null);
            setIsNextButtonDisabled(true);
        } else {
            setSelectedId(ornament.id);
            setIsNextButtonDisabled(false);
        }
    };

    const handlePurchase = async (ornamentId) => {
        try {
            const response = await axios.post(API_PURCHASE, {
                iconId: ornamentId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const ornament = ornaments.find((orn) => orn.id === ornamentId);
                setCoins(coins - (ornament.price || 0));
                setUnlockedOrnaments(prevUnlocked => [...new Set([...prevUnlocked, ornamentId])]);
                setShowPurchaseModal(false);
                setSelectedId(ornamentId);
                setIsNextButtonDisabled(false);
                alert('구매가 완료되었습니다!');
            } else {
                console.error('장식을 구매하는데 실패했습니다:', response.status);
            }
        } catch (error) {
            console.error('구매 중 오류가 발생했습니다:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewOrnamentImage(file);
            setShowNameInputModal(true);
        }
    };

    const handleAdd = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const saveOrnamentAndPurchase = async () => {
        if (newOrnamentImage && ornamentName) {
            const formData = new FormData();
            formData.append('iconName', ornamentName);
            formData.append('price', '0');
            formData.append('iconImage', newOrnamentImage);

            try {
                const response = await axios.post(API_ICONS, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('서버 응답:', response.data);  // 응답 로깅

                if (response.status === 200 && response.data?.data?.iconId) {
                    const newOrnamentId = response.data.data.iconId;
                    setPurchaseOrnament({ id: newOrnamentId, ...response.data.data });
                    setShowPurchaseModal(true);
                } else {
                    console.error('예상치 못한 응답 상태 또는 데이터 구조입니다:', response.status, response.data);
                }
            } catch (error) {
                console.error('새로운 장식을 저장하는데 실패했습니다:', error);
                if (error.response) {
                    console.error('오류 응답:', error.response.data);
                    console.error('오류 상태:', error.response.status);
                } else if (error.request) {
                    console.error('요청 오류:', error.request);
                } else {
                    console.error('오류 메시지:', error.message);
                }
            }
        } else if (!newOrnamentImage) {
            alert('먼저 이미지를 업로드하세요.');
        } else if (!ornamentName) {
            alert('장식 이름을 입력해주세요.');
        }
    };

    const closePurchaseModal = () => {
        setShowPurchaseModal(false);
        setPurchaseOrnament(null);
    };

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const handleSaveName = (name) => {
        setOrnamentName(name);
        setShowNameInputModal(false);
        saveOrnamentAndPurchase();
    };

    const ornamentsPerPage = 10;
    const totalPages = Math.ceil(ornaments.length / ornamentsPerPage);

    const renderOrnaments = () => {
        const startIndex = currentPage * ornamentsPerPage;
        const endIndex = startIndex + ornamentsPerPage;
        const visibleOrnaments = ornaments.slice(startIndex, endIndex);

        return visibleOrnaments.map((ornament) => (
            <div
                key={ornament.id}
                className={`ornament-item ${selectedId === ornament.id ? 'selected' : ''} ${ornament.locked && !unlockedOrnaments.includes(ornament.id) ? 'locked' : ''}`}
                onClick={() => handleSelect(ornament)}
            >
                <div
                    className="ornament-background"
                    style={{ backgroundImage: `url(${ornament.image})` }}
                >
                    {ornament.locked && !unlockedOrnaments.includes(ornament.id) && coins < ornament.price && (
                        <div className="locked-overlay">
                            <img src={lockedIcon} alt="잠김 아이콘" className="locked-icon" />
                        </div>
                    )}
                </div>
                <p className="ornament-text">{ornament.name}</p>
            </div>
        ));
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="decoration-modal" onClick={onClose}>
            <div className="decoration-modal-content" onClick={stopPropagation}>
                <span className="decoration-close-button" onClick={onClose}>&times;</span>
                <h2>르방이 장식을 골라주세요</h2>
                <p>보유 코인: {coins}원</p>
                <div className="ornament-container">
                    {renderOrnaments()}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="pagination-buttons">
                    <button onClick={goToPreviousPage} disabled={currentPage === 0}>이전</button>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>다음</button>
                </div>
                <button
                    className={`decoration-next-button ${isNextButtonDisabled ? 'disabled' : ''}`}
                    onClick={handleAdd}
                    disabled={isNextButtonDisabled}
                >
                    추가
                </button>

                <NameInputModal
                    isVisible={showNameInputModal}
                    onClose={() => {
                        setShowNameInputModal(false);
                        setNewOrnamentImage(null);
                        setSelectedId(null);
                        setIsNextButtonDisabled(true);
                    }}
                    onSave={handleSaveName}
                />

                {showPurchaseModal && purchaseOrnament && (
                    <div className="purchase-modal-content">
                        <span className="decoration-close-button" onClick={closePurchaseModal}>&times;</span>
                        <img src={purchaseOrnament.image} alt={purchaseOrnament.name} className="modal-image" />
                        <p className="purchase-modal-name">{purchaseOrnament.name}</p>
                        <p className="purchase-modal-price">{purchaseOrnament.price}원</p>
                        <p className="current-coins">보유 코인: {coins}원</p>
                        <div className="purchase-modal-buttons">
                            <button className="purchase-button" onClick={closePurchaseModal}>닫기</button>
                            <button className="purchase-button" onClick={() => handlePurchase(purchaseOrnament.id)}>구매하기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DecorationModal;