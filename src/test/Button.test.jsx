// Импорт React, необходимый для JSX в тестах
import React from 'react';

// Импорт утилит из @testing-library/react для рендеринга и взаимодействия с компонентами
import { render, screen, fireEvent } from '@testing-library/react';

// Импорт расширений Jest для удобной проверки DOM-элементов
import '@testing-library/jest-dom';

// Импортируем сам компонент, который будем тестировать
import About from '../pages/About';

// Группа тестов для компонента About
describe('About component', () => {
    
    // Первый тест: проверка наличия базового текста и кнопок
    test('отображает текст и кнопку', () => {
        // Рендерим компонент
        render(<About />);
        
        // Проверяем наличие заголовка
        expect(screen.getByText('О себе')).toBeInTheDocument();

        // Проверяем наличие обоих вариантов текста "about"
        expect(screen.getByText('about')).toBeInTheDocument();
        expect(screen.getByText('ABOUT')).toBeInTheDocument();

        // Проверка наличия кнопки включения
        expect(screen.getByText('Включить кнопки')).toBeInTheDocument();

        // Проверка наличия кнопок по data-testid
        expect(screen.getByTestId('custom-button')).toBeInTheDocument();
        expect(screen.getByTestId('random-color-button')).toBeInTheDocument();
    });

    // Второй тест: проверяем, что обе кнопки отключены по умолчанию
    test('кнопки "Нажми меня (в негативе)" и "Рандомный цвет" отключены по умолчанию', () => {
        render(<About />);

        // Получаем кнопки по data-testid
        const customButton = screen.getByTestId('custom-button');
        const randomColorButton = screen.getByTestId('random-color-button');

        // Ожидаем, что обе кнопки недоступны (disabled)
        expect(customButton).toBeDisabled();
        expect(randomColorButton).toBeDisabled();
    });

    // Третий тест: кнопки становятся активными после нажатия "Включить кнопки"
    test('кнопки "Нажми меня (в негативе)" и "Рандомный цвет" становятся активными после нажатия "Включить кнопки"', () => {
        render(<About />);

        // Кликаем по кнопке включения
        fireEvent.click(screen.getByText('Включить кнопки'));

        // Получаем кнопки
        const customButton = screen.getByTestId('custom-button');
        const randomColorButton = screen.getByTestId('random-color-button');

        // Проверяем, что теперь они активны
        expect(customButton).not.toBeDisabled();
        expect(randomColorButton).not.toBeDisabled();
    });

    // Четвёртый тест: кнопка "Нажми меня" меняет цвет на инвертированный при нажатии
    test('кнопка "Нажми меня (в негативе)" меняет цвет на инвертированный при нажатии', () => {
        render(<About />);
        const customButton = screen.getByTestId('custom-button');

        // Включаем кнопки
        fireEvent.click(screen.getByText('Включить кнопки'));

        // Задаем начальный цвет
        const initialBackgroundColor = 'rgb(0, 123, 255)';

        // Кликаем по кнопке, чтобы изменить цвет
        fireEvent.click(customButton);

        // Вычисляем ожидаемый инвертированный цвет
        const rgbValues = initialBackgroundColor.substring(4, initialBackgroundColor.length - 1).split(',').map(Number);
        const invertedRgbValues = rgbValues.map(value => 255 - value);
        const expectedInvertedColor = `rgb(${invertedRgbValues.join(', ')})`;

        // Проверка, что цвет стал инвертированным
        expect(customButton).toHaveStyle({ backgroundColor: expectedInvertedColor });

        // Кликаем снова, чтобы вернуть изначальный цвет
        fireEvent.click(customButton);

        // Проверка возврата цвета
        expect(customButton).toHaveStyle({ backgroundColor: initialBackgroundColor });
    });

    // Пятый тест: если кнопка выключена, она отображает крестик (✖)
    test('кнопка "Нажми меня (в негативе)" содержит крестик, если выключена', () => {
        render(<About />);
        const customButton = screen.getByTestId('custom-button');

        // Проверка наличия крестика внутри кнопки
        expect(customButton.innerHTML).toContain('✖');
    });

    // Шестой тест: кнопка отображает текст, если включена
    test('кнопка "Нажми меня (в негативе)" отображает текст, если включена', () => {
        render(<About />);
        
        // Включаем кнопки
        fireEvent.click(screen.getByText('Включить кнопки'));

        const customButton = screen.getByTestId('custom-button');

        // Ожидаем текст
        expect(customButton).toHaveTextContent('Нажми меня (в негативе)');
    });

    // Седьмой тест: кнопка "Рандомный цвет" меняет цвет другой кнопки
    test('кнопка "Рандомный цвет" меняет цвет кнопки "Нажми меня (в негативе)" на случайный', () => {
        render(<About />);
        fireEvent.click(screen.getByText('Включить кнопки'));

        // Получаем обе кнопки
        const customButton = screen.getByTestId('custom-button');
        const randomColorButton = screen.getByTestId('random-color-button');

        // Получаем начальный цвет
        const initialBackgroundColor = window.getComputedStyle(customButton).getPropertyValue('background-color');

        // Кликаем по кнопке "Рандомный цвет"
        fireEvent.click(randomColorButton);

        // Получаем новый цвет
        const newBackgroundColor = window.getComputedStyle(customButton).getPropertyValue('background-color');

        // Проверяем, что цвет действительно изменился
        expect(newBackgroundColor).not.toBe(initialBackgroundColor);
    });

    // Восьмой тест: если кнопка "Рандомный цвет" выключена — отображает крестик
    test('кнопка "Рандомный цвет" отображает крестик, если выключена', () => {
        render(<About />);
        const randomColorButton = screen.getByTestId('random-color-button');

        // Проверяем, что она отключена
        expect(randomColorButton).toBeDisabled();

        // И содержит крестик
        expect(randomColorButton.innerHTML).toContain('✖');
    });

    // Девятый тест: отображение текста, когда кнопка активна
    test('кнопка "Рандомный цвет" отображает текст, если включена', () => {
        render(<About />);
        
        // Включаем кнопки
        fireEvent.click(screen.getByText('Включить кнопки'));

        const randomColorButton = screen.getByTestId('random-color-button');

        // Проверяем наличие текста
        expect(randomColorButton).toHaveTextContent('Рандомный цвет');
    });
});
