import React, { useEffect, useCallback } from "react";
import axios from "../axios";
import "../css/home.css";
import { NavLink } from "react-router-dom";
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/registrationSlice.js';
import { getUserData, selectFlamesCount, selectGiftsCount, selectLoadingUserdata } from '../store/userDataSlice.js'
import { selectWasSent, setWasSent } from "../store/walletSlice.js";
import useImageLoader from '../hooks/useImageLoader.js';

// Images
import flame_emoji from "../img/flame_emoji.webp";
import flame_emoji_animated from '../img/burn_emoji_animated.gif';
import gift_emoji from '../img/home/gift_emoji.webp';
import play_icon from "../img/home/play-button.webp";
import wallet_icon from "../img/home/wallet-icon.png";

const tg = window.Telegram.WebApp;

const Home = () => {
  tg.setHeaderColor("#FF5718");

  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const flamesCount = useSelector(selectFlamesCount);
  const giftsCount = useSelector(selectGiftsCount);
  const loading = useSelector(selectLoadingUserdata);
  const wasSent = useSelector(selectWasSent);

  // Работа с кошельком
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress(); // Текущий адрес

  const disconnectWallet = async () => {
    if (wasSent) {
      await tonConnectUI.disconnect();
      tg.HapticFeedback.notificationOccurred("warning");
      dispatch(setWasSent(false));
    }
  };

  const handleConnectWallet = async () => {
    await tonConnectUI.openModal();
    console.log('Ожидаем обновление адреса...');
  };

  // Мемоизация функции отправки адреса
  const sendWalletAddressToDatabase = useCallback(async (address) => {
    try {
      console.log('Отправка адреса:', address); // Проверка, что адрес передается
      const response = await axios.post('/wallet', { walletAddress: address }, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      console.log('Адрес успешно отправлен:', response.data);
    } catch (error) {
      console.error('Ошибка при отправке адреса:', error);
    }
  }, [token]);

  // useEffect для отслеживания изменений в userFriendlyAddress
  useEffect(() => {
    if (userFriendlyAddress && !wasSent) {
      tg.HapticFeedback.notificationOccurred("success");
      console.log('User Address detected in useEffect:', userFriendlyAddress); // Проверка после обновления
      sendWalletAddressToDatabase(userFriendlyAddress);
      dispatch(setWasSent(true));
    }
  }, [userFriendlyAddress, sendWalletAddressToDatabase, wasSent, dispatch]); // Добавляем sendWalletAddressToDatabase в зависимости

  //Сокращение адреса кошелкьа
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Хук для подгрузки картинок
  const images = [
    flame_emoji,
    flame_emoji_animated,
    gift_emoji,
    play_icon
  ];
  const imagesLoading = useImageLoader(images);

  const handleNavigationClick = () => {
    tg.HapticFeedback.impactOccurred('light');
  };

  // Получение данных пользователя
  useEffect(() => {
    if (token) {
      dispatch(getUserData(token));
    }
  }, [token, dispatch]);

  // Пока изображения или данные загружаются, показываем лоадер
  if (imagesLoading) {
    return (
      <div className="loader-box">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container-home">
      <div className="score-stats">
        <NavLink className="score-stats-box" to="/ScoreStoryYears" onClick={handleNavigationClick}>
          <img src={play_icon} alt="play_icon" className="play_icon" />
          <div className="score-stats-text">Your Score</div>
        </NavLink>
      </div>

      <div className="home-box">
        <div className="border-box-home">
        </div>
        <div className="profile">
          <img src={flame_emoji_animated} alt="flame_emoji_animated" className="flame_logo" />
          <div className="score-count">
            {!loading && flamesCount !== undefined ? flamesCount.toLocaleString('en-US') : <Skeleton />}
          </div>
          <span className="flame-text-score">FLAME</span>
        </div>

        {/* Wallet */}
        <div className="connect-button" onClick={userFriendlyAddress ? disconnectWallet : handleConnectWallet}>
          <img src={wallet_icon} alt="wallet" className="wallet-icon" />
          {userFriendlyAddress ? truncateAddress(userFriendlyAddress) : 'Connect Wallet'}
        </div>


        <div className="gifts">
          <div className="in-gifts">
            <span className="gifts-header">Gifts</span>
            <div className="gift-gif-and-count">
              <img src={gift_emoji} alt="gift" className="gift-gif" />
              <div className="gifts-count">
                {!loading && giftsCount !== undefined ? `x${giftsCount}` : <Skeleton baseColor="#FFD9A8" highlightColor="#FF9000" />}
              </div>
            </div>
            <NavLink className="open-gift-page" to="/Gifts" onClick={handleNavigationClick}>Open</NavLink>
          </div>
        </div>

        <div className="burn">
          <div className="in-gifts-burn">
            <span className="gifts-header">Burn</span>
            <div className="gift-gif-and-count">
              <img src={flame_emoji} alt="gift" className="gift-gif" />
              <div className="total-burned-text">Coming 15.11.24</div>
            </div>
            <span className="open-burn-page">Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
