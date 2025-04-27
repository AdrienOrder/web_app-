// Импортируем необходимые библиотеки и компоненты
import React, { useState } from 'react'; // Импортируем React и хук useState для управления состоянием
import { useTheme } from '../ThemeContext'; // Импортируем хук для работы с темой приложения
import { Container } from 'react-bootstrap'; // Импортируем компонент контейнера из Bootstrap
import FeedbackBlock from '../FeedbackBlock'; // Импортируем компонент блока отзывов
import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем стили Bootstrap
import './Footer.css'; // Импортируем стили для компонента Footer

// Определяем функциональный компонент Footer
function Footer() {
    const { isDarkTheme } = useTheme(); // Получаем информацию о текущей теме (темной или светлой)
    const [showFeedback, setShowFeedback] = useState(false); // Создаем состояние для управления видимостью блока отзывов

    // Функция для переключения видимости блока отзывов
    const toggleFeedback = () => {
        setShowFeedback(!showFeedback); // Меняем состояние showFeedback на противоположное
    };

    return (
        <footer className={`footer ${isDarkTheme ? 'dark-f' : 'light-f'}`}> {/* Контейнер футера с классом в зависимости от темы */}
            <Container> {/* Контейнер Bootstrap для размещения содержимого футера */}
                {showFeedback && <FeedbackBlock />} {/* Условный рендеринг блока отзывов, если showFeedback истинно */}
                <button className="btn btn-primary mt-3" onClick={toggleFeedback}> {/* Кнопка для переключения блока отзывов */}
                    Отзывы {/* Текст кнопки */}
                </button>
                <div className="footer-content"> {/* Контейнер для содержимого футера */}
                    <p className="mb-0">&copy; 2025 все права защищены (кроме водительских, но это неточно)</p> {/* Текст 
                    с авторскими правами */}
                </div>
            </Container>
        </footer>
    );
}

// Экспортируем компонент Footer для использования в других частях приложения
export default Footer;