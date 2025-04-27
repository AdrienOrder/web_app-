import React from 'react';
// Импортируем React для использования JSX и функциональных компонентов.

import { useFeedback } from './FeedbackContext';
// Импортируем контекст отзывов (FeedbackContext), чтобы получить доступ к состоянию отзывов и функции удаления отзыва.

import { useTheme } from '../ThemeContext';
// Импортируем контекст темы (ThemeContext), чтобы получить информацию о текущей теме (темная или светлая).

import { useAuth } from '../auto/AuthContext';
// Импортируем контекст аутентификации (AuthContext), чтобы получить информацию о текущем пользователе, в том числе его роль.

import './Feedback.css';
// Импортируем стили для компонента FeedbackList.

const FeedbackList = () => {
    // Создаем компонент FeedbackList, который отображает список отзывов.

    const { feedbacks, deleteFeedback } = useFeedback();
    // Извлекаем состояние отзывов (feedbacks) и функцию для удаления отзыва (deleteFeedback) из контекста FeedbackContext.

    const { isDarkTheme } = useTheme();
    // Извлекаем состояние текущей темы (темная или светлая) из контекста ThemeContext.

    const { userRole } = useAuth();
    // Извлекаем роль текущего пользователя из контекста аутентификации (AuthContext).

    const validFeedbacks = feedbacks.filter(f => f.name && f.feedback);
    // Фильтруем отзывы, чтобы оставить только те, у которых есть имя и текст отзыва. Это предотвращает отображение пустых отзывов.

    return (
        // Возвращаем JSX для отображения списка отзывов.

        <div className={`feedback-list ${isDarkTheme ? 'bg-dark' : 'bg-light'} p-3 rounded`}>
            {/* Применяем класс для фона в зависимости от темы (темная или светлая), а также добавляем отступы и скругление углов. */}

            {validFeedbacks.length > 0 && <h3>Отзывы:</h3>}
            {/* Если есть хотя бы один отзыв, отображаем заголовок "Отзывы". */}

            {validFeedbacks.map((feedback) => (
                // Для каждого отзыва из validFeedbacks (список фильтрованных отзывов) отображаем его.

                <div key={feedback.id} className="feedback-item mb-2">
                    {/* Каждый отзыв оборачиваем в div с уникальным ключом, который является id отзыва. Применяем отступ снизу. */}

                    <p className="feedback-name fw-bold">{feedback.name}:</p>
                    {/* Отображаем имя пользователя, который оставил отзыв, с жирным шрифтом. */}

                    <p>{feedback.feedback}</p>
                    {/* Отображаем сам текст отзыва. */}

                    {userRole === 'admin' && (
                        // Если роль пользователя — 'admin', отображаем кнопку для удаления отзыва.

                        <button onClick={() => deleteFeedback(feedback.id)} className="btn btn-danger">
                            {/* Кнопка для удаления отзыва. При клике вызывается функция deleteFeedback с id отзыва. */}

                            Удалить
                        </button>
                    )}
                </div>
            ))}

        </div>
    );
};

export default FeedbackList;
// Экспортируем компонент FeedbackList для использования в других частях приложения.