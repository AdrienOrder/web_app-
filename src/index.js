import App from './App';  
// Импортируем основной компонент приложения (App).
import React, { StrictMode } from 'react';  
// Импортируем React и StrictMode. StrictMode помогает выявлять потенциальные проблемы в приложении.
import ReactDOM from 'react-dom/client';  
// Импортируем ReactDOM для рендеринга приложения в DOM (с использованием нового API для рендеринга).
import { Provider } from 'react-redux';  
// Импортируем компонент Provider из библиотеки Redux. Он позволяет всему приложению получить доступ к Redux store.
import { store } from './redux/store';  
// Импортируем store из конфигурации Redux. Store содержит все данные состояния приложения.
import { DndProvider } from 'react-dnd';  
// Импортируем DndProvider для интеграции с drag-and-drop (перетаскивание) библиотекой react-dnd.
import { HTML5Backend } from 'react-dnd-html5-backend';  
// Импортируем HTML5Backend — один из бэкендов, который управляет событиями перетаскивания для react-dnd.
import { BrowserRouter } from 'react-router-dom';  
// Импортируем BrowserRouter из react-router-dom. Это компонент, который управляет маршрутизацией в приложении для навигации по страницам.
import { ThemeProvider } from './ThemeContext';  
// Импортируем ThemeProvider для управления состоянием темы в приложении (например, светлая/тёмная тема).
import { AuthProvider } from './auto/AuthContext';  
// Импортируем AuthProvider для управления состоянием аутентификации и авторизации пользователя.
import { FeedbackProvider } from './feedback/FeedbackContext';  
// Импортируем FeedbackProvider для управления состоянием отзывов в приложении (например, получение и добавление отзывов).
// Получаем корневой элемент
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
root.render(
    <StrictMode>
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <BrowserRouter>
                    <ThemeProvider>
                        <FeedbackProvider>
                            <AuthProvider> 
                                <App />
                            </AuthProvider>
                        </FeedbackProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </DndProvider>
        </Provider>
    </StrictMode>
);