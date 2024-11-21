export const test = async (req, res) => {
    try {
        console.log('Запрос на /test обработан успешно!');
        res.status(200).json({ message: 'Тестовый запрос выполнен успешно!' });
    } catch (error) {
        console.error('Ошибка test:', error);
        res.status(500).json({ error: 'Ошибка test' });
    }
};