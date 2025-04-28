import React, { useEffect, useState, useMemo, useCallback } from 'react'; // Импортируем необходимые хуки React
import { useAuth } from '../auto/AuthContext'; // Импортируем хук для аутентификации пользователя
import { useTable, useSortBy } from 'react-table'; // Импортируем хук для работы с таблицами
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core'; // Импортируем компоненты для перетаскивания
import { SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable'; // Импортируем компоненты для сортировки
import { CSS } from '@dnd-kit/utilities'; // Импортируем утилиты для обработки CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем Bootstrap для стилизации

// Компонент для заголовков таблицы, поддерживающий перетаскивание
const SortableHeader = ({ column }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id }); // Инициализируем перетаскиваемый элемент с использованием dnd-kit

    const style = {
        transform: CSS.Transform.toString(transform), // Преобразуем координаты перетаскиваемого элемента
        transition, // Добавляем плавный переход
        cursor: isDragging ? 'grabbing' : 'pointer', // Устанавливаем курсор в зависимости от состояния перетаскивания
        whiteSpace: 'nowrap', // Запрещаем перенос текста
    };

    const handleClick = (e) => {
        if (isDragging) {
            e.stopPropagation(); // Останавливаем событие клика, если идет перетаскивание
            return;
        }
        column.getSortByToggleProps().onClick(e); // Вызываем сортировку столбца при клике
    };

    return (
        <th
            {...column.getHeaderProps(column.getSortByToggleProps())} // Получаем пропсы для сортировки
            ref={setNodeRef} // Устанавливаем ссылку на DOM-элемент
            style={style} // Применяем стиль для перетаскивания
            {...attributes} // Применяем дополнительные атрибуты для перетаскиваемого элемента
            {...listeners} // Применяем слушатели событий для перетаскивания
            onClick={handleClick} // Обрабатываем клик для сортировки
        >
            {column.render('Header')} {/* Отображаем заголовок столбца*/}
            <span>
                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''} {/* Отображаем иконки сортировки*/}
            </span>
        </th>
    );
};

// Основной компонент панели администратора
const AdminPanel = () => {
    const { userRole } = useAuth(); // Получаем роль пользователя из контекста аутентификации
    const [users, setUsers] = useState([]); // Состояние для списка пользователей
    const [loading, setLoading] = useState(true); // Состояние для загрузки данных
    const [error, setError] = useState(null); // Состояние для ошибок
    const [rowOrder, setRowOrder] = useState([]); // Состояние для порядка строк
    const [columnOrder, setColumnOrder] = useState([]); // Состояние для порядка столбцов
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' }); // Состояние для нового пользователя

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 10 } // Настройка сенсора для активации перетаскивания
        })
    );

    useEffect(() => {
        fetchUsers(); // Загружаем пользователей при монтировании компонента
    }, []);

    // Функция для загрузки пользователей с сервера
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/users'); // Получаем список пользователей с сервера
            if (!response.ok) throw new Error('Ошибка при загрузке пользователей'); // Обрабатываем ошибку
            const data = await response.json(); // Преобразуем ответ в JSON
            setUsers(data); // Устанавливаем полученные данные
        } catch (err) {
            setError(err.message); // Устанавливаем ошибку в состояние
        } finally {
            setLoading(false); // Завершаем загрузку
        }
    };

    // Обновляем порядок строк при изменении списка пользователей
    useEffect(() => {
        setRowOrder(users.map(user => user.id));
    }, [users]);

    // Функция для удаления пользователя
    const handleDelete = useCallback(async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, { method: 'DELETE' }); // Удаляем пользователя с сервера
            if (!response.ok) throw new Error('Ошибка при удалении пользователя'); // Обрабатываем ошибку
            setUsers(prev => prev.filter(user => user.id !== userId)); // Удаляем пользователя из состояния
        } catch (err) {
            alert(err.message); // Показываем ошибку
        }
    }, []);

    // Функция для блокировки/разблокировки пользователя
    const handleBlock = useCallback(async (userId, isBlocked) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blocked: !isBlocked }) // Меняем статус блокировки
            });
            if (!response.ok) throw new Error('Ошибка при изменении блокировки'); // Обрабатываем ошибку
            setUsers(prev =>
                prev.map(user => user.id === userId ? { ...user, blocked: !isBlocked } : user) // Обновляем список пользователей
            );
        } catch (err) {
            alert(err.message); // Показываем ошибку
        }
    }, []);

    // Функция для добавления нового пользователя
    const handleAddUser = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
        const { email, password, role } = newUser; // Извлекаем данные из формы
        if (!email || !password || !role) {
            alert('Пожалуйста, заполните все поля'); // Проверяем, что все поля заполнены
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role, blocked: false }) // Отправляем данные на сервер
            });
            if (!response.ok) throw new Error('Ошибка при добавлении пользователя'); // Обрабатываем ошибку
            const newUserData = await response.json(); // Получаем данные нового пользователя
            setUsers(prev => [...prev, newUserData]); // Добавляем нового пользователя в состояние
            setNewUser({ email: '', password: '', role: 'user' }); // Очищаем форму
        } catch (err) {
            alert(err.message); // Показываем ошибку
        }
    };

    // Описание всех колонок таблицы
    const allColumns = useMemo(() => [
        { Header: 'ID', accessor: 'id', id: 'id' }, // Столбец для ID
        { Header: 'Email', accessor: 'email', id: 'email' }, // Столбец для Email
        { Header: 'Роль', accessor: 'role', id: 'role' }, // Столбец для роли
        {
            Header: 'Действия',
            accessor: 'actions',
            id: 'actions',
            Cell: ({ row }) => (
                <>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row.original.id)} // Кнопка для удаления пользователя
                    >
                        Удалить
                    </button>
                    <button
                        className={`btn ${row.original.blocked ? 'btn-success' : 'btn-warning'} btn-sm ms-2`}
                        onClick={() => handleBlock(row.original.id, row.original.blocked)} // Кнопка для блокировки/разблокировки
                    >
                        {row.original.blocked ? 'Разблокировать' : 'Заблокировать'}
                    </button>
                </>
            ),
        },
    ], [handleDelete, handleBlock]);

    // Обновляем порядок столбцов, если он не был установлен
    useEffect(() => {
        if (columnOrder.length === 0) {
            setColumnOrder(allColumns.map(col => col.id)); // Устанавливаем порядок столбцов
        }
    }, [allColumns, columnOrder]);

    // Упорядочиваем столбцы по сохраненному порядку
    const orderedColumns = useMemo(() => {
        return columnOrder.map(id => allColumns.find(col => col.id === id)).filter(Boolean);
    }, [columnOrder, allColumns]);

    // Упорядочиваем данные строк по сохраненному порядку
    const data = useMemo(() =>
        rowOrder.map(id => users.find(user => user.id === id)).filter(Boolean),
        [users, rowOrder]
    );

    // Инициализируем таблицу с использованием react-table
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns: orderedColumns, data }, useSortBy);

    // Обрабатываем окончание перетаскивания столбцов
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active?.id !== over?.id) {
            const oldIndex = columnOrder.indexOf(active.id);
            const newIndex = columnOrder.indexOf(over.id);
            const updated = [...columnOrder];
            const [moved] = updated.splice(oldIndex, 1);
            updated.splice(newIndex, 0, moved);
            setColumnOrder(updated); // Обновляем порядок столбцов после перетаскивания
        }
    };

    // Проверка роли пользователя: если роль пустая, отображаем сообщение о проверке доступа
    if (userRole === '') return <p>Проверка доступа...</p>;

    // Если роль пользователя не 'admin', показываем сообщение, что доступ запрещен
    if (userRole !== 'admin') return <h2>У вас нет доступа к этой странице.</h2>;

    // Если идет загрузка данных пользователей, показываем сообщение о загрузке
    if (loading) return <p>Загрузка пользователей...</p>;

    // Если возникла ошибка при загрузке данных, показываем сообщение с ошибкой
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div className="container mt-4"> {/* Контейнер для всего контента */}
            <h3>Список пользователей</h3> {/* Заголовок для списка пользователей */}

            {/* Обертка для контекста перетаскивания */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {/* Обертка для контекста сортировки */}
                <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    <table className="table" {...getTableProps()}> {/* Таблица с пропсами от useTable */}
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}> {/* Группировка заголовков */}
                                    {headerGroup.headers.map(column => (
                                        <SortableHeader key={column.id} column={column} /> // Рендерим заголовки с возможностью перетаскивания
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}> {/* Тело таблицы */}
                            {rows.map(row => {
                                prepareRow(row); // Подготовка строки для рендера
                                return (
                                    <tr {...row.getRowProps()}> {/* Строки данных таблицы */}
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td> // Ячейки таблицы с рендером данных 
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </SortableContext>
            </DndContext>

            <hr /> {/* Горизонтальная линия-разделитель */}

            <h4>Добавить нового пользователя</h4> {/* Заголовок для формы добавления нового пользователя */}
            <form onSubmit={handleAddUser} className="row g-3"> {/* Форма для добавления нового пользователя */}
                <div className="col-md-4"> {/* Столбец для ввода email */}
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} // Обновляем email в состоянии
                    />
                </div>
                <div className="col-md-4"> {/* Столбец для ввода пароля */}
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Пароль"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} // Обновляем пароль в состоянии
                    />
                </div>
                <div className="col-md-3"> {/* Столбец для выбора роли пользователя */}
                    <select
                        className="form-select"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} // Обновляем роль в состоянии
                    >
                        <option value="user">Пользователь</option> {/* Опция для обычного пользователя */}
                        <option value="admin">Администратор</option> {/* Опция для администратора */}
                    </select>
                </div>
                <div className="col-md-1"> {/* Столбец для кнопки отправки формы */}
                    <button type="submit" className="btn btn-primary w-100"> {/* Кнопка для отправки формы */}
                        Добавить
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPanel; // Экспортируем компонент AdminPanel