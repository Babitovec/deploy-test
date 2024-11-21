import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../axios.js';
import Skeleton from "react-loading-skeleton";
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../store/registrationSlice.js';
import { selectGiftsCount, selectFlamesCount, updateFromGifts } from '../../store/userDataSlice.js'
import "../../css/mini_games_style/gifts.css";
import Lottie from "lottie-react";
import useImageLoader from '../../hooks/useImageLoader.js';

//Images
import gift_emoji_animated from '../../img/home/gift_emoji_animated.gif';
import congratulations_emoji_animated from '../../img/home/congratulations_emoji_animated.gif';
import confettie from "../../img/reward.json";

const tg = window.Telegram.WebApp;

const Gifts = () => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stateGiftsCount = useSelector(selectGiftsCount);
  const stateFlamesCount = useSelector(selectFlamesCount);
  const [giftsCount, setGiftsCount] = useState(stateGiftsCount); // Состояние для gifts_count
  const [flamesFromGift, setFlamesFromGift] = useState(0); // Состояние для хранения выпавших flames
  const [isClicked, setIsClicked] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [showCongratulations] = useState(true); // Состояние для управления поздравлениями
  const [canClickFlames, setCanClickFlames] = useState(false); // Состояние для контроля клика на flames_received
  const [isErrorAnimation, setIsErrorAnimation] = useState(false); // Состояние для анимации ошибки при количестве подарков 0 или undefined

  tg.setHeaderColor("#FF6C00");

  // Хук для подгрузки картинок
  const images = [
    gift_emoji_animated,
    congratulations_emoji_animated
  ];
  const imagesLoading = useImageLoader(images);

  useEffect(() => {
    // Кнопка назад
    tg.BackButton.show();
    // Устанавливаем обработчик для кнопки "Назад"
    tg.BackButton.onClick(() => {
      // Перенаправляем на страницу Home с помощью navigate
      navigate('/home');
      // Скрываем кнопку "Назад"
      tg.BackButton.hide();
    });

  }, [navigate]); // Добавляем navigate как зависимость


  const fetchUserData = async (tkn) => {
    try {
      console.log('Authorization Header:', 'Bearer ' + tkn); // TEST
      const response = await axios.get(`/get-user`,
        {
          headers: {
            'Authorization': 'Bearer ' + tkn,
          },
        });
      setGiftsCount(response.data.giftsCount);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  useEffect(() => {
    fetchUserData(token); // Загружаем данные пользователя при загрузке компонента
  }, [token]);

  const updateGiftsCount = async () => {
    try {
      const response = await axios.post(`/update-gifts/`,
        { action: 'decrease' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Получаем количество flames из ответа сервера
      const { flamesToAdd } = response.data;
      setGiftsCount(response.data.giftsCount);
      setFlamesFromGift(flamesToAdd); // Устанавливаем выпавшие flames
      dispatch(updateFromGifts({
        updatedFlamesCount: stateFlamesCount + flamesToAdd,
        updatedGiftsCount: response.data.giftsCount,
        updatedLoading: false,
      }));
    } catch (error) {
      console.error('Ошибка при обновлении количества подарков:', error);
    }
  };

  const openGift = () => {
    if (giftsCount === 0 || giftsCount === undefined) {
      // Если количество подарков равно 0 или undefined, показываем анимацию ошибки
      tg.HapticFeedback.notificationOccurred('error'); // Для эффекта вибрации при ошибке
      setIsErrorAnimation(true); // Устанавливаем анимацию ошибки
      setTimeout(() => setIsErrorAnimation(false), 500); // Убираем анимацию через 0.5 секунды
      return;
    } else {
      // Иначе выполняем логику открытия подарка
      tg.HapticFeedback.impactOccurred('medium');
      setIsClicked(true);

      // Отправляем запрос на сервер для обновления количества подарков
      updateGiftsCount();

      setTimeout(() => {
        setIsExploded(true);
        // Разрешаем клик через 2.5 секунды
        setTimeout(() => setCanClickFlames(true), 2500);
      }, 200);
    }
  };

  const handleFlamesClick = () => {
    if (!canClickFlames) return; // Блокируем клики до разрешённого времени

    setIsClicked(false);
    setIsExploded(false);
    setCanClickFlames(false); // Сбрасываем возможность клика 
  };

  if (imagesLoading) {
    return (
      <div className="gifts-container">
        <div className="loader-box">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="gifts-container">
      <div className="gifts_header_in_game">Gifts</div>
      <div className="gift-and-gifts-count">
        {!isClicked ? (
          <img
            src={gift_emoji_animated}
            alt="Gift"
            className={`gift_emoji_animated ${isErrorAnimation ? 'error-animation' : ''}`} // Добавляем класс для анимации ошибки
            onClick={openGift}
          />
        ) : (
          isExploded && showCongratulations ? (
            <>
              <img
                src={congratulations_emoji_animated}
                alt="Congratulations"
                className="explode-emoji"
              />
              <Lottie className="congratulations_emoji_animated" animationData={confettie} />
              <div className="flames_received" onClick={handleFlamesClick}>
                <div className="countup-wrapper">
                  <CountUp start={0} end={flamesFromGift} duration={2.5} />
                </div>
                <span className="flames_text_from_gifts">FLAMES</span>
              </div>
            </>
          ) : (
            isExploded && !showCongratulations ? null : (
              <img
                src={gift_emoji_animated}
                alt="Gift Exploded"
                className="gift_emoji_animated explosion"
              />
            )
          )
        )}
      </div>
      <div className="gifts_count_in_game">
        {giftsCount !== undefined ? `x${giftsCount}` : <Skeleton baseColor="#FFD9A8" highlightColor="#FF9000" />}
      </div>
      <div className="check-in-info">Check in daily to get more gifts</div>
    </div>
  );
};

export default Gifts;
