document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const titleInput = document.getElementById('taskTitle');
    const dateInput = document.getElementById('taskDate');

    const heading = Array.from(document.querySelectorAll('h2'))
        .find(h2 => h2.textContent.trim() === 'Список завдань');

    let header = heading.closest('.list-header');
    if (!header) {
        header = document.createElement('div');
        header.className = 'list-header';
        heading.parentNode.insertBefore(header, heading);
        header.appendChild(heading);
    }

    let clearBtn = document.getElementById('clearCompleted');
    if (!clearBtn) {
        clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.id = 'clearCompleted';
        clearBtn.textContent = 'Видалити виконані';
        header.appendChild(clearBtn);
    }

    const taskListContainer = header.nextElementSibling;

    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty';
    emptyMsg.textContent = 'Поки що завдань немає...';

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';

        const months = [
            'січ.', 'лют.', 'бер.', 'квіт.', 'трав.', 'черв.',
            'лип.', 'серп.', 'вер.', 'жовт.', 'лист.', 'груд.'
        ];

        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} р.`;
    }

    function updateEmptyState() {
        const hasTasks = taskListContainer
            .querySelector('input[type="checkbox"]') !== null;

        if (hasTasks) {
            emptyMsg.remove();
        } else {
            taskListContainer.appendChild(emptyMsg);
        }
    }

    function updateClearButton() {
        const hasCompleted = taskListContainer
            .querySelectorAll('input[type="checkbox"]:checked').length > 0;
        clearBtn.disabled = !hasCompleted;
    }

    function clearCompleted() {
        taskListContainer
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach(checkbox => {
                checkbox.parentElement.parentElement.remove();
            });
        updateClearButton();
        updateEmptyState();
    }

    clearBtn.addEventListener('click', clearCompleted);

    taskListContainer.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
            updateClearButton();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleText = titleInput.value.trim();
        const rawDate = dateInput.value;

        if (!titleText) return;

        const taskItem = document.createElement('div');

        const leftSubDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const span = document.createElement('span');
        span.textContent = titleText;

        leftSubDiv.appendChild(checkbox);
        leftSubDiv.appendChild(span);

        const dateSubDiv = document.createElement('div');
        dateSubDiv.textContent = formatDate(rawDate);

        taskItem.appendChild(leftSubDiv);
        taskItem.appendChild(dateSubDiv);

        taskListContainer.appendChild(taskItem);

        titleInput.value = '';
        dateInput.value = '';

        updateEmptyState();
    });

    updateClearButton();
    updateEmptyState();
});