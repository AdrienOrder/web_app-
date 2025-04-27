import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../pages/About'; // Импортируем компонент About для тестирования

describe('About component', () => {
    test('отображает текст и кнопку', () => {
        render(<About />); // Рендерим компонент About

        // Проверяем, что текст отображается
        expect(screen.getByText('О себе')).toBeInTheDocument();
        expect(screen.getByText('Меня зовут Саша. Я кто-то.')).toBeInTheDocument();
        expect(screen.getByText('В этом приложении вы можете что-то.')).toBeInTheDocument();
    });

    test('кнопка "Нажми меня" отключена по умолчанию', () => {
        render(<About />); // Рендерим компонент About

        // Проверяем, что кнопка отключена
        const button = screen.getByTestId('custom-button');
        expect(button).toBeDisabled();
    });

    test('кнопка "Нажми меня" становится активной после нажатия', () => {
        render(<About />); // Рендерим компонент About

        // Нажимаем на кнопку для включения основной кнопки
        fireEvent.click(screen.getByText('Включить кнопку'));

        // Проверяем, что кнопка теперь активна
        const button = screen.getByTestId('custom-button');
        expect(button).not.toBeDisabled();
    });
});