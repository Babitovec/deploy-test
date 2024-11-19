import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/score_story_style/score_story_info.css";

// img
import money_emoji_animated from "../../img/money_emoji_animated.gif"
import rocket from "../../img/roadmap_emoji/rocket.png"
import flame from "../../img/flame_emoji.webp"
import money from "../../img/roadmap_emoji/money.png"
import time from "../../img/roadmap_emoji/time.png"
import listing from "../../img/roadmap_emoji/listing.png"

const ScoreStoryReward = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/ScoreStoryShare");
  };

  const handleBack = () => {
    navigate("/ScoreStoryReward");
  };

  return (
    <div className="score-story-info">
      <div className="back-story" onClick={handleBack}></div>
      <div className="next-story" onClick={handleContinue}></div>
      <div className="lines_info">
        <div className="line-1-info"></div>
        <div className="line-2-info"></div>
        <div className="line-3-info"></div>
        <div className="line-4-info"></div>
      </div>
      <div className="score-story-info-container">
        <span className="roadmap-text">Roadmap</span>
        <span className="notification-text">You won't have to wait long</span>
        <img src={money_emoji_animated} alt="money_emoji_animated" className="money-emoji-animated-story-reward" />
        <div className="roadmap-container">
          <div className="phase">
            <div className="phase-title-box">
              <img src={rocket} alt="rocekt" className="phase-emoji" />
              <span className="phase-title">Launch</span>
            </div>
            <span className="phase-date">20.11.24</span>
          </div>
          <div className="phase">
            <div className="title-rodmap ">
              <div className="phase-title-box">
                <img src={flame} alt="rocekt" className="phase-emoji" />
                <span className="phase-title">Burn</span>
              </div>
            </div>
            <span className="phase-date">24.11.24</span>
          </div>
          <div className="phase">
            <div className="phase-title-box">
              <img src={money} alt="rocekt" className="phase-emoji" />
              <span className="phase-title">Limited presale</span>
            </div>
            <span className="phase-date">27.11.24</span>
          </div>
          <div className="phase">
            <div className="phase-title-box">
              <img src={time} alt="rocekt" className="phase-emoji" />
              <span className="phase-title">Waiting room</span>
            </div>
            <span className="phase-date">04.12.24</span>
          </div>
          <div className="phase">
            <div className="phase-title-box">
              <img src={listing} alt="rocekt" className="phase-emoji" />
              <span className="phase-title">Listing</span>
            </div>
            <span className="phase-date">06.12.24</span>
          </div>
        </div>
        <div className="continue-button-info" onClick={handleContinue}>
          <span className="continue-text">Continue</span>
        </div>
      </div>
    </div >
  );
};

export default ScoreStoryReward;
