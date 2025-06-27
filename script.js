document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCounter = document.getElementById('task-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all';
    renderTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filter = this.getAttribute('data-filter');
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.done);
        saveTasks();
        renderTasks();
    });

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;
        tasks.push({ text, done: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let filteredTasks = tasks;
        if (filter === 'active') filteredTasks = tasks.filter(t => !t.done);
        if (filter === 'completed') filteredTasks = tasks.filter(t => t.done);
        filteredTasks.forEach((task, idx) => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const left = document.createElement('div');
            left.className = 'task-left';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.done;
            checkbox.addEventListener('change', () => toggleDone(idx));

            const span = document.createElement('input');
            span.type = 'text';
            span.value = task.text;
            span.className = 'task-text' + (task.done ? ' done' : '');
            span.readOnly = true;
            span.addEventListener('dblclick', () => editTask(span, idx));
            span.addEventListener('blur', () => finishEdit(span, idx));
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') span.blur();
                if (e.key === 'Escape') {
                    span.value = tasks[idx].text;
                    span.blur();
                }
            });

            left.appendChild(checkbox);
            left.appendChild(span);

            const delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.textContent = '🗑';
            delBtn.title = 'Delete';
            delBtn.addEventListener('click', () => deleteTask(idx));

            li.appendChild(left);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });
        updateCounter();
    }

    function toggleDone(idx) {
        tasks[idx].done = !tasks[idx].done;
        saveTasks();
        renderTasks();
    }

    function deleteTask(idx) {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(input, idx) {
        input.readOnly = false;
        input.classList.add('editing');
        input.focus();
        input.selectionStart = input.value.length;
    }

    function finishEdit(input, idx) {
        input.readOnly = true;
        input.classList.remove('editing');
        const newText = input.value.trim();
        if (newText) {
            tasks[idx].text = newText;
            saveTasks();
        } else {
            deleteTask(idx);
        }
        renderTasks();
    }

    function updateCounter() {
        const activeCount = tasks.filter(t => !t.done).length;
        const total = tasks.length;
        taskCounter.textContent = `${activeCount} active / ${total} total`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});










h      h      h      h      h      

