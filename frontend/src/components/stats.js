import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/registrationSlice.js';
import { getLeaderboard, selectLeaderboard, selectTotalUsersLeaderboard, selectUserRankLeaderboard, selectUserUsernameLeaderboard, selectUserFlamesCountLeaderboard, selectLoadingLeaderboard } from '../store/leaderboardSlice.js';
import Skeleton from "react-loading-skeleton";
import useImageLoader from '../hooks/useImageLoader.js'; // Хук для подгрузки картинок
import "../css/stats.css";

// Images
import crown_emoji_animated_compressed from "../img/crown_emoji_animated_compressed.gif";
import leaderboard_member_flame_icon from "../img/flame_emoji.webp";

const tg = window.Telegram.WebApp;

const Stats = () => {
  tg.setHeaderColor("#000000");

  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const leaderboard = useSelector(selectLeaderboard); // Топ пользователей, инициализирован как пустой массив
  const totalUsers = useSelector(selectTotalUsersLeaderboard); // Общее количество пользователей
  const userFlamesCount = useSelector(selectUserFlamesCountLeaderboard); // Flames пользователя
  const userRank = useSelector(selectUserRankLeaderboard); // Место пользователя в рейтинге
  const userUsername = useSelector(selectUserUsernameLeaderboard); // username пользователя
  const leaderboardLoading = useSelector(selectLoadingLeaderboard);

  // Хук для подгрузки картинок
  const images = [
    crown_emoji_animated_compressed,
    leaderboard_member_flame_icon
  ];
  const loading = useImageLoader(images);


  useEffect(() => {
    if (token) {
      dispatch(getLeaderboard(token));
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
    <div className="container-stats">
      <img src={crown_emoji_animated_compressed} alt="crown_emoji_animated" className="crown-emoji-animated" />
      <span className="stats-header">Leaderboard</span>

      {leaderboardLoading && !loading  ? (
        <div className="skeleton-container">
          <Skeleton className="user-stats-box-container-skeleton" />
          <Skeleton className="total-users-skeleton" />
          <div className="leaderboard">
            {Array(8).fill(0).map((_, index) => (
              <Skeleton key={index} className="leaderboard-member-skeleton" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Отображаем информацию о пользователе */}
          <div className="user-stats-box-container">
            <div className="user-stats-box">
              <div className="username-and-flame-count-box">
                <div className="stats_username">{userUsername}</div>
                <div className="burn-count">{userFlamesCount.toLocaleString('en-US')} FLAME</div>
              </div>
              <div className="user-rank">#{userRank || "N/A"}</div>
            </div>
          </div>

          {/* Отображаем общее количество пользователей */}
          <div className="total-users">{totalUsers.toLocaleString('en-US')} Flamers</div>

          <div className="leaderboard">
            {leaderboard.map((user, index) => (
              <div key={index} className="leaderboard-member">
                <div className="rank-and-username-container">
                  <div className="rank-leaderbord-container">
                    <div className={`rank-leaderbord-${index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}>
                      #{index + 1}
                    </div>
                  </div>
                  <div className="leaderboard-member-username">{user.username}</div>
                </div>
                <div className="leaderboard-member-flames">
                  <div className="leaderboard-member-flames-count">{user.flamesCount.toLocaleString('en-US')}</div>
                  <img src={leaderboard_member_flame_icon} alt="flame_icon" className="leaderboard-member-flame-icon" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

};

export default Stats;