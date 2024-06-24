document.addEventListener('DOMContentLoaded', function () {
    const itemForm = document.getElementById('item-form');
    const searchForm = document.getElementById('search-form');
    const itemsTable = document.getElementById('items-table').getElementsByTagName('tbody')[0];

    itemForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;

        try {
            const response = await fetch('/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age })
            });
            const newItem = await response.json();
            addItemToTable(newItem);
            itemForm.reset();
        } catch (err) {
            console.error('Помилка:', err);
        }
    });

    searchForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const search = document.getElementById('search').value;

        try {
            const response = await fetch(`/items?name=${search}`);
            const items = await response.json();
            itemsTable.innerHTML = '';
            items.forEach(item => addItemToTable(item));
        } catch (err) {
            console.error('Помилка:', err);
        }
    });

    async function fetchItems() {
        try {
            const response = await fetch('/items');
            const items = await response.json();
            items.forEach(item => addItemToTable(item));
        } catch (err) {
            console.error('Помилка:', err);
        }
    }

    function addItemToTable(item) {
        const row = itemsTable.insertRow();
        row.dataset.id = item._id;
        row.innerHTML = `
            <td><input type="text" value="${item.name}" readonly></td>
            <td><input type="number" value="${item.age}" readonly></td>
            <td>
                <button class="edit-btn">Ред</button>
                <button class="delete-btn">Видал</button>
                <button class="update-btn" style="display: none;">Онов</button>
            </td>
        `;

        row.querySelector('.edit-btn').addEventListener('click', function () {
            row.querySelector('input[type="text"]').removeAttribute('readonly');
            row.querySelector('input[type="number"]').removeAttribute('readonly');
            row.querySelector('.update-btn').style.display = 'inline';
            this.style.display = 'none';
        });

        row.querySelector('.delete-btn').addEventListener('click', async function () {
            const id = row.dataset.id;
            try {
                await fetch(`/items/${id}`, {
                    method: 'DELETE'
                });
                row.remove();
            } catch (err) {
                console.error('Помилка:', err);
            }
        });

        row.querySelector('.update-btn').addEventListener('click', async function () {
            const id = row.dataset.id;
            const name = row.querySelector('input[type="text"]').value;
            const age = row.querySelector('input[type="number"]').value;
            try {
                const response = await fetch(`/items/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, age })
                });
                const updatedItem = await response.json();
                row.querySelector('input[type="text"]').setAttribute('readonly', 'readonly');
                row.querySelector('input[type="number"]').setAttribute('readonly', 'readonly');
                this.style.display = 'none';
                row.querySelector('.edit-btn').style.display = 'inline';
            } catch (err) {
                console.error('Помилка:', err);
            }
        });
    }

    fetchItems();
});






