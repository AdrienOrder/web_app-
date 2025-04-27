import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст
const ThemeContext = createContext();

// Провайдер контекста
export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Функция для переключения темы
    const toggleTheme = () => {
        setIsDarkTheme(prevTheme => !prevTheme);
    };

    // Эффект для изменения классов body
    useEffect(() => {
        const body = document.body;
        if (isDarkTheme) {
            body.classList.add('dark-theme'); // Добавляем класс для темной темы
            body.classList.remove('light-theme'); // Убираем класс для светлой темы
        } else {
            body.classList.add('light-theme'); // Добавляем класс для светлой темы
            body.classList.remove('dark-theme'); // Убираем класс для темной темы
        }
    }, [isDarkTheme]);

    // Возвращаем провайдер контекста
    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Хук для доступа к контексту
export const useTheme = () => {
    return useContext(ThemeContext);
};