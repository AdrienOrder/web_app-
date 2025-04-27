// src/redux/store.jsx

import { configureStore } from '@reduxjs/toolkit';
// Импортируем функцию configureStore из Redux Toolkit для создания Redux Store, который будет хранить состояние приложения.

import { feedbackApi } from './feedbackApi';
// Импортируем созданный API (feedbackApi), который будет обрабатывать запросы, связанные с отзывами.

export const store = configureStore({
    // Создаем Redux Store с помощью функции configureStore, передавая объект конфигурации.

    reducer: {
        // Указываем редьюсеры для обработки состояния приложения.

        [feedbackApi.reducerPath]: feedbackApi.reducer,
        // Добавляем редьюсер для feedbackApi. Используем динамическое имя редьюсера, основанное на пути reducerPath 
        // из feedbackApi.
    },

    middleware: (getDefaultMiddleware) =>
        // Определяем middleware для обработки асинхронных запросов.

        getDefaultMiddleware().concat(feedbackApi.middleware),
    // Конкатенируем middleware, полученные по умолчанию из Redux Toolkit, с middleware для feedbackApi.
    // Это middleware необходимо для работы с асинхронными запросами (например, с API запросами).
});