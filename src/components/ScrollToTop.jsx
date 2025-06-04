// src/components/ScrollToTop.jsx (або ваш шлях)
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // Цей ефект буде спрацьовувати щоразу, коли змінюється pathname

    return null; // Цей компонент нічого не рендерить візуально
}

export default ScrollToTop;