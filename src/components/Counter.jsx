// components/Counter.js
import React, { useState } from 'react'; // позволяет добавлять состояние в функциональные компоненты
import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем стили Bootstrap
import './Counter.css'; // Импортируем стили из Counter.css

const Counter = () => { // стрелочная функция, которая будет возвращать JSX
    const [count, setCount] = useState(0); // Создает состояние count с помощью хука useState.

    const increment = () => { // функция для увеличения счетчика
        setCount(prevCount => prevCount + 1);
    };

    const decrement = () => { // функция для уменьшения счетчика
        setCount(prevCount => prevCount - 1);
    };

    return (
        <div className="container"> {/* Используем класс container из CSS */}
            <h2>Счётчик: {count}</h2>
            <div>
                <button onClick={decrement} className="btn btn-primary">Уменьшить</button>
                <button onClick={increment} className="btn btn-danger">Увеличить</button>
            </div>
        </div>
    );
};
 
export default Counter;