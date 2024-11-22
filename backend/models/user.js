import mongoose from "mongoose";

//Создаем схему юзера
const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        // immutable: true, // Делает поле неизменяемым, во время разработки лучше пока не делать
    },
    is_bot: {
        type: Boolean,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    language_code: {
        type: String,
    },
    is_premium: {
        type: Boolean,
    },
    photo_url: {
        type: String,
    },
    ip: {
        type: String,
    },
    flame_id: {
        type: Number,
        unique: true,
    },
    // Connected wallet
    wallet_address: {
        type: String,
    },
    flames_count: {
        type: Number,
        index: true, // Добавляем индексацию
    },
    // Начальная награда пользователя
    initial_flames_reward: {
        type: Number,
    },
    gifts_count: {
        type: Number,
    },
    opened_gifts_count: {
        type: Number,
    },
    flames_burned: {
        type: Number,
    },
    // Для пресейла
    flames_bought: {
        type: Number,
    },
    ton_spent: {
        type: Number,
    },
    // Referrals
    referrals: [{
        referral_username: {
            type: String,
        },
        referral_years: {
            type: Number,
        },
        got_from_referral: {
            type: Number,
        },
        referral_telegram_id: {
            type: Number,
        }
    }],
    // Telegram ID от кого перешел по реферальной ссылке
    referrer_tg_id: {
        type: Number,
        // immutable: true, // Делает поле неизменяемым
    },
    // Сколько лет пользователь в Telegram
    years: {
        type: Number,
    },
    // Текущий день серии бонусов
    streak_day: {
        type: Number, default: 1
    },
    // Время последнего входа
    last_time_login: {
        type: Date, default: null
    },
    // Время последнего получения бонуса
    last_time_got_daily_reward: {
        type: Date, default: null,
    },
    // Tasks
    tasks: [{
        name: {
            type: String, // Название задания
            required: true,
        },
        completed: {
            type: Boolean, // Статус выполнения
            default: false,
        },
        date_completed: {
            type: Date, // Дата выполнения, если задание выполнено
            default: null,
        },
    }],
},
    {
        timestamps: true, //Добавляем дату создания
    },
)

export default mongoose.model("User", UserSchema);