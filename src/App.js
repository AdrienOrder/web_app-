// App.jsx
import React from 'react';
import Header from './components/Header'; // Импортируем компонент Header
import Content from './components/Content'; // Импортируем компонент Content
import Footer from './components/Footer'; // Импортируем компонент Footer

const App = () => {
    return (
        <>
            <Header />
            <Content />
            <Footer />
        </>
    );
};

export default App;