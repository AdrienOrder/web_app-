// components/Header.js

import React from 'react';
// Импортируем библиотеку React, которая необходима для создания компонента в React.

import Menu from './Menu';
// Импортируем компонент Menu, который будет отображаться в заголовке, если пользователь аутентифицирован.

import { useTheme } from '../ThemeContext';
// Импортируем хук useTheme из контекста ThemeContext, который позволяет управлять темой (темная/светлая) приложения.

import { useAuth } from '../auto/AuthContext';
// Импортируем хук useAuth из контекста AuthContext, который управляет состоянием аутентификации (например, проверка, вошел ли пользователь в систему).

import { useNavigate, Link } from 'react-router-dom';
// Импортируем хуки useNavigate и Link из библиотеки react-router-dom для навигации между страницами без перезагрузки.

import 'bootstrap/dist/css/bootstrap.min.css';
// Импортируем стили Bootstrap для использования стандартных классов для стилизации компонентов.

import './Header.css';
// Импортируем собственные стили для компонента Header из файла Header.css.

const Header = () => {
    // Определяем функциональный компонент Header, который будет отображать заголовок сайта.

    const { isDarkTheme, toggleTheme } = useTheme();
    // Используем хук useTheme для получения текущей темы (isDarkTheme) и функции для переключения темы (toggleTheme).

    const { isAuthenticated, logout, userEmail, userRole } = useAuth();
    // Используем хук useAuth для получения информации о текущем состоянии аутентификации:
    // - isAuthenticated: булевый флаг, указывающий, вошел ли пользователь в систему.
    // - logout: функция для выхода пользователя из системы.
    // - userEmail: email текущего пользователя.
    // - userRole: роль текущего пользователя (например, 'admin' или 'user').

    const navigate = useNavigate();
    // Инициализируем хук navigate, который используется для навигации между страницами внутри приложения.

    const handleEmailClick = () => {
        // Функция, которая обрабатывает клик по email пользователя.

        if (userRole === 'admin') {
            // Если у пользователя роль 'admin', то мы переходим на панель администратора.
            navigate('/admin');  // Переход на страницу /admin.
        } else {
            // В противном случае (если роль не 'admin') переходим на страницу профиля пользователя.
            navigate('/profile');  // Переход на страницу /profile.
        }
    };

    return (
        // Начало возвращаемого JSX-разметки компонента Header.

        <header className={`header ${isDarkTheme ? 'bg-dark text-white' : 'bg-light text-dark'}`}>

            {isAuthenticated && <Menu />}
            {/* Если пользователь аутентифицирован (isAuthenticated), отображаем компонент Menu (например, меню для навигации). */}

            {isAuthenticated && (
                // Если пользователь аутентифицирован, показываем навигацию.
                <nav>
                    {/* Навигация для аутентифицированных пользователей. */}
                    <Link to="/home" className="nav-link-h">Главная</Link>
                    {/* Ссылка на страницу "Главная" с классом nav-link-h для стилизации. */}
                    <Link to="/about" className="nav-link-a">О себе</Link>
                    {/* Ссылка на страницу "О себе" с классом nav-link-a для стилизации. */}
                </nav>
            )}

            <button className="btn btn-secondary" onClick={toggleTheme}>
                {/* Кнопка для переключения темы приложения. */}
                {isDarkTheme ? 'Светлая тема' : 'Темная тема'}
                {/* В зависимости от текущей темы отображаем текст на кнопке: "Светлая тема" или "Темная тема". */}
            </button>

            <div className="d-flex align-items-center">
                {/* Контейнер с горизонтальной раскладкой для элементов, выравнивания по центру и выравнивания элементов по вертикали. */}
                {isAuthenticated ? (
                    // Если пользователь аутентифицирован, отображаем его email и кнопку выхода.
                    <>
                        <span className="user-email me-3" onClick={handleEmailClick}>
                            {/* Отображаем email пользователя. При клике вызывается handleEmailClick, который направляет на соответствующую страницу. */}
                            {userEmail}
                            {/* Отображаем email текущего пользователя. */}
                        </span>
                        <button className="btn btn-danger" onClick={logout}>
                            {/* Кнопка для выхода из системы. При клике вызывается функция logout, которая выполняет выход пользователя. */}
                            Выйти
                        </button>
                    </>
                ) : (
                    // Если пользователь не аутентифицирован, показываем кнопку для входа.
                    <button className="btn btn-primary" onClick={() => alert('Заполните форму')}>
                        {/* Кнопка для входа. При клике появляется сообщение с напоминанием, что нужно заполнить форму. */}
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
// Экспортируем компонент Header для использования в других частях приложения.