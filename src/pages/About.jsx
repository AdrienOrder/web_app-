// Импортируем хук useState из React
import React, { useState } from 'react';

// Объявляем функциональный компонент About
const About = () => {
    // Состояние для включения/отключения кнопок, изначально кнопки отключены
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Состояние для хранения текущего цвета основной кнопки
    const [buttonColor, setButtonColor] = useState('rgb(0, 123, 255)');

    // Ширина кнопок, задана как переменная
    const buttonWidth = '200px';

    // Функция для переключения состояния активности кнопок
    const toggleButton = () => {
        setIsButtonDisabled(prev => !prev); // инвертирует текущее состояние
    };

    // Функция для инвертирования цвета в формате RGB
    const invertColor = (color) => {
        // Проверка: начинается ли строка с 'rgb'
        if (!color.startsWith('rgb')) {
            return color; // если нет, возвращаем как есть
        }

        // Извлекаем числовые значения из строки цвета и преобразуем в массив чисел
        const rgbValues = color.substring(4, color.length - 1).split(',').map(Number);

        // Инвертируем каждый компонент цвета (255 - значение)
        const invertedRgbValues = rgbValues.map(value => 255 - value);

        // Собираем обратно в строку RGB
        return `rgb(${invertedRgbValues.join(', ')})`;
    };

    // Обработчик клика по основной кнопке — инвертирует её цвет
    const toggleButtonColor = () => {
        setButtonColor(prevColor => invertColor(prevColor));
    };

    // Генератор случайного цвета в формате RGB
    const generateRandomColor = () => {
        const r = Math.floor(Math.random() * 256); // случайное значение от 0 до 255 для красного
        const g = Math.floor(Math.random() * 256); // зелёного
        const b = Math.floor(Math.random() * 256); // синего
        return `rgb(${r}, ${g}, ${b})`; // собираем цвет
    };

    // Обработчик клика по кнопке "Рандомный цвет"
    const handleRandomColorClick = () => {
        setButtonColor(generateRandomColor()); // устанавливаем случайный цвет
    };

    // Возвращаем JSX-разметку
    return (
        // Основной контейнер: вертикальный flex, выравнивание по центру, отступ сверху
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh', paddingTop: '20px' }}>
            {/* Заголовок */}
            <h1>О себе</h1>

            {/* Пример различных регистров текста */}
            <p>about</p>
            <p>ABOUT</p>

            {/* Контейнер кнопки включения/выключения остальных кнопок */}
            <div style={{ marginBottom: '20px' }}>
                <button onClick={toggleButton} className="btn btn-secondary" style={{ width: buttonWidth }}>
                    {/* Текст зависит от текущего состояния */}
                    {isButtonDisabled ? 'Включить кнопки' : 'Выключить кнопки'}
                </button>
            </div>

            {/* Основная кнопка (инвертирует цвет) */}
            <div>
                <button
                    disabled={isButtonDisabled} // отключена, если состояние = true
                    data-testid="custom-button" // тестовый идентификатор
                    className="btn btn-secondary" // Bootstrap класс
                    style={{
                        backgroundColor: isButtonDisabled ? '#f0f0f0' : buttonColor, // цвет зависит от состояния
                        color: isButtonDisabled ? '#888' : 'white', // цвет текста
                        width: buttonWidth,
                        display: 'flex', // выравнивание содержимого
                        justifyContent: 'center',
                        alignItems: 'center',
                        whiteSpace: 'nowrap', // предотвращает перенос
                        overflow: 'hidden', // скрытие переполнения
                        textOverflow: 'ellipsis', // троеточие, если текст обрезается
                    }}
                    onClick={toggleButtonColor} // обработка клика — смена цвета
                >
                    {/* Содержимое кнопки зависит от состояния */}
                    {isButtonDisabled ? (
                        // Если выключена — отображаем крестик
                        <span style={{ fontSize: '20px', color: '#ccc' }}>&#10006;</span>
                    ) : (
                        // Иначе текст
                        'Нажми меня (в негативе)'
                    )}
                </button>
            </div>

            {/* Кнопка "Рандомный цвет" */}
            <div style={{ marginTop: '20px' }}>
                <button
                    data-testid="random-color-button" // идентификатор для теста
                    disabled={isButtonDisabled} // отключена, если состояние = true
                    className="btn btn-secondary" // стиль
                    style={{
                        backgroundColor: isButtonDisabled ? '#f0f0f0' : buttonColor, 
                        // используем тот же цвет, что и в основной кнопке
                        color: isButtonDisabled ? '#888' : 'white',
                        width: buttonWidth,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    onClick={handleRandomColorClick} // обработчик клика
                >
                    {/* Содержимое зависит от состояния */}
                    {isButtonDisabled ? (
                        // Если кнопка выключена — крестик
                        <span style={{ fontSize: '20px', color: '#ccc' }}>&#10006;</span>
                    ) : (
                        // Иначе текст
                        'Рандомный цвет'
                    )}
                </button>
            </div>
        </div>
    );
};

// Экспорт компонента по умолчанию
export default About;
