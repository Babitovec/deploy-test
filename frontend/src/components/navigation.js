import React from "react";
import "../css/navigation.css";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
// import { CSSTransition, TransitionGroup } from "react-transition-group";

//Components
import Home from "./home.js";
import Tasks from "./tasks.js";
import Frens from "./frens.js";
import Stats from "./stats.js";

//Images
import home_icon from '../img/navigation/home_icon.webp';
import tasks_icon from '../img/navigation/tasks_icon.webp';
import friends_icon from '../img/navigation/friends_icon.webp';
import stats_icon from '../img/navigation/stats_icon.webp';

const tg = window.Telegram.WebApp;

function Navigation() {
  const location = useLocation(); // Получаем текущий маршрут

  const handleNavigationClick = () => {
    tg.HapticFeedback.impactOccurred('light');
  };

  return (
    <>
      <nav className="navigation">
        <NavLink 
          to="/home" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          onClick={handleNavigationClick}
        >
          <img src={home_icon} alt="home" className="home_icon" />
          Home
        </NavLink>

        <NavLink 
          to="/tasks" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          onClick={handleNavigationClick}
        >
          <img src={tasks_icon} alt="tasks" className="tasks_icon" />
          Tasks
        </NavLink>

        <NavLink 
          to="/frens" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          onClick={handleNavigationClick}
        >
          <img src={friends_icon} alt="friends" className="friends_icon" />
          Frens
        </NavLink>

        <NavLink 
          to="/stats" 
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          onClick={handleNavigationClick}
        >
          <img src={stats_icon} alt="stats_icon" className="stats_icon" />
          Stats
        </NavLink>
      </nav>

      {/* <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={450}
        > */}
          <Routes location={location}>
            <Route path="/home" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/frens" element={<Frens />} />
            <Route path="/stats" element={<Stats username={tg.initDataUnsafe.user?.username || "Anonymous"} />} />
          </Routes>
        {/* </CSSTransition>
      </TransitionGroup> */}
    </>
  );
}

export default Navigation;
