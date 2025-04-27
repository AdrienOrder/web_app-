// components/Menu.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Menu.css';

const menuItems = [
    { path: '/lab1', label: 'Лабораторная работа № 1' },
    { path: '/lab2', label: 'Лабораторная работа № 2' },
    { path: '/lab3', label: 'Лабораторная работа № 3' },
    { path: '/lab4', label: 'Лабораторная работа № 4' },
    { path: '/lab5', label: 'Лабораторная работа № 5' },
    { path: '/lab6', label: 'Лабораторная работа № 6' },
    { path: '/lab7', label: 'Лабораторная работа № 7' },
    { path: '/lab8', label: 'Лабораторная работа № 8' },
    { path: '/lab9', label: 'Лабораторная работа № 9' },
    { path: '/counter', label: 'Счётчик' },
];

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkTheme } = useTheme();
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`menu__container ${isDarkTheme ? 'bg-dark text-white' : 'bg-light text-dark'}`} ref={menuRef}>
            <button className="menu-toggle" onClick={toggleMenu}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <Collapse in={isOpen}>
                <nav className={`menu ${isDarkTheme ? 'dark-m' : 'light-m'} p-3`}>
                    <ul className="list-unstyled">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link to={item.path} className={`nav-link ${isDarkTheme ? 'text-white' : 'text-dark'}`} onClick={() => setIsOpen(false)}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </Collapse>
        </div>
    );
};

export default Menu;