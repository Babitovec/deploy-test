import React, { useEffect, useState } from "react";
import axios from "../axios";
import Lottie from "lottie-react";
import "../css/dailyStreak.css";
import { useSelector } from 'react-redux';
import { selectToken } from '../store/registrationSlice.js';
import useImageLoader from '../hooks/useImageLoader.js';

// Images
import gz_daily from '../img/gz-daily.gif';
import flame_emoji from "../img/flame_emoji.webp";
import gift_emoji from '../img/home/gift_emoji.webp';
import confettie from "../img/confetti.json";

const tg = window.Telegram.WebApp;

const DailyStreak = ({ handleContinue }) => {
    const token = useSelector(selectToken);
    const [streakDay, setStreakDay] = useState(undefined);
    const [flamesReward, setFlamesReward] = useState(undefined);
    const [giftsReward, setGiftsReward] = useState(undefined);
    const [showConfetti, setShowConfetti] = useState(false); // состояние для управления показом анимации

    tg.setHeaderColor("#000000");

    // Хук для подгрузки картинок
    const images = [
        gz_daily,
        flame_emoji,
        gift_emoji,
    ];
    const loading = useImageLoader(images);

    useEffect(() => {
        const fetchDailyBonus = async () => {
            if (!token) {
                console.error("Token is missing");
                return;
            }

            try {
                const response = await axios.post('/daily-bonus',
                    {},
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'ngrok-skip-browser-warning': 'true',
                        },
                    }
                );
                const { today_streak_day, flames_count, gifts_count } = response.data;
                setStreakDay(today_streak_day);
                setFlamesReward(flames_count);
                setGiftsReward(gifts_count);
            } catch (error) {
                console.error('Ошибка при получении бонуса:', error);
            }
        };

        fetchDailyBonus();

        // Установка задержки для показа анимации при условии !loading
        if (!loading) {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                tg.HapticFeedback.impactOccurred('heavy');
            }, 1000);

            return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
        }
    }, [token, loading]);

    const handleContinueClick = () => {
        tg.HapticFeedback.impactOccurred('light');
        handleContinue();
    };

    // Пока изображения загружаются, показываем лоадер
    if (loading) {
        return (
            <div className="loader-box">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <>
            <div className="streak-container">
                {showConfetti && (
                    <Lottie className="confettie" loop={false} animationData={confettie} />
                )}
                <img src={gz_daily} alt="gz_daily" className="logo_streak" />
                <div className="day-streak">{streakDay}</div>
                <div className="rewards-title">day check-in</div>
                <div className="rewards-container">
                    <div className="reward-box-1">
                        <img src={flame_emoji} alt="flame_emoji_animated" className="emoji_reward" />
                        <div className="count-daily-reward">{flamesReward}</div>
                        <div className="reward-txt">Flames</div>
                    </div>
                    <div className="reward-box-2">
                        <img src={gift_emoji} alt="gift_emoji" className="emoji_reward" />
                        <div className="count-daily-reward">{giftsReward}</div>
                        <div className="reward-txt">Gifts</div>
                    </div>
                </div>
                <div className="description-daily-reward">
                    {`Come back tomorrow for check-in day ${streakDay + 1}`}<br />
                    Skipping a day resets your check-in
                </div>
                <div className="continue-button-daily-reward" onClick={handleContinueClick}>
                    <span className="continue-text">Continue</span>
                </div>
            </div>
            <div className="continue-background"></div>
        </>
    );
};

export default DailyStreak;
