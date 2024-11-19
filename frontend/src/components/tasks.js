import React, { useEffect, useState } from "react";
import "../css/tasks.css";
import Skeleton from "react-loading-skeleton";
import { getTasks, selectTasks, selectLoadingGetTasks } from '../store/tasksSlice.js';
import * as taskHook from '../hooks/useTaskHandlers.js';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../store/registrationSlice.js';
import useImageLoader from '../hooks/useImageLoader.js';

// Images
import tasks_gift_emoji_animated from "../img/tasks_gift_emoji_animated.gif";
import tg_icon from "../img/tasks/tg_icon.webp";
import x_icon from "../img/tasks/x_icon.webp";
import flame_emoji from "../img/flame_emoji.webp";
import wallet_icon from "../img/tasks/wallet_icon.webp";
import friends_icon from '../img/tasks/friends_icon.png';
import check_mark from "../img/tasks/check-mark.png";

const tg = window.Telegram.WebApp;

const Tasks = () => {
  tg.setHeaderColor("#000000");

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userTasks = useSelector(selectTasks);
  const loadingTasks = useSelector(selectLoadingGetTasks);

  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [errorTaskId, setErrorTaskId] = useState(null); // Состояние для отслеживания ошибки

  useEffect(() => {
    if (token) {
      dispatch(getTasks(token));
    }
  }, [token, dispatch]);

  const images = [
    tasks_gift_emoji_animated,
    tg_icon,
    x_icon,
    flame_emoji,
    wallet_icon,
    friends_icon,
    check_mark,
  ];

  const loadingImages = useImageLoader(images);

  const handleTaskClick = async (taskId, taskHandler) => {
    setLoadingTaskId(taskId);
    setErrorTaskId(null);
    try {
      const result = await taskHandler();
      if (!result || result.status === false) {
        // Если результат задачи указывает на ошибку или статус `false`
        setErrorTaskId(taskId);
        setTimeout(() => setErrorTaskId(null), 2250);
      }
    } catch (error) {
      // Обработка ошибки
      setErrorTaskId(taskId);
      setTimeout(() => setErrorTaskId(null), 2250);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const tasksData = [
    {
      id: 0,
      title: "Add 🔥 in Telegram name",
      points: "+1 Gift 🎁",
      icon: flame_emoji,
      onClick: () => handleTaskClick(0, () => taskHook.handleEmojiInUsername(token, dispatch)),
    },
    {
      id: 1,
      title: "Invite 5 friends",
      points: "+5 Gifts 🎁",
      icon: friends_icon,
      onClick: () => handleTaskClick(1, () => taskHook.handleInvitedFriends(token, dispatch)),
    },
    {
      id: 2,
      title: "Connect your wallet",
      points: "+1 Gift 🎁",
      icon: wallet_icon,
      onClick: () => handleTaskClick(2, () => taskHook.handleConectedWallet(token, dispatch)),
    },
    {
      id: 3,
      title: "Subscribe to Flame Telegram",
      points: "+100 Flame 🔥",
      icon: tg_icon,
      onClick: () => handleTaskClick(3, () => taskHook.handleOpenTelegramChannel(token, dispatch)),
    },
    {
      id: 4,
      title: "Subscribe to Flame X",
      points: "+100 Flame 🔥",
      icon: x_icon,
      onClick: () => handleTaskClick(4, () => taskHook.handleOpenX(token, dispatch)),
    },
    {
      id: 5,
      title: "Tweet about Flame",
      points: "+100 Flame 🔥",
      icon: x_icon,
      onClick: () => handleTaskClick(5, () => taskHook.handleShareOnX(token, dispatch)),
    },
  ];

  if (loadingImages) {
    return (
      <div className="loader-box">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container-tasks">
      <img src={tasks_gift_emoji_animated} alt="tasks_animated" className="tasks_emoji_animated" />
      <span className="tasks-header">Tasks</span>
      <span className="tasks-description">Complete tasks and get more Flame.</span>
      <div className="tasks">
        {tasksData.map((task) => {
          const userTask = userTasks[task.id] || {};

          return (
            <div className="task" key={task.id}>
              <img src={task.icon} alt={`${task.title} icon`} className="icon" />
              <div className="text">
                <div className="title">{task.title}</div>
                <div className="points">{task.points}</div>
              </div>
              {userTask.completed ? (
                <div className="task-done">
                  <img src={check_mark} alt="check_mark" className="check_mark" />
                </div>
              ) : (
                <>
                  {loadingTasks ? (
                    <div className="open-button">
                      <Skeleton className="open-button-skeleton" />
                    </div>
                  ) : loadingTaskId === task.id ? (
                    <div className="open-button">
                      <div className="loader-box-task-status">
                        <div className="loader-task-status"></div>
                      </div>
                    </div>
                  ) : errorTaskId === task.id ? (
                    <div className="open-button">
                      <div className="circle">
                        <div className="error"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="open-button" onClick={task.onClick}>
                      <div className="open">Start</div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

};

export default Tasks;
