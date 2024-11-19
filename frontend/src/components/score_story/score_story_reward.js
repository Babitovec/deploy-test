import React from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { selectIs_premium, selectReward } from '../../store/registrationSlice.js';
import CountUp from 'react-countup';
import "../../css/score_story_style/score_story_reward.css";

// img
import flame_emoji_animated from '../../img/burn_emoji_animated.gif';
import telegram_age_emoji from "../../img/telegram_age_emoji.webp"
import premium_emoji from "../../img/premium_emoji.webp"

const ScoreStoryReward = () => {
  const navigate = useNavigate();
  const reward = useSelector(selectReward);
  const is_premium = useSelector(selectIs_premium);

  console.log("Reward:", reward, "Is premium:", is_premium);

  const handleContinue = () => {
    navigate("/ScoreStoryInfo");
  };

  const handleBack = () => {
    navigate("/ScoreStoryYears");
  };

  return (
    <>
      <div className="back-story" onClick={handleBack}></div>
      <div className="next-story" onClick={handleContinue}></div>
      <div className="lines_reward">
        <div className="line-1-reward"></div>
        <div className="line-2-reward"></div>
        <div className="line-3-reward"></div>
        <div className="line-4-reward"></div>
      </div>

      <div className="score-story-reward-container">
        <span className="reward-handline">You are amazing!</span>
        <span className="reward">Here is your reward</span>
        <img src={flame_emoji_animated} alt="flame_emoji_animated" className="flame-emoji-animated-story-reward" />
        <div className="flames-count-story">
          <div className="countup-wrapper">
            <CountUp start={0} end={is_premium ? reward + 500 : reward} duration={2.5} />
          </div>
        </div>
        <span className="flame-text-story">FLAME</span>

        <div className="rewards-description">
          <div className="rewards-box-age">
            <img src={telegram_age_emoji} alt="telegram_age_emoji" className="rewards-emoji" />
            <span className="reward-title">Account age: {(reward ?? 0).toLocaleString('en-US')}</span>
          </div>
          <div className="rewards-box-premium">
            <img src={premium_emoji} alt="premium_emoji" className="rewards-emoji" />
            <span className="reward-title">Premium status: {is_premium ? 500 : 0}</span>
          </div>
        </div>

        <div className="continue-button-reward" onClick={handleContinue}>
          <span className="continue-text">Continue</span>
        </div>
      </div>
    </>
  );
}

export default ScoreStoryReward;
