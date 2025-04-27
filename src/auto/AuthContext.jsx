import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Создаём контекст для авторизации
const AuthContext = createContext();

// Создаём компонент-провайдер для управления состоянием аутентификации
export const AuthProvider = ({ children }) => {
    // Состояния для отслеживания состояния аутентификации
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Статус аутентификации
    const [userEmail, setUserEmail] = useState("");  // Email пользователя
    const [userRole, setUserRole] = useState("");  // Роль пользователя
    const [loading, setLoading] = useState(true);  // Состояние для загрузки данных пользователя

    // Вспомогательная функция для сохранения данных пользователя в localStorage
    const saveUserToLocalStorage = (email, role) => {
        const userProfile = { email, role };  // Создаём объект профиля пользователя
        localStorage.setItem('userProfile', JSON.stringify(userProfile));  // Сохраняем в localStorage
    };

    // Вспомогательная функция для восстановления данных пользователя из localStorage
    const loadUserFromLocalStorage = useCallback(() => {
        const storedUser = localStorage.getItem('userProfile');  // Получаем данные пользователя из localStorage
        if (storedUser) {
            const { email, role } = JSON.parse(storedUser);  // Парсим данные из localStorage
            setIsAuthenticated(true);  // Помечаем пользователя как аутентифицированного
            setUserEmail(email);  // Устанавливаем email пользователя
            setUserRole(role);  // Устанавливаем роль пользователя
        }
    }, []);  // useCallback, чтобы избежать лишних пересозданий функции

    // Загружаем пользователя при монтировании компонента
    useEffect(() => {
        loadUserFromLocalStorage();  // Загружаем данные пользователя из localStorage
        setLoading(false);  // Завершаем процесс загрузки
    }, [loadUserFromLocalStorage]);  // Зависимость от loadUserFromLocalStorage

    // Авторизация пользователя
    const login = async (email, password) => {
        try {
            // Отправляем запрос на сервер для авторизации пользователя
            const response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);
            if (!response.ok) throw new Error('Ошибка авторизации.');  // Если ошибка, выбрасываем исключение
            const users = await response.json();  // Получаем список пользователей
            if (users.length > 0) {
                const user = users[0];  // Берём первого пользователя из списка
                if (user.blocked) {
                    alert("Ваш аккаунт заблокирован. Обратитесь к администратору.");  // Если аккаунт заблокирован
                    return false;
                }

                setIsAuthenticated(true);  // Устанавливаем статус аутентификации
                setUserEmail(user.email);  // Устанавливаем email пользователя
                setUserRole(user.role);  // Устанавливаем роль пользователя
                saveUserToLocalStorage(user.email, user.role);  // Сохраняем данные в localStorage

                return true;
            } else {
                alert("Неверный email или пароль.");  // Если email или пароль неверные
                return false;
            }
        } catch (error) {
            alert("Ошибка при подключении к серверу.");  // Обработка ошибки подключения к серверу
            console.error(error);  // Логируем ошибку
            return false;
        }
    };

    // Выход пользователя
    const logout = () => {
        setIsAuthenticated(false);  // Сбрасываем статус аутентификации
        setUserEmail('');  // Очищаем email пользователя
        setUserRole('');  // Очищаем роль пользователя
        localStorage.removeItem('userProfile');  // Удаляем данные пользователя из localStorage
    };

    // Регистрация нового пользователя
    const register = async (email, password) => {
        try {
            // Отправляем запрос на сервер для регистрации нового пользователя
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: 'user',  // Роль по умолчанию - пользователь
                    blocked: false,  // Статус блокировки - не заблокирован
                }),
            });

            if (!response.ok) throw new Error('Ошибка регистрации.');  // Если ошибка, выбрасываем исключение
            const user = await response.json();  // Получаем данные нового пользователя

            setIsAuthenticated(true);  // Устанавливаем статус аутентификации
            setUserEmail(user.email);  // Устанавливаем email пользователя
            setUserRole(user.role);  // Устанавливаем роль пользователя
            saveUserToLocalStorage(user.email, user.role);  // Сохраняем данные в localStorage

            return true;
        } catch (error) {
            alert("Ошибка при регистрации.");  // Обработка ошибки при регистрации
            console.error(error);  // Логируем ошибку
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,  // Статус аутентификации
                login,  // Функция для авторизации
                logout,  // Функция для выхода
                register,  // Функция для регистрации
                userEmail,  // Email пользователя
                userRole,  // Роль пользователя
                loading,  // Статус загрузки
            }}
        >
            {children}  {/* Рендерим дочерние компоненты */}
        </AuthContext.Provider>
    );
};

// Хук для использования контекста в других компонентах
export const useAuth = () => useContext(AuthContext);  // Возвращаем контекст аутентификации