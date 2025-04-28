import React, { useCallback } from 'react';
// Импортируем React и хук useCallback для оптимизации обработки функции отправки формы, 
// чтобы она не пересоздавалась на каждом рендере.

import { useForm } from 'react-hook-form';
// Импортируем хук useForm из библиотеки react-hook-form для упрощения работы с формами (включает обработку валидации, 
// ошибок и состояния).

import { useFeedback } from './FeedbackContext';
// Импортируем контекст отзывов (FeedbackContext) для доступа к функциям добавления отзыва, 
// а также состояниям загрузки и ошибок.

import { useAuth } from '../auto/AuthContext';
// Импортируем контекст аутентификации (AuthContext), чтобы получать информацию о текущем пользователе (например, его роль).

import { useTheme } from '../ThemeContext';
// Импортируем контекст для работы с темой (ThemeContext), 
// чтобы можно было менять визуальное оформление в зависимости от темы (темная или светлая).

const FeedbackForm = () => {
    // Создаём компонент FeedbackForm, который отображает форму для добавления отзыва.

    const { register, handleSubmit, reset } = useForm();
    // Извлекаем функции из хука useForm: register для привязки полей формы, handleSubmit для обработки отправки формы, 
    // reset для сброса данных формы после отправки.

    const { addFeedback, isLoading, isError } = useFeedback();
    // Извлекаем необходимые функции и состояния из контекста feedback: функцию для добавления отзыва (addFeedback), 
    // флаги загрузки и ошибки.

    const { isDarkTheme } = useTheme();
    // Извлекаем состояние текущей темы (темная или светлая) из контекста темы (ThemeContext).

    const { userRole } = useAuth();
    // Извлекаем роль текущего пользователя из контекста аутентификации (AuthContext), 
    // чтобы ограничить доступ к форме для определенных пользователей.

    const onSubmit = useCallback((data) => {
        // Функция onSubmit, которая будет вызвана при отправке формы. Используем useCallback, 
        // чтобы не пересоздавать её на каждом рендере.

        addFeedback({ name: data.name, feedback: data.feedback });
        // Вызов функции addFeedback из контекста для добавления отзыва. Передаем данные из формы (имя и текст отзыва).

        reset();
        // Сбрасываем форму после успешной отправки отзыва, очищая поля ввода.
    }, [addFeedback, reset]);
    // Массив зависимостей для useCallback. Функция будет пересоздана только если изменятся addFeedback или reset.

    if (userRole !== 'admin') {
        // Проверка: если роль пользователя не 'admin', то возвращаем сообщение о том, что у него нет прав для добавления отзыва.

        return (
            <div className={`feedback-form ${isDarkTheme ? 'bg-dark' : 'bg-light'} p-3 rounded`}>
                {/* Применяем класс для фона, в зависимости от текущей темы (темная или светлая). */}

                <p>Вы не имеете прав для добавления отзыва.</p>
                {/* Сообщение о том, что пользователь не имеет прав для добавления отзыва. */}

            </div>
        );
    }

    return (
        // Если роль пользователя — 'admin', возвращаем саму форму для добавления отзыва.

        <form
            className={`feedback-form ${isDarkTheme ? 'bg-dark' : 'bg-light'} p-3 rounded`}
            // Применяем соответствующий класс для фона, в зависимости от текущей темы.
            onSubmit={handleSubmit(onSubmit)}
        // Обрабатываем отправку формы с использованием handleSubmit из react-hook-form. onSubmit будет 
        // вызван при успешной валидации.
        >

            <div className="mb-3">
                <label className="form-label">Ваше имя:</label>
                {/* Метка для поля ввода имени. */}

                <input
                    {...register('name', { required: true })}
                    // Привязываем поле ввода с использованием register, указывая, что имя обязательно для ввода (required: true).
                    className="form-control"
                    placeholder="Введите ваше имя"
                // Применяем стиль с помощью bootstrap и указываем текст placeholder.
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Ваш отзыв:</label>
                {/* Метка для поля ввода отзыва. */}

                <textarea
                    {...register('feedback', { required: true })}
                    // Привязываем поле ввода отзыва с использованием register, указывая, что отзыв обязателен для ввода.
                    className="form-control"
                    placeholder="Введите ваш отзыв"
                // Применяем стиль с помощью bootstrap и указываем текст placeholder.
                />
            </div>

            <button type="submit" className="btn btn-primary">Отправить отзыв</button>
            {/* Кнопка для отправки формы. Применяем стиль кнопки из bootstrap. */}

            {isLoading && <div className="spinner-border" role="status"><span className="visually-hidden">Загрузка...</span></div>}
            {/* Если идет загрузка (isLoading), показываем спиннер с текстом "Загрузка..." */}

            {isError && <div className="alert alert-danger">Произошла ошибка при отправке отзыва.</div>}
            {/* Если произошла ошибка при отправке отзыва (isError), показываем сообщение об ошибке в виде alert. */}

        </form>
    );
};

export default FeedbackForm;
// Экспортируем компонент FeedbackForm для использования в других частях приложения.
