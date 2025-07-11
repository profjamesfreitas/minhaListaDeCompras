// test_script.js

// --- Funções de Utilitário para Testes ---

let testCounter = 0;
let failedTests = [];

/**
 * Função simples para asserções
 * @param {boolean} condition A condição que deve ser verdadeira para o teste passar.
 * @param {string} message A mensagem a ser exibida.
 */
function assert(condition, message) {
    testCounter++;
    if (condition) {
        console.log(`✅ Test #${testCounter}: ${message}`);
    } else {
        console.error(`❌ Test #${testCounter} FAILED: ${message}`);
        failedTests.push(`Test #${testCounter}: ${message}`);
    }
}

/**
 * Simula o DOM e reinicia o estado para cada teste.
 * Isso é fundamental para isolar os testes sem um framework.
 */
function setupTestEnvironment() {
    // Recria o HTML necessário no corpo do documento
    document.body.innerHTML = `
        <div id="app">
            <div id="shoppingList">
                <p id="noItemsMessage">Lista vazia!</p>
            </div>
            <input type="text" id="listName" value="">
            <input type="text" id="itemDescription" value="">
            <input type="number" id="itemQuantity" min="1" value="1">
            <button id="addItemBtn">Adicionar Item</button>
        </div>
    `;

    // Zera o array de itens da aplicação para um estado limpo
    shoppingItems.length = 0;

    // Atualiza as referências DOM para os elementos recriados
    // e define-os como variáveis globais ou acessíveis para os testes
    window.listNameInput = document.getElementById('listName');
    window.itemDescriptionInput = document.getElementById('itemDescription');
    window.itemQuantityInput = document.getElementById('itemQuantity');
    window.shoppingListDiv = document.getElementById('shoppingList');
    window.noItemsMessage = document.getElementById('noItemsMessage');

    // Mocka window.alert para que não apareça pop-ups durante os testes
    // E permite verificar se foi chamado
    window.originalAlert = window.alert; // Salva o alert original
    window.alertMessages = []; // Array para armazenar as mensagens de alerta
    window.alert = (message) => {
        window.alertMessages.push(message);
    };

    // Renderiza a lista para o estado inicial vazio
    renderShoppingList();
}

// --- Casos de Teste (Baseados no Roteiro de Testes) ---

function runAllTests() {
    console.log('--- Iniciando Testes Unitários Manuais ---');
    testCounter = 0;
    failedTests = [];

    // --- CT_001: Adição de um Item Válido (Cenário Básico) ---
    setupTestEnvironment();
    listNameInput.value = 'Compras da Semana';
    itemDescriptionInput.value = 'Arroz';
    itemQuantityInput.value = '2';
    addItem();
    assert(shoppingItems.length === 1, 'CT_001: Item Arroz adicionado corretamente ao array.');
    assert(shoppingItems[0].description === 'Arroz' && shoppingItems[0].quantity === 2, 'CT_001: Dados do item Arroz corretos no array.');
    assert(shoppingListDiv.innerHTML.includes('Arroz <span class="text-sm text-gray-500">(Compras da Semana)</span>'), 'CT_001: Item Arroz renderizado no DOM.');
    assert(shoppingListDiv.innerHTML.includes('Quantidade: 2'), 'CT_001: Quantidade do Arroz renderizada.');
    assert(noItemsMessage.style.display === 'none', 'CT_001: Mensagem "Lista vazia!" oculta.');
    assert(itemDescriptionInput.value === '', 'CT_001: Campo Descrição limpo.');
    assert(itemQuantityInput.value === '1', 'CT_001: Campo Quantidade resetado para 1.');
    assert(listNameInput.value === 'Compras da Semana', 'CT_001: Campo Nome da Lista mantido.');
    assert(window.alertMessages.length === 0, 'CT_001: Nenhum alerta de erro exibido.');


    // --- CT_002: Adição de Múltiplos Itens Válidos à Mesma Lista ---
    setupTestEnvironment();
    listNameInput.value = 'Compras da Semana';
    itemDescriptionInput.value = 'Arroz';
    itemQuantityInput.value = '2';
    addItem();
    itemDescriptionInput.value = 'Feijão';
    itemQuantityInput.value = '1';
    addItem();
    itemDescriptionInput.value = 'Macarrão';
    itemQuantityInput.value = '3';
    addItem();
    assert(shoppingItems.length === 3, 'CT_002: Três itens adicionados ao array.');
    assert(shoppingItems[0].description === 'Arroz' && shoppingItems[1].description === 'Feijão' && shoppingItems[2].description === 'Macarrão', 'CT_002: Itens corretos no array.');
    assert(shoppingListDiv.innerHTML.includes('Arroz') && shoppingListDiv.innerHTML.includes('Feijão') && shoppingListDiv.innerHTML.includes('Macarrão'), 'CT_002: Todos os itens renderizados no DOM.');
    assert(window.alertMessages.length === 0, 'CT_002: Nenhum alerta de erro exibido.');


    // --- CT_003: Adição de Itens a Listas Diferentes ---
    setupTestEnvironment();
    listNameInput.value = 'Compras da Semana';
    itemDescriptionInput.value = 'Frango';
    itemQuantityInput.value = '1';
    addItem();
    listNameInput.value = 'Material de Escritório';
    itemDescriptionInput.value = 'Canetas';
    itemQuantityInput.value = '5';
    addItem();
    assert(shoppingItems.length === 2, 'CT_003: Dois itens adicionados.');
    assert(shoppingItems[0].listName === 'Compras da Semana' && shoppingItems[1].listName === 'Material de Escritório', 'CT_003: Itens com nomes de lista diferentes.');
    assert(shoppingListDiv.innerHTML.includes('Frango <span class="text-sm text-gray-500">(Compras da Semana)</span>') && shoppingListDiv.innerHTML.includes('Canetas <span class="text-sm text-gray-500">(Material de Escritório)</span>'), 'CT_003: Itens com nomes de lista diferentes renderizados.');
    assert(window.alertMessages.length === 0, 'CT_003: Nenhum alerta de erro exibido.');


    // --- CT_004: Tentativa de Adicionar Item com "Nome da Lista" Vazio ---
    setupTestEnvironment();
    listNameInput.value = '';
    itemDescriptionInput.value = 'Leite';
    itemQuantityInput.value = '1';
    addItem();
    assert(shoppingItems.length === 0, 'CT_004: Item não adicionado com Nome da Lista vazio.');
    assert(window.alertMessages.includes('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).'), 'CT_004: Alerta exibido para Nome da Lista vazio.');
    assert(shoppingListDiv.innerHTML.includes('Lista vazia!'), 'CT_004: Mensagem "Lista vazia!" permanece visível.');


    // --- CT_005: Tentativa de Adicionar Item com "Descrição do Item" Vazia ---
    setupTestEnvironment();
    listNameInput.value = 'Mercado';
    itemDescriptionInput.value = '';
    itemQuantityInput.value = '1';
    addItem();
    assert(shoppingItems.length === 0, 'CT_005: Item não adicionado com Descrição vazia.');
    assert(window.alertMessages.includes('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).'), 'CT_005: Alerta exibido para Descrição vazia.');


    // --- CT_006: Tentativa de Adicionar Item com "Quantidade" Vazia ---
    setupTestEnvironment();
    listNameInput.value = 'Casa';
    itemDescriptionInput.value = 'Sabonete';
    itemQuantityInput.value = '';
    addItem();
    assert(shoppingItems.length === 0, 'CT_006: Item não adicionado com Quantidade vazia.');
    assert(window.alertMessages.includes('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).'), 'CT_006: Alerta exibido para Quantidade vazia.');


    // --- CT_007: Tentativa de Adicionar Item com "Quantidade" Zero ---
    setupTestEnvironment();
    listNameInput.value = 'Diversos';
    itemDescriptionInput.value = 'Pilhas';
    itemQuantityInput.value = '0';
    addItem();
    assert(shoppingItems.length === 0, 'CT_007: Item não adicionado com Quantidade zero.');
    assert(window.alertMessages.includes('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).'), 'CT_007: Alerta exibido para Quantidade zero.');


    // --- CT_008: Tentativa de Adicionar Item com "Quantidade" Negativa ---
    setupTestEnvironment();
    listNameInput.value = 'Eletrônicos';
    itemDescriptionInput.value = 'Carregador';
    itemQuantityInput.value = '-5';
    addItem();
    assert(shoppingItems.length === 0, 'CT_008: Item não adicionado com Quantidade negativa.');
    assert(window.alertMessages.includes('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).'), 'CT_008: Alerta exibido para Quantidade negativa.');


    // --- CT_009: Adição de Item com Caracteres Especiais na Descrição ---
    setupTestEnvironment();
    listNameInput.value = 'Cozinha';
    itemDescriptionInput.value = 'Óleo (1 Litro) c/ Desconto!';
    itemQuantityInput.value = '1';
    addItem();
    assert(shoppingItems.length === 1, 'CT_009: Item com caracteres especiais adicionado.');
    assert(shoppingItems[0].description === 'Óleo (1 Litro) c/ Desconto!', 'CT_009: Descrição com caracteres especiais correta.');
    assert(shoppingListDiv.innerHTML.includes('Óleo (1 Litro) c/ Desconto! <span class="text-sm text-gray-500">(Cozinha)</span>'), 'CT_009: Item com caracteres especiais renderizado.');
    assert(window.alertMessages.length === 0, 'CT_009: Nenhum alerta de erro exibido.');


    // --- CT_010: Adição de Item com Quantidade Grande ---
    setupTestEnvironment();
    listNameInput.value = 'Festa';
    itemDescriptionInput.value = 'Copos Descartáveis';
    itemQuantityInput.value = '500';
    addItem();
    assert(shoppingItems.length === 1, 'CT_010: Item com quantidade grande adicionado.');
    assert(shoppingItems[0].quantity === 500, 'CT_010: Quantidade grande correta.');
    assert(shoppingListDiv.innerHTML.includes('Quantidade: 500'), 'CT_010: Quantidade grande renderizada.');
    assert(window.alertMessages.length === 0, 'CT_010: Nenhum alerta de erro exibido.');


    // --- CT_011: Campo Quantidade com Entrada Não Numérica ---
    setupTestEnvironment();
    listNameInput.value = 'Teste';
    itemDescriptionInput.value = 'Item Teste';
    itemQuantityInput.value = 'abc';
    addItem();
    assert(shoppingItems.length === 0, 'CT_011: Item não adicionado com Quantidade não numérica.');
    assert(window.alertMessages.includes('Por favor, preencha todos os campos corretamente (Nome da Lista, Descrição e Quantidade válida).'), 'CT_011: Alerta exibido para Quantidade não numérica.');

    // --- Testes Adicionais (Funcionalidade de Remoção e Estado Vazio) ---

    // Teste de remoção de item
    setupTestEnvironment();
    listNameInput.value = 'Compras';
    itemDescriptionInput.value = 'Maçãs';
    itemQuantityInput.value = '5';
    addItem();
    assert(shoppingItems.length === 1, 'Teste de Remoção: Item adicionado para remoção.');
    // Simula o clique no botão de remover
    const removeButton = shoppingListDiv.querySelector('.btn-remove');
    if (removeButton) {
        removeButton.click(); // Dispara o evento de clique que chama removeItem
    } else {
        console.error('❌ Teste de Remoção FAILED: Botão remover não encontrado.');
        failedTests.push('Teste de Remoção: Botão remover não encontrado.');
    }
    assert(shoppingItems.length === 0, 'Teste de Remoção: Item removido do array.');
    assert(!shoppingListDiv.innerHTML.includes('Maçãs'), 'Teste de Remoção: Item removido do DOM.');
    assert(noItemsMessage.style.display === 'block', 'Teste de Remoção: Mensagem "Lista vazia!" reapareceu.');
    assert(window.alertMessages.length === 0, 'Teste de Remoção: Nenhum alerta de erro exibido.');


    // Teste de remoção de item específico com múltiplos itens
    setupTestEnvironment();
    listNameInput.value = 'Teste';
    itemDescriptionInput.value = 'Item 1';
    itemQuantityInput.value = '1';
    addItem();
    itemDescriptionInput.value = 'Item 2';
    itemQuantityInput.value = '2';
    addItem();
    itemDescriptionInput.value = 'Item 3';
    itemQuantityInput.value = '3';
    addItem();
    assert(shoppingItems.length === 3, 'Teste de Remoção Múltipla: Três itens adicionados.');
    const buttons = shoppingListDiv.querySelectorAll('.btn-remove');
    if (buttons.length > 1) {
        buttons[1].click(); // Clica no botão "Remover" do segundo item (Item 2)
    } else {
        console.error('❌ Teste de Remoção Múltipla FAILED: Botões insuficientes para simular clique.');
        failedTests.push('Teste de Remoção Múltipla: Botões insuficientes para simular clique.');
    }
    assert(shoppingItems.length === 2, 'Teste de Remoção Múltipla: Item removido do array.');
    assert(shoppingItems[0].description === 'Item 1' && shoppingItems[1].description === 'Item 3', 'Teste de Remoção Múltipla: Item correto removido do array.');
    assert(shoppingListDiv.innerHTML.includes('Item 1') && !shoppingListDiv.innerHTML.includes('Item 2') && shoppingListDiv.innerHTML.includes('Item 3'), 'Teste de Remoção Múltipla: Itens corretos no DOM após remoção.');
    assert(window.alertMessages.length === 0, 'Teste de Remoção Múltipla: Nenhum alerta de erro exibido.');


    // Teste de renderização da mensagem "Lista vazia!"
    setupTestEnvironment(); // Garante lista vazia
    assert(shoppingItems.length === 0, 'Teste de Lista Vazia: Array de itens vazio.');
    assert(shoppingListDiv.innerHTML.includes('Lista vazia!'), 'Teste de Lista Vazia: Mensagem "Lista vazia!" renderizada.');
    assert(noItemsMessage.style.display === 'block', 'Teste de Lista Vazia: Mensagem "Lista vazia!" visível.');
    assert(window.alertMessages.length === 0, 'Teste de Lista Vazia: Nenhum alerta de erro exibido.');


    console.log('--- Resumo dos Testes ---');
    console.log(`Total de Asserções: ${testCounter}`);
    if (failedTests.length === 0) {
        console.log('🎉 Todos os testes passaram com sucesso!');
    } else {
        console.error(`💥 ${failedTests.length} Teste(s) FAILED:`);
        failedTests.forEach(test => console.error(test));
    }

    // Restaura o alert original para não afetar o uso normal da página
    window.alert = window.originalAlert;
}

// Executa todos os testes quando a página estiver totalmente carregada
document.addEventListener('DOMContentLoaded', runAllTests);
