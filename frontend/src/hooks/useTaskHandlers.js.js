import axios from "../axios";
import { updateTaskStatus } from '../store/tasksSlice';

const tg = window.Telegram.WebApp;

export const handleEmojiInUsername = async (token, dispatch) => {
  try {
    const response = await axios.get(`/tasks/check-emoji`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (response.data.completed) {
      tg.HapticFeedback.notificationOccurred('success');
      console.log("Успех, 🔥 имеется");
      dispatch(updateTaskStatus({ taskName: "emoji_in_name", status: "completed" }));
    } else {
      tg.HapticFeedback.notificationOccurred('error');
      console.log("Неудача, 🔥 не имеется");
    }
  } catch (error) {
    console.error("Ошибка при проверке эмодзи 🔥:", error);
    tg.HapticFeedback.notificationOccurred('error'); // Если ошибка
  }
};


export const handleInvitedFriends = async (token, dispatch) => {
  try {
    const response = await axios.get(`/tasks/invite-friends`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (response.data.completed) {
      console.log("Успех, есть 5 рефов.");
      dispatch(updateTaskStatus({ taskName: "invite_5_friends", status: "completed" }));
      tg.HapticFeedback.notificationOccurred('success');
    } else {
      console.log("Нет 5 рефов.");
      tg.HapticFeedback.notificationOccurred('error');
    }
  } catch (error) {
    console.error("Ошибка при проверке рефов:", error);
    tg.HapticFeedback.notificationOccurred('error');
  }
};


export const handleConectedWallet = async (token, dispatch) => {
  try {
    const response = await axios.get(`/tasks/connect_wallet`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (response.data.completed) {
      console.log("Успех, кошель подключен.");
      dispatch(updateTaskStatus({ taskName: "connect_wallet", status: "completed" }));
      tg.HapticFeedback.notificationOccurred('success');
    } else {
      console.log("Неудача, кошелек не подключен!");
      tg.HapticFeedback.notificationOccurred('error');
    }
  } catch (error) {
    console.error("Ошибка при проверке адреса кошелька:", error);
    tg.HapticFeedback.notificationOccurred('error');
  };
};

export const handleOpenTelegramChannel = async (token, dispatch) => {
  tg.openTelegramLink("https://t.me/flame_coin_community"); //Заменить на реальный тг канал
  try {
    const response = await axios.get(`/tasks/sub_flame_tg`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (response.data.completed) {
      console.log("Подписан на тг канал.");
      dispatch(updateTaskStatus({ taskName: "sub_flame_tg", status: "completed" }));
      tg.HapticFeedback.notificationOccurred('success');
    } else {
      console.log("Не подписан на тг канал.");
      tg.HapticFeedback.notificationOccurred('error');
    }
  } catch (error) {
    console.error("Ошибка при проверке подписки:", error);
    tg.HapticFeedback.notificationOccurred('error');
  }
};


export const handleOpenX = async (token, dispatch) => {
  tg.openLink("https://x.com/realDogsHouse"); //Заменить на реальный твиттер
  try {
    const response = await axios.get(`/tasks/sub_flame_x`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (response.data.completed) {
      console.log("Подписан на X.");
      dispatch(updateTaskStatus({ taskName: "sub_flame_x", status: "completed" }));
      tg.HapticFeedback.notificationOccurred('success');
    } else {
      console.log("Не подписан на X.");
      tg.HapticFeedback.notificationOccurred('error');
    }
  } catch (error) {
    console.error("Ошибка при проверке подписки X:", error);
    tg.HapticFeedback.notificationOccurred('error');
  }
};

export const handleShareOnX = async (token, dispatch) => {
  tg.openLink("https://x.com/realDogsHouse"); //Заменить на реальную ссылку share
  try {
    const response = await axios.get(`/tasks/share_on_x`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (response.data.completed) {
      console.log("Shared on X.");
      dispatch(updateTaskStatus({ taskName: "share_on_x", status: "completed" }));
      tg.HapticFeedback.notificationOccurred('success');
    } else {
      console.log("Not shared on X.");
      tg.HapticFeedback.notificationOccurred('error');
    }
  } catch (error) {
    console.error("Ошибка при проверке share on X:", error);
    tg.HapticFeedback.notificationOccurred('error');
  }
};
