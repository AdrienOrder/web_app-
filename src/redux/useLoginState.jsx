// src/hooks/useLoginState.jsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// создаем хук
const useLoginState = () => {
    const { isAuthenticated } = useContext(AuthContext); //  использует useContext для получения значения isAuthenticated из AuthContext. isAuthenticated указывает аутентифицирован ли текущий пользователь
    return isAuthenticated;
};

export default useLoginState;