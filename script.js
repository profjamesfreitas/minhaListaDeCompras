// script.js (certifique-se que estas variáveis e funções são globais ou acessíveis)

let shoppingItems = []; // Declare como let e globalmente

// Funções (renderShoppingList, addItem, removeItem)
function renderShoppingList() {
    const shoppingListDiv = document.getElementById('shoppingList');
    const noItemsMessage = document.getElementById('noItemsMessage');

    if (!shoppingListDiv || !noItemsMessage) {
        console.error('Elementos DOM não encontrados para renderShoppingList.');
        return;
    }

    shoppingListDiv.innerHTML = '';

    if (shoppingItems.length === 0) {
        noItemsMessage.style.display = 'block';
        shoppingListDiv.appendChild(noItemsMessage);
    } else {
        noItemsMessage.style.display = 'none';
        shoppingItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('flex', 'items-center', 'justify-between', 'bg-white', 'p-4', 'rounded-md', 'shadow-sm', 'border', 'border-gray-200');

            itemElement.innerHTML = `
                <div>
                    <p class="text-lg font-medium text-gray-800">${item.description} <span class="text-sm text-gray-500">(${item.listName})</span></p>
                    <p class="text-gray-600">Quantidade: ${item.quantity}</p>
                </div>
                <button data-index="${index}" class="btn-remove text-sm font-semibold">Remover</button>
            `;
            shoppingListDiv.appendChild(itemElement);
        });
    }
}

function addItem() {
    const listNameInput = document.getElementById('listName');
    const itemDescriptionInput = document.getElementById('itemDescription');
    const itemQuantityInput = document.getElementById('itemQuantity');

    if (!listNameInput || !itemDescriptionInput || !itemQuantityInput) {
        console.error('Elementos de input não encontrados para addItem.');
        return;
    }

    const listName = listNameInput.value.trim();
    const description = itemDescriptionInput.value.trim();
    const quantity = parseInt(itemQuantityInput.value, 10);

    if (!listName || !description || isNaN(quantity) || quantity <= 0) {
        window.alert('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).');
        return;
    }

    const newItem = {
        listName: listName,
        description: description,
        quantity: quantity
    };

    shoppingItems.push(newItem);

    itemDescriptionInput.value = '';
    itemQuantityInput.value = '1';

    renderShoppingList();
}

function removeItem(index) {
    if (index >= 0 && index < shoppingItems.length) {
        shoppingItems.splice(index, 1);
        renderShoppingList();
    }
}

// Adiciona listeners de evento (apenas se os elementos existirem)
document.addEventListener('DOMContentLoaded', () => {
    const addItemBtn = document.getElementById('addItemBtn');
    const shoppingListDiv = document.getElementById('shoppingList');

    if (addItemBtn) {
        addItemBtn.addEventListener('click', addItem);
    }

    if (shoppingListDiv) {
        shoppingListDiv.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-remove')) {
                const indexToRemove = parseInt(event.target.dataset.index, 10);
                removeItem(indexToRemove);
            }
        });
    }

    // Renderiza a lista inicialmente (vazia)
    renderShoppingList();
});

// Para fins de teste sem módulos, tornamos shoppingItems global explicitamente
// Isso é útil se você não tem controle total sobre o escopo no navegador simples.
// Para seu caso específico, a variável global já estará acessível.
// window.shoppingItems = shoppingItems;
