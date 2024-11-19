import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectYearsRegistered } from '../../store/registrationSlice.js';
import "../../css/score_story_style/score_story_share.css";

import gift_emoji from '../../img/home/gift_emoji.webp';

import oneYear from "../../img/story_images/1_year.webp";
import twoYears from "../../img/story_images/2_years.webp";
import threeYears from "../../img/story_images/3_years.webp";
import fourYears from "../../img/story_images/4_years.webp";
import fiveYears from "../../img/story_images/5_years.webp";
import sixYears from "../../img/story_images/6_years.webp";
import sevenYears from "../../img/story_images/7_years.webp";
import eightYears from "../../img/story_images/8_years.webp";
import nineYears from "../../img/story_images/9_years.webp";
import tenYears from "../../img/story_images/10_years.webp";
import elevenYears from "../../img/story_images/11_years.webp";
import twelveYears from "../../img/story_images/12_years.webp";

const tg = window.Telegram.WebApp;

const ScoreStoryShare = () => {
    const navigate = useNavigate();
    const years = useSelector(selectYearsRegistered);

    // Сопоставление значений с изображениями
    const images = {
        1: oneYear,
        2: twoYears,
        3: threeYears,
        4: fourYears,
        5: fiveYears,
        6: sixYears,
        7: sevenYears,
        8: eightYears,
        9: nineYears,
        10: tenYears,
        11: elevenYears,
        12: twelveYears,
    };

    const selectedImage = images[years] || oneYear; // Выбор изображения, по умолчанию oneYear

    const handleContinue = () => {
        navigate("/Home");
    };

    const handleBack = () => {
        navigate("/ScoreStoryInfo");
    };

    const handleContinueAndShare = () => {
        tg.shareToStory(
            'https://funny-hamster-88e22c.netlify.app/static/media/7_years.990f432fd1a5b7397f1c.webp',
            {
                text: `https://t.me/flame_coin_bot/app?startapp=${tg.initDataUnsafe.user?.id}`
            }
        );
    }

    return (
        <>
            <div className="back-story" onClick={handleBack}></div>
            <div className="next-story" onClick={handleContinue}></div>
            <div className="lines_share">
                <div className="line-1-share"></div>
                <div className="line-2-share"></div>
                <div className="line-3-share"></div>
                <div className="line-4-share"></div>
            </div>

            <div className="score-story-share-container">
                <div className="handline-box">
                    <span className="share-handline">Share story and get</span>
                    <img src={gift_emoji} alt="gift" className="gift-in-handline" />
                </div>
                <img src={selectedImage} alt={`${years} year story`} className="storyImg" />
                <div className="share-story-button" onClick={handleContinueAndShare}>
                    <span className="share-story-text">Share to story</span>
                </div>
            </div>
        </>
    );
}

export default ScoreStoryShare;
