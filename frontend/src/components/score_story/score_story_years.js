import "../../css/score_story_style/score_story_years.css";
import React from "react";
import { useSelector } from 'react-redux';
import { selectYearsRegistered } from '../../store/registrationSlice.js';
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
// import flame_emoji from "../../img/flame_emoji.webp";

// img
import confettie from "../../img/confetti.json";

const ScoreStoryYears = () => {
  const tg = window.Telegram.WebApp;
  const navigate = useNavigate();
  const years = useSelector(selectYearsRegistered);

  tg.setHeaderColor("#000000");

  const handleContinue = () => {
    navigate("/ScoreStoryReward");
  };

  return (
    <>
      <div className="next-story" onClick={handleContinue}></div>
      <div className="lines_years">
        <div className="line-1-years"></div>
        <div className="line-2-years"></div>
        <div className="line-3-years"></div>
        <div className="line-4-years"></div>
      </div>

      <div className="score-story-years-container">
        <Lottie className="confettie-story" loop={true} animationData={confettie} />
        <div className="welcome-box">
          <span className="welcome">Welcome to FLAME</span>
          {/* <img src={flame_emoji} alt="flame" className="flame_emoji_years" /> */}
        </div>
        <span className="joined-telegram">You've joined Telegram</span>
        <span className="years">{years ?? 0}</span>
        <div className="years-info">
          <span className="years-ago">years ago</span>
          <span className="account-top">Your account number is {tg.initDataUnsafe.user?.id}</span>
          <span className="check-reward-text">Now let's check your reward</span>
        </div>

        <div className="continue-button-years" onClick={handleContinue}>
          <span className="continue-text">Continue</span>
        </div>
      </div>
    </>
  );
}

export default ScoreStoryYears;