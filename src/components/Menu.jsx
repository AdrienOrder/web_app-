// Импортируем необходимые библиотеки и компоненты
import React, { useState, useEffect, useRef } from 'react'; // Импортируем React и хуки для управления состоянием 
// и жизненным циклом
import { Link } from 'react-router-dom'; // Импортируем компонент Link для навигации между страницами
import { useTheme } from '../ThemeContext'; // Импортируем хук для работы с темой приложения
import { Collapse } from 'react-bootstrap'; // Импортируем компонент Collapse из Bootstrap для анимации меню
import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем стили Bootstrap
import './Menu.css'; // Импортируем стили для компонента Menu

// Определяем массив объектов с элементами меню (путь и метка)
const menuItems = [
    { path: '/lab1', label: 'Лабораторная работа № 1' }, // Элемент меню с путем и меткой
    { path: '/lab2', label: 'Лабораторная работа № 2' }, // Элемент меню с путем и меткой
    { path: '/lab3', label: 'Лабораторная работа № 3' }, // Элемент меню с путем и меткой
    { path: '/lab4', label: 'Лабораторная работа № 4' }, // Элемент меню с путем и меткой
    { path: '/lab5', label: 'Лабораторная работа № 5' }, // Элемент меню с путем и меткой
    { path: '/lab6', label: 'Лабораторная работа № 6' }, // Элемент меню с путем и меткой
    { path: '/lab7', label: 'Лабораторная работа № 7' }, // Элемент меню с путем и меткой
    { path: '/lab8', label: 'Лабораторная работа № 8' }, // Элемент меню с путем и меткой
    { path: '/lab9', label: 'Лабораторная работа № 9' }, // Элемент меню с путем и меткой
    { path: '/counter', label: 'Счётчик' }, // Элемент меню с путем и меткой
];

// Определяем функциональный компонент Menu
const Menu = () => {
    const [isOpen, setIsOpen] = useState(false); // Создаем состояние isOpen для управления открытием/закрытием меню
    const { isDarkTheme } = useTheme(); // Получаем информацию о текущей теме (темной или светлой)
    const menuRef = useRef(null); // Создаем реф для отслеживания элемента меню

    // Функция для переключения состояния isOpen на противоположное (открыть/закрыть меню)
    const toggleMenu = () => {
        setIsOpen(!isOpen); // Меняем состояние isOpen на противоположное
    };

    // Функция для обработки клика вне элемента меню (закрытие меню)
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false); // Закрываем меню, если кликнули вне его области
        }
    };

    // Используем хук useEffect для добавления обработчика события клика при монтировании компонента
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); // Добавляем обработчик события клика мыши на документе
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Удаляем обработчик при размонтировании компонента
        };
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании

    return (
        <div className={`menu__container ${isDarkTheme ? 'bg-dark text-white' : 'bg-light text-dark'}`} ref={menuRef}> 
        {/* Контейнер для меню с классом в зависимости от темы */}
            <button className="menu-toggle" onClick={toggleMenu}> {/* Кнопка для переключения состояния открытия/закрытия меню */}
                <span className="navbar-toggler-icon"></span> {/* Иконка кнопки переключения */}
            </button>
            <Collapse in={isOpen}> {/* Компонент Collapse, который управляет видимостью навигационного меню */}
                <nav className={`menu ${isDarkTheme ? 'dark-m' : 'light-m'} p-3`}> {/* Навигационное меню с классом 
                в зависимости от темы */}
                    <ul className="list-unstyled"> {/* Ненумерованный список без стандартных стилей */}
                        {menuItems.map((item) => ( /* Проходим по массиву menuItems */
                            <li key={item.path}> {/* Каждый элемент списка должен иметь уникальный ключ */}
                                <Link to={item.path} className={`nav-link ${isDarkTheme ? 'text-white' : 'text-dark'}`} onClick={() => setIsOpen(false)}> 
                                {/* Ссылка на путь элемента, закрывающая меню при клике */}
                                    {item.label} {/* Текст ссылки из объекта menuItems */}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </Collapse>
        </div>
    );
};

// Экспортируем компонент Menu для использования в других частях приложения
export default Menu;