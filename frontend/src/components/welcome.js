import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import { checkLoginStatus, selectBonusReceivedToday, selectLoadingCheckLogin } from '../store/checkLoginSlice';
import { fetchRegistrationData, getRegistrationData, selectLoadingFetchRegistrationData } from '../store/registrationSlice';
import axios from "../axios";
import "../css/welcome.css";
import flame_emoji from "../img/flame_emoji.webp";

const tg = window.Telegram.WebApp;

const Welcome = () => {
    const token = useSelector((state) => state.registration.token);
    const [userExists, setUserExists] = useState(null);
    const [showDailyStreak, setShowDailyStreak] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoadingCheckLogin = useSelector(selectLoadingCheckLogin); // Состояние загрузки из checkLoginSlice
    const isLoadingFetchRegistrationData = useSelector(selectLoadingFetchRegistrationData); // Получаем состояние загрузки
    const bonusReceivedToday = useSelector(selectBonusReceivedToday); // Проверка, был ли бонус получен сегодня

    tg.setHeaderColor("#000000");

    useEffect(() => {
        tg.ready();

        const urlParams = new URLSearchParams(tg.initData);
        console.log(urlParams); //test
        const hash = urlParams.get("hash");

        urlParams.delete("hash");
        urlParams.sort();

        let dataCheckString = "";
        for (const [key, value] of urlParams.entries()) {
            dataCheckString += key + '=' + value + '\n';
        }

        const userData = {
            dataCheckString: dataCheckString.slice(0, -1),
            hash: hash,
        };

        const testRequest = async () => {
            try {
              const response = await axios.get('http://localhost:5000/test');
              console.log('Response from server:', response.data);
            } catch (error) {
              console.error('Error occurred during the request:', error);
            }
          };

        testRequest();

        const fetchData = async () => {
            try {
                const response = await axios.post('/create-user', userData);
                if (response.data.userExists) {
                    setUserExists(true);
                    dispatch(getRegistrationData({
                        token: response.data.token,
                        yearsRegistered: response.data.years,
                        reward: response.data.initial_flames_reward - 500,
                        is_premium: response.data.is_premium,
                    }));
                }
                if (response.data.showRewards) {
                    setShowRewards(true);
                    dispatch(getRegistrationData({
                        token: response.data.token,
                    }));
                    dispatch(fetchRegistrationData(response.data.id)); // Хз вообще надо ли сюда response.data.id ???
                }
            } catch (error) {
                console.error('Ошибка при создании пользователя:', error);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            dispatch(checkLoginStatus(token)); // Вызов действия для проверки статуса входа
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (bonusReceivedToday === false) {
            setShowDailyStreak(true);
            navigate('/DailyStreak');
        }
    }, [bonusReceivedToday, navigate]);

    return (
        <>
            {userExists && !isLoadingCheckLogin && <Navigate to={showDailyStreak ? "/DailyStreak" : "/home"} />}
            {showRewards && !isLoadingFetchRegistrationData && <Navigate to="/ScoreStoryYears" />}
            <div className="welcome-container">
                <div className="loader-box">
                    <img src={flame_emoji} alt="flame_emoji" className="logo_welcome" />
                    <div className="loader"></div>
                </div>
            </div>
            <div className="listing-text">Listing: 27.11.24</div>
        </>
    );
};

export default Welcome;
