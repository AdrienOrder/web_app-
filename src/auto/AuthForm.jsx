// src/components/AuthForm.jsx
import React, { useCallback } from 'react'; // Импортируем React и хук useCallback
import { useForm } from 'react-hook-form'; // Импортируем хук useForm для работы с формами
import { useAuth } from './AuthContext'; // Импортируем контекст аутентификации
import { useTheme } from '../ThemeContext'; // Импортируем контекст темы
import { Form, Button} from 'react-bootstrap'; // Импортируем компоненты Form и Button из библиотеки react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем стили Bootstrap
import './AuthContainer.css'; // Импортируем стили для контейнера аутентификации

const AuthForm = ({ isLogin, onSwitchToLogin }) => { // Компонент AuthForm принимает пропсы isLogin и onSwitchToLogin
    const { register, handleSubmit, formState: { errors } } = useForm(); // Инициализируем форму с помощью useForm
    const { login, register: registerUser } = useAuth(); // Получаем функции login и register из контекста аутентификации
    const { isDarkTheme } = useTheme(); // Получаем состояние темы из контекста темы

    const onSubmit = useCallback(async (data) => { // Функция обработки отправки формы
        if (isLogin) { // Если форма для входа
            const isLoggedIn = await login(data.email, data.password); // Пытаемся войти с указанными email и паролем
            if (!isLoggedIn) { // Если вход не удался
                alert("Пользователь не зарегистрирован. Пожалуйста, пройдите регистрацию."); // Уведомляем пользователя о необходимости регистрации
                onSwitchToLogin(); // Переключаемся на форму регистрации
            }
        } else { // Если форма для регистрации
            const isRegistered = await registerUser(data.email, data.password); // Пытаемся зарегистрировать нового пользователя
            if (!isRegistered) { // Если регистрация не удалась
                alert("Пользователь с такой электронная почтой уже существует. Пожалуйста, войдите в систему."); // Уведомляем о существующем пользователе
                onSwitchToLogin(); // Переключаемся на форму входа
            }
        }
    }, [isLogin, login, registerUser, onSwitchToLogin]); // Зависимости для useCallback

    return (
        <Form className={`auth-form ${isDarkTheme ? 'bg-dark text-white' : 'bg-light text-dark'}`} onSubmit={handleSubmit(onSubmit)}> {/* Определяем класс формы в зависимости от темы */}
            <Form.Group controlId="formEmail"> {/* Группа элементов формы для email */}
                <Form.Label>Электронная почта:</Form.Label> {/* Метка для поля email */}
                <Form.Control
                    type="text" 
                    {...register('email', {  // Регистрация поля email с валидацией 
                        required: "Это поле обязательно",  // Обязательное поле 
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@(mail\.ru|gmail\.com|yandex\.ru)$/,  // Шаблон для проверки формата email 
                            message: "Электронная почта должна быть в формате: yandex.ru, example@mail.ru или example@gmail.com"  // Сообщение об ошибке при несоответствии формату 
                        }
                    })}
                    isInvalid={!!errors.email}  // Проверка на наличие ошибок в поле email 
                />
                <Form.Control.Feedback type="invalid"> {/* Обратная связь при ошибке валидации */}
                    {errors.email && <span>{errors.email.message}</span>} {/* Отображение сообщения об ошибке */}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPassword"> {/* Группа элементов формы для пароля */}
                <Form.Label>Пароль:</Form.Label> {/* Метка для поля пароля */}
                <Form.Control
                    type="password" 
                    {...register('password', { required: true })}  // Регистрация поля пароля как обязательного 
                    isInvalid={!!errors.password}  // Проверка на наличие ошибок в поле пароля 
                />
                <Form.Control.Feedback type="invalid"> {/* Обратная связь при ошибке валидации */}
                    {errors.password && <span>Это поле обязательно</span>} {/* Отображение сообщения об ошибке */}
                </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3"> {/* Кнопка отправки формы */}
                {isLogin ? 'Войти' : 'Зарегистрироваться'} {/* Текст кнопки зависит от состояния формы (вход или регистрация) */}
            </Button>
        </Form>
    );
};

export default AuthForm;  // Экспортируем компонент AuthForm по умолчанию