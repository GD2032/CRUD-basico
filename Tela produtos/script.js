const openModal = () => document.getElementById('modelo')
    .classList.add('ativo')

const closeModal = () => {
    clearFields()
    document.getElementById('modelo').classList.remove('ativo')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}


//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".header>h2").textContent  = 'Novo Produto'
}

const saveClient = () => {
            const client = {
                nome: document.getElementById('nome').value,
                categoria: document.getElementById('categoria').value,
                descricao: document.getElementById('descricao').value,
                preco: document.getElementById('preco').value
            }
            const index = document.getElementById('nome').dataset.index
            if ((index == 'new' || typeof index === "undefined")){
                console.log("create client");
                createClient(client)
                updateTable()
                closeModal()
            } else if(!(index == 'new')) {
                console.log("update client");
                updateClient(index, client)
                updateTable()
                closeModal()
            }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.categoria}</td>
        <td>${client.descricao}</td>
        <td>${client.preco}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('telefone').value = client.telefone
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    document.querySelector(".header>h2").textContent  = `Editando ${client.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

const button = document.getElementById('cadastro')
// Eventos
button.addEventListener('click', openModal)

 document.getElementById('modalClose')
     .addEventListener('click', closeModal)

 document.getElementById('salvar')
    .addEventListener('click', saveClient)

 document.querySelector('#tableClient>tbody')
     .addEventListener('click', editDelete)

 document.getElementById('cancelar')
     .addEventListener('click', closeModal)