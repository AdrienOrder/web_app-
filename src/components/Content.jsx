// Импортируем необходимые библиотеки и компоненты
import React from 'react'; // Импортируем React для создания компонентов
import { Routes, Route, Navigate } from 'react-router-dom'; // Импортируем компоненты для маршрутизации
import { Row, Col } from 'react-bootstrap'; // Импортируем компоненты для сетки из Bootstrap
import '../components/Content.css'; // Импортируем стили для компонента Content
import { useTheme } from '../ThemeContext'; // Импортируем хук для работы с темой приложения
import { useAuth } from '../auto/AuthContext'; // Импортируем хук для работы с аутентификацией

// Импортируем компоненты страниц и других частей приложения
import Counter from './Counter'; // Компонент счетчика
import AuthContainer from '../auto/AuthContainer'; // Компонент для аутентификации
import UserProfile from '../auto/userProfile'; // Компонент профиля пользователя
import AdminPanel from '../admin/AdminPanel'; // Компонент панели администратора
import Home from '../pages/Home'; // Главная страница приложения
import About from '../pages/About'; // Страница "О нас"

// Массив объектов, представляющих лабораторные работы с их данными (id, изображение и подпись)
const labWorks = [
    { id: 1, image: '/laba1.png', caption: 'Лабораторная работа 1' },
    { id: 2, image: '/laba2.png', caption: 'Лабораторная работа 2' },
    { id: 3, image: '/laba3.png', caption: 'Лабораторная работа 3' },
    { id: 4, image: '/laba4.png', caption: 'Лабораторная работа 4' },
    { id: 5, image: '/laba5.png', caption: 'Лабораторная работа 5' },
    { id: 6, image: '/laba6.png', caption: 'Лабораторная работа 6' },
    { id: 7, image: '/laba7.png', caption: 'Лабораторная работа 7' },
    { id: 8, image: '/laba8.png', caption: 'Лабораторная работа 8' },
    { id: 9, image: '/laba9.png', caption: 'Лабораторная работа 9' },
];

// Компонент LabWork для отображения информации о конкретной лабораторной работе
const LabWork = ({ lab }) => {
    return (
        <div className="lab-work"> {/* Контейнер для лабораторной работы */}
            <h3>{lab.caption}</h3> {/* Заголовок с подписью лабораторной работы */}
            <img className="slider-image" src={lab.image} alt={lab.caption} /> {/* Изображение лабораторной работы */}
        </div>
    );
};

// Основной компонент Content
const Content = () => {
    const { isDarkTheme } = useTheme(); // Получаем информацию о текущей теме (темной или светлой)
    const { isAuthenticated, userRole } = useAuth(); // Получаем информацию о статусе аутентификации и роли пользователя

    return (
        <div className={`content ${isDarkTheme ? 'dark' : 'light'}`}> {/* Контейнер с классом в зависимости от темы */}
            <Row> {/* Строка Bootstrap для размещения колонок */}
                <Col> {/* Колонка Bootstrap */}
                    {isAuthenticated ? ( // Проверяем, аутентифицирован ли пользователь
                        <Routes> {/* Определяем маршруты приложения */}
                            <Route path="/home" element={<Home />} /> {/* Маршрут на главную страницу */}
                            <Route path="/about" element={<About />} /> {/* Маршрут на страницу "О нас" */}
                            <Route path="/counter" element={<Counter />} /> {/* Маршрут на страницу счетчика */}
                            <Route path="/profile" element={<UserProfile />} /> {/* Маршрут на страницу профиля пользователя */}
                            <Route 
                                path="/admin" 
                                element={ 
                                    userRole === 'admin' ? ( // Проверяем роль пользователя
                                        <AdminPanel /> // Если администратор, отображаем панель администратора
                                    ) : (
                                        <Navigate to="/profile" replace /> // В противном случае перенаправляем на профиль пользователя
                                    )
                                }
                            />
                            {/* Создаем маршруты для каждой лабораторной работы из массива labWorks */}
                            {labWorks.map((lab) => (
                                <Route 
                                    key={lab.id} 
                                    path={`/lab${lab.id}`} 
                                    element={<LabWork lab={lab} />} 
                                />
                            ))}
                            {/* Перенаправление на главную страницу в случае несуществующего пути */}
                            <Route path="*" element={<Navigate to="/home" />} />
                        </Routes>
                    ) : (
                        <AuthContainer /> // Если пользователь не аутентифицирован, отображаем компонент аутентификации
                    )}
                </Col>
            </Row>
        </div>
    );
};

// Экспортируем компонент Content для использования в других частях приложения
export default Content;