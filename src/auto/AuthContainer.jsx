// src/components/AuthContainer.jsx

// Импортируем необходимые библиотеки и компоненты
import React, { useState } from 'react'; // Импортируем React и хук useState для управления состоянием
import AuthForm from './AuthForm'; // Импортируем компонент формы авторизации
import { useAuth } from './AuthContext'; // Импортируем контекст авторизации для получения информации о пользователе
import { useTheme } from '../ThemeContext'; // Импортируем контекст темы для управления темной/светлой темой
import { Container, Button, Alert } from 'react-bootstrap'; // Импортируем компоненты Bootstrap для удобного оформления
import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем стили Bootstrap
import './AuthContainer.css'; // Импортируем стили для AuthContainer

// Определяем функциональный компонент AuthContainer
const AuthContainer = () => {
    const { isAuthenticated } = useAuth(); // Получаем информацию о том, авторизован ли пользователь
    const [isLogin, setIsLogin] = useState(true); // Устанавливаем состояние для переключения между авторизацией и регистрацией
    const { isDarkTheme } = useTheme(); // Получаем информацию о текущей теме (темная или светлая)

    return (
        <Container className={`auth-container ${isDarkTheme ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            {/* Проверяем, авторизован ли пользователь */}
            {isAuthenticated ? (
                <Alert variant="success">
                    Вы уже авторизованы как {isAuthenticated.userEmail} {/* Показываем сообщение об успешной авторизации */}
                </Alert>
            ) : (
                <div className="text-center"> {/* Используем div для центрирования содержимого */}
                    <h2>{isLogin ? "Авторизация" : "Регистрация"}</h2> {/* Заголовок в зависимости от состояния */}
                    <AuthForm isLogin={isLogin} onSwitchToLogin={() => setIsLogin(true)} /> {/* Компонент формы с передачей состояния */}
                    <Button 
                        variant="link" 
                        onClick={() => setIsLogin(prev => !prev)} // Переключаем состояние между авторизацией и регистрацией
                        className="mt-3"
                    >
                        {isLogin ? "Нет аккаунта? Пройдите регистрацию." : "Имеется аккаунт? Авторизуйтесь."} {/* Текст кнопки в зависимости от состояния */}
                    </Button>
                </div>
            )}
        </Container>
    );
};

// Экспортируем компонент AuthContainer для использования в других частях приложения
export default AuthContainer;