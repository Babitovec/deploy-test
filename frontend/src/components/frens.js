import React, { useEffect } from "react";
import "../css/frens.css";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/registrationSlice.js';
import { getReferrals, selectReferrals, selectLoadingReferrals } from '../store/referralsSlice.js';
import useImageLoader from '../hooks/useImageLoader.js';

// Изображения
import masks_animated from '../img/masks_animated.gif';
import flame_emoji from "../img/flame_emoji.webp";

const tg = window.Telegram.WebApp;

const Frens = () => {
  tg.setHeaderColor("#000000");

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const referrals = useSelector(selectReferrals);
  const referralsLoading = useSelector(selectLoadingReferrals);

  // Хук для подгрузки картинок
  const images = [
    masks_animated,
    flame_emoji
  ];
  const loading = useImageLoader(images);

  //Получаем рефералов
  useEffect(() => {
    if (token) {
      dispatch(getReferrals(token));
    }
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="loader-box">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container-frens">
      <img src={masks_animated} alt="masks_animated" className="masks-emoji-animated" />
      <span className="frens-header">Invite Friends<br />and get more Flame</span>
      <div className="frens-description">Score 10% for each friend</div>

      {referralsLoading && !loading ? (
        <div className="skeleton-container">
          <div className="frens-count-container-sleketon">
            <Skeleton className="frens-count-skeleton" />
          </div>
          {Array(8).fill(0).map((_, index) => (
            <Skeleton key={index} className="invited-fren-skeleton" />
          ))}
        </div>
      ) : (
        <>
          <div className="frens-count">{referrals.length} Friends</div>
          <div className="frens-invited-container">
            {referrals.length === 0 ? (
              <div className="no-referrals-message-container">
                <div className="no-referrals-message">You haven't invited any friends yet</div>
              </div>
            ) : (
              referrals.map((friend, index) => (
                <div className="invited-fren" key={index}>
                  <div className="fren-info">
                    <div className="username-and-frens-count">
                      <div className="fren-username">{friend.referral_username}</div>
                      <div className="username-years">{friend.referral_years} years</div>
                    </div>
                    <div className="fren-total-earned-container">
                      <div className="received_from_friend">+{friend.got_from_referral}</div>
                      <img src={flame_emoji} alt="burn_logo" className="burn-logo-claim" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      <a href={`http://t.me/share/url?url=https://t.me/flame_coin_bot/app?startapp=${tg.initDataUnsafe.user?.id}&text=Check how long you've been on Telegram and get free tokens 🔥`} className="invite-fren-background">
        <div className="invite-fren-button">
          <div className="invite-fren-text">Invite Friends</div>
        </div>
      </a>
    </div>
  );

};

export default Frens;
