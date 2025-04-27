// Импортируем необходимые библиотеки и компоненты
import React, { useState } from 'react'; // Импортируем React и хук useState для управления состоянием

// Определяем функциональный компонент About
const About = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Состояние для управления состоянием кнопки (по умолчанию кнопка отключена)

    // Функция для переключения состояния кнопки
    const toggleButton = () => {
        setIsButtonDisabled(prev => !prev); // Переключаем состояние кнопки на противоположное
    };

    return (
        <div> {/* Контейнер для содержимого компонента */}
            <h1>О себе</h1> {/* Заголовок первого уровня с текстом "О себе" */}
            <p>about</p> {/* Параграф с текстом "about" */}
            <p>ABOUT</p> {/* Параграф с текстом "ABOUT" */}
            <button onClick={toggleButton} className="btn btn-secondary"> {/* Кнопка для переключения состояния другой кнопки */}
                {isButtonDisabled ? 'Включить кнопку' : 'Выключить кнопку'} {/* Текст кнопки меняется в зависимости от состояния isButtonDisabled */}
            </button>
            <br /> {/* Перенос строки для разделения кнопок */}
            <button disabled={isButtonDisabled} data-testid="custom-button" className="btn btn-primary"> {/* Кнопка, которая будет отключена в зависимости от состояния isButtonDisabled */}
                Нажми меня {/* Текст на кнопке */}
            </button>
        </div>
    );
};

// Экспортируем компонент About для использования в других частях приложения
export default About;