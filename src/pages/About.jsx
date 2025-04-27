// src/components/About.jsx
import React, { useState } from 'react';

const About = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Состояние для управления состоянием кнопки

    const toggleButton = () => {
        setIsButtonDisabled(prev => !prev); // Переключаем состояние кнопки
    };

    return (
        <div>
            <h1>О себе</h1>
            <p>Меня зовут Саша. Я кто-то.</p>
            <p>В этом приложении вы можете что-то.</p>
            <button onClick={toggleButton} className="btn btn-secondary">
                {isButtonDisabled ? 'Включить кнопку' : 'Выключить кнопку'}
            </button>
            <br />
            <button disabled={isButtonDisabled} data-testid="custom-button" className="btn btn-primary">
                Нажми меня
            </button>
        </div>
    );
};

export default About;