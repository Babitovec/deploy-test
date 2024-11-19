import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
// import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Components
import Welcome from "./components/welcome.js";
import ScoreStoryYears from "./components/score_story/score_story_years";
import ScoreStoryReward from "./components/score_story/score_story_reward";
import ScoreStoryInfo from "./components/score_story/score_story_info";
import ScoreStoryShare from "./components/score_story/score_story_share";
import DailyStreak from "./components/dailyStreak.js";
import Gifts from "./components/mini_games/gifts.js";
import Navigation from "./components/navigation.js";

const tg = window.Telegram.WebApp;

tg.setHeaderColor("#000000");
tg.setBackgroundColor("#000000");
tg.expand();
tg.disableVerticalSwipes();

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDailyStreak, setShowDailyStreak] = useState(false);

  const handleContinue = () => {
    setShowDailyStreak(false); // Скрываем DailyStreak
    navigate('/home'); // Перенаправляем на Home
  };

  return (
    <>
      {/* <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={450}
        > */}
          <Routes>
            <Route path="/" element={<Navigate to="/Welcome" />} />
            <Route path="/Welcome" element={<Welcome />} />
            <Route path="/Gifts" element={<Gifts />} />
            <Route path="/DailyStreak" element={<DailyStreak handleContinue={handleContinue} />} />
            {!showDailyStreak && (
              <>
                <Route path="/ScoreStoryYears" element={<ScoreStoryYears />} />
                <Route path="/ScoreStoryReward" element={<ScoreStoryReward />} />
                <Route path="/ScoreStoryInfo" element={<ScoreStoryInfo />} />
                <Route path="/ScoreStoryShare" element={<ScoreStoryShare />} />
              </>
            )}
          </Routes>
        {/* </CSSTransition>
      </TransitionGroup> */}

      {location.pathname !== "/ScoreStoryYears"
        && location.pathname !== "/ScoreStoryReward"
        && location.pathname !== "/ScoreStoryInfo"
        && location.pathname !== "/ScoreStoryShare"
        && location.pathname !== "/DailyStreak"
        && location.pathname !== "/Welcome"
        && location.pathname !== "/Gifts" && <Navigation />}
    </>
  );
};

export default App;
