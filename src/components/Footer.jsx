// src/components/Footer.jsx
import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { Container } from 'react-bootstrap';
import FeedbackBlock from '../FeedbackBlock'; // Импортируем FeedbackBlock
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

function Footer() {
    const { isDarkTheme } = useTheme();
    const [showFeedback, setShowFeedback] = useState(false); // Состояние для управления видимостью блока отзывов

    const toggleFeedback = () => {
        setShowFeedback(!showFeedback);
    };

    return (
        <footer className={`footer ${isDarkTheme ? 'dark-f' : 'light-f'}`}>
            <Container>
                {showFeedback && <FeedbackBlock />} {/* Условный рендеринг блока отзывов */}
                <button className="btn btn-primary mt-3" onClick={toggleFeedback}>
                    Отзывы
                </button>
                <div className="footer-content">
                    <p className="mb-0">&copy; 2025 все права защищены (кроме водительских, но это неточно)</p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;