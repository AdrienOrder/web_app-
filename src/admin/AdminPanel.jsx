// Импорт основных хуков React
import React, { 
    useEffect,    // Хук для side-эффектов (выполняется после рендера)
    useState,     // Хук для управления состоянием компонента
    useMemo,      // Хук для мемоизации вычислений
    useCallback   // Хук для мемоизации функций
  } from 'react';
  
  // Импорт хука аутентификации из локального файла
  import { useAuth } from '../auto/AuthContext';
  
  // Импорт хуков react-table для работы с таблицами
  import { 
    useTable,    // Основной хук для создания таблицы
    useSortBy    // Плагин для добавления сортировки
  } from 'react-table';
  
  // Импорт компонентов DnD (Drag and Drop) из библиотеки dnd-kit
  import { 
    DndContext,        // Контекст для перетаскивания
    useSensor,         // Хук для создания сенсора
    useSensors,        // Хук для объединения сенсоров
    PointerSensor,     // Сенсор для мыши/тача
    closestCenter      // Алгоритм определения ближайшего целевого элемента
  } from '@dnd-kit/core';
  
  // Импорт компонентов для сортировки из dnd-kit
  import { 
    SortableContext,               // Контекст для сортируемых элементов
    useSortable,                   // Хук для создания сортируемого элемента
    horizontalListSortingStrategy  // Стратегия для горизонтальной сортировки
  } from '@dnd-kit/sortable';
  
  // Импорт CSS-утилит для работы с трансформациями
  import { CSS } from '@dnd-kit/utilities';
  
  // Импорт стилей Bootstrap
  import 'bootstrap/dist/css/bootstrap.min.css';
  
  // Компонент перетаскиваемого заголовка таблицы
  const SortableHeader = ({ column }) => {
    // Использование хука useSortable для реализации перетаскивания
    const {
      attributes,   // HTML-атрибуты для draggable элемента
      listeners,    // Обработчики событий перетаскивания
      setNodeRef,   // Функция для установки ref на DOM-элемент
      transform,    // Объект с трансформациями (x, y, scaleX, scaleY)
      transition,   // Строка с CSS transition
      isDragging    // Флаг: true, если элемент перетаскивается
    } = useSortable({ id: column.id });  // Уникальный идентификатор для сортируемого элемента
  
    // Стили для перетаскиваемого элемента
    const style = {
      transform: CSS.Transform.toString(transform),  // Преобразование трансформации в CSS строку
      transition,                                   // CSS transition для плавности анимации
      cursor: isDragging ? 'grabbing' : 'pointer',  // Изменение курсора при перетаскивании
      whiteSpace: 'nowrap'                          // Запрет переноса текста
    };
  
    // Обработчик клика по заголовку
    const handleClick = (e) => {
      if (isDragging) {                   // Если элемент перетаскивается
        e.stopPropagation();              // Останавливаем всплытие события
        return;                           // Выходим из функции
      }
      column.getSortByToggleProps().onClick(e);  // Вызываем сортировку столбца
    };
  
    // Рендер заголовка таблицы
    return (
      <th
        {...column.getHeaderProps(column.getSortByToggleProps())}  // Пропсы для заголовка и сортировки
        ref={setNodeRef}                  // Устанавливаем ref на DOM-элемент
        style={style}                     // Применяем стили для перетаскивания
        {...attributes}                   // Распаковываем HTML-атрибуты
        {...listeners}                    // Распаковываем обработчики событий
        onClick={handleClick}             // Вешаем обработчик клика
      >
        {column.render('Header')}         {/* Рендерим содержимое заголовка */}
        <span>
          {column.isSorted                /* Отображаем иконку сортировки */
            ? (column.isSortedDesc 
                ? ' 🔽' 
                : ' 🔼') 
            : ''}
        </span>
      </th>
    );
  };
  
  // Основной компонент админ-панели
  const AdminPanel = () => {
    // Получаем роль пользователя из контекста аутентификации
    const { userRole } = useAuth();
  
    // Состояния компонента:
    const [users, setUsers] = useState([]);          // Список пользователей
    const [loading, setLoading] = useState(true);    // Флаг загрузки
    const [error, setError] = useState(null);        // Ошибка загрузки
    const [rowOrder, setRowOrder] = useState([]);    // Порядок строк
    const [columnOrder, setColumnOrder] = useState([]);  // Порядок колонок
    const [newUser, setNewUser] = useState({         // Данные нового пользователя
      email: '',
      password: '',
      role: 'user'
    });
  
    // Настройка сенсоров для DnD
    const sensors = useSensors(
      useSensor(PointerSensor, {  // Используем PointerSensor (мышь/тач)
        activationConstraint: {    // Ограничения активации
          distance: 10             // Минимальное расстояние для начала перетаскивания (в пикселях)
        }
      })
    );
  
    // Эффект для загрузки пользователей при монтировании
    useEffect(() => {
      fetchUsers();  // Вызываем функцию загрузки
    }, []);          // Пустой массив зависимостей = выполнить только при монтировании
  
    // Функция загрузки пользователей с сервера
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');  // GET запрос
        if (!response.ok) {                     // Если статус не 200-299
          throw new Error('Ошибка при загрузке пользователей');  // Генерируем ошибку
        }
        const data = await response.json();     // Парсим JSON ответ
        setUsers(data);                        // Обновляем состояние users
      } catch (err) {                          // Обработка ошибок
        setError(err.message);                 // Сохраняем сообщение об ошибке
      } finally {                              // Выполняется в любом случае
        setLoading(false);                     // Снимаем флаг загрузки
      }
    };
  
    // Эффект для обновления порядка строк при изменении users
    useEffect(() => {
      setRowOrder(users.map(user => user.id));  // Сохраняем массив id пользователей
    }, [users]);                               // Зависимость от users
  
    // Функция удаления пользователя (useCallback для мемоизации)
    const handleDelete = useCallback(async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: 'DELETE'  // DELETE запрос
        });
        if (!response.ok) {
          throw new Error('Ошибка при удалении пользователя');
        }
        // Удаляем пользователя из состояния
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (err) {
        alert(err.message);  // Показываем ошибку в alert
      }
    }, []);  // Пустой массив зависимостей - функция не будет пересоздаваться
  
    // Функция блокировки/разблокировки пользователя
    const handleBlock = useCallback(async (userId, isBlocked) => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: 'PATCH',  // PATCH запрос для частичного обновления
          headers: { 
            'Content-Type': 'application/json'  // Указываем тип контента
          },
          body: JSON.stringify({ 
            blocked: !isBlocked  // Инвертируем статус блокировки
          })
        });
        if (!response.ok) {
          throw new Error('Ошибка при изменении блокировки');
        }
        // Обновляем состояние users
        setUsers(prev =>
          prev.map(user => 
            user.id === userId 
              ? { ...user, blocked: !isBlocked }  // Обновляем только нужного пользователя
              : user
          )
        );
      } catch (err) {
        alert(err.message);
      }
    }, []);
  
    // Функция добавления нового пользователя
    const handleAddUser = async (e) => {
      e.preventDefault();  // Предотвращаем перезагрузку страницы
      
      // Деструктуризация состояния newUser
      const { email, password, role } = newUser;
      
      // Валидация полей
      if (!email || !password || !role) {
        alert('Пожалуйста, заполните все поля');
        return;  // Выходим из функции если не все поля заполнены
      }
  
      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'POST',  // POST запрос
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({  // Преобразуем объект в JSON
            email,
            password,
            role,
            blocked: false  // По умолчанию пользователь не заблокирован
          })
        });
        if (!response.ok) {
          throw new Error('Ошибка при добавлении пользователя');
        }
        const newUserData = await response.json();  // Парсим ответ
        // Добавляем нового пользователя в состояние
        setUsers(prev => [...prev, newUserData]);
        // Сбрасываем форму
        setNewUser({ email: '', password: '', role: 'user' });
      } catch (err) {
        alert(err.message);
      }
    };
  
    // Мемоизированное определение колонок таблицы
    const allColumns = useMemo(() => [
      { 
        Header: 'ID',     // Заголовок колонки
        accessor: 'id',   // Ключ в данных
        id: 'id'          // Уникальный идентификатор
      },
      { 
        Header: 'Email', 
        accessor: 'email', 
        id: 'email' 
      },
      { 
        Header: 'Роль', 
        accessor: 'role', 
        id: 'role' 
      },
      {
        Header: 'Действия',
        accessor: 'actions',
        id: 'actions',
        // Кастомная ячейка с кнопками
        Cell: ({ row }) => (
          <>
            {/* Кнопка удаления */}
            <button
              className="btn btn-danger btn-sm"  // Стили Bootstrap
              onClick={() => handleDelete(row.original.id)}  // Обработчик
            >
              Удалить
            </button>
            
            {/* Кнопка блокировки/разблокировки */}
            <button
              className={`btn ${row.original.blocked ? 'btn-success' : 'btn-warning'} btn-sm ms-2`}
              onClick={() => handleBlock(row.original.id, row.original.blocked)}
            >
              {row.original.blocked ? 'Разблокировать' : 'Заблокировать'}
            </button>
          </>
        ),
      },
    ], [handleDelete, handleBlock]);  // Зависимости для useMemo
  
    // Эффект для инициализации порядка колонок
    useEffect(() => {
      if (columnOrder.length === 0) {  // Если порядок еще не установлен
        setColumnOrder(allColumns.map(col => col.id));  // Устанавливаем порядок по умолчанию
      }
    }, [allColumns, columnOrder]);  // Зависимости
  
    // Мемоизированный массив колонок в правильном порядке
    const orderedColumns = useMemo(() => {
      return columnOrder
        .map(id => allColumns.find(col => col.id === id))  // Находим колонку по id
        .filter(Boolean);                                  // Удаляем undefined (на случай ошибок)
    }, [columnOrder, allColumns]);
  
    // Мемоизированные данные строк в правильном порядке
    const data = useMemo(() =>
      rowOrder
        .map(id => users.find(user => user.id === id))  // Находим пользователя по id
        .filter(Boolean),                               // Удаляем undefined
      [users, rowOrder]                                // Зависимости
    );
  
    // Создание экземпляра таблицы с помощью react-table
    const {
      getTableProps,       // Пропсы для элемента table
      getTableBodyProps,   // Пропсы для tbody
      headerGroups,        // Группы заголовков
      rows,                // Строки данных
      prepareRow           // Функция подготовки строки к рендеру
    } = useTable({ 
      columns: orderedColumns,  // Колонки
      data                     // Данные
    }, useSortBy);             // Плагин для сортировки
  
    // Обработчик окончания перетаскивания
    const handleDragEnd = (event) => {
      const { active, over } = event;  // active - перетаскиваемый, over - над чем отпустили
      
      if (active?.id !== over?.id) {   // Если позиция изменилась
        const oldIndex = columnOrder.indexOf(active.id);  // Старый индекс
        const newIndex = columnOrder.indexOf(over.id);    // Новый индекс
        const updated = [...columnOrder];                 // Копия массива
        const [moved] = updated.splice(oldIndex, 1);     // Удаляем из старой позиции
        updated.splice(newIndex, 0, moved);              // Вставляем в новую позицию
        setColumnOrder(updated);                         // Обновляем состояние
      }
    };
  
    // Проверка прав доступа и состояния загрузки
    if (userRole === '') return <p>Проверка доступа...</p>;          // Роль еще не определена
    if (userRole !== 'admin') return <h2>У вас нет доступа к этой странице.</h2>;  // Нет прав
    if (loading) return <p>Загрузка пользователей...</p>;            // Идет загрузка
    if (error) return <p>Ошибка: {error}</p>;                        // Ошибка загрузки
  
    // Рендер основного интерфейса
    return (
      <div className="container mt-4">  {/* Контейнер Bootstrap с отступом сверху */}
        <h3>Список пользователей</h3>   {/* Заголовок */}
  
        {/* Контекст перетаскивания */}
        <DndContext 
          sensors={sensors}                      // Передаем сенсоры
          collisionDetection={closestCenter}     // Алгоритм определения цели
          onDragEnd={handleDragEnd}              // Обработчик окончания перетаскивания
        >
          {/* Контекст сортировки */}
          <SortableContext 
            items={columnOrder}                  // Массив id сортируемых элементов
            strategy={horizontalListSortingStrategy}  // Стратегия для горизонтальной сортировки
          >
            {/* Таблица */}
            <table className="table" {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (  // Маппинг групп заголовков
                  <tr {...headerGroup.getHeaderGroupProps()}>  {/* Строка заголовков */}
                    {headerGroup.headers.map(column => (  // Маппинг заголовков
                      <SortableHeader 
                        key={column.id} 
                        column={column}  // Передаем объект колонки
                      />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {  // Маппинг строк данных
                  prepareRow(row);  // Подготовка строки
                  return (
                    <tr {...row.getRowProps()}>  {/* Строка таблицы */}
                      {row.cells.map(cell => (  // Маппинг ячеек
                        <td {...cell.getCellProps()}>
                          {cell.render('Cell')}  {/* Рендер ячейки */}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
  
        <hr />  {/* Горизонтальная линия */}
  
        {/* Форма добавления нового пользователя */}
        <h4>Добавить нового пользователя</h4>
        <form onSubmit={handleAddUser} className="row g-3">  {/* Форма с сеткой Bootstrap */}
          {/* Поле email */}
          <div className="col-md-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          
          {/* Поле пароля */}
          <div className="col-md-4">
            <input
              type="password"
              className="form-control"
              placeholder="Пароль"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          
          {/* Выбор роли */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          
          {/* Кнопка отправки */}
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">
              Добавить
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  // Экспорт компонента по умолчанию
  export default AdminPanel;