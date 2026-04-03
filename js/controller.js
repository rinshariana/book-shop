let gEditingBookId = null

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elTable = document.querySelector('.table')
    let strHtml = `
            <div class="table-header">Title</div>
            <div class="table-header">Price</div>
            <div class="table-header">Action</div>
    `
    strHtml += getBooks().map(bookObj => {
        return `
            <div>${bookObj.title}</div>
            <div>${bookObj.price}</div>
            <div>
                <button>Read</button>
                <button onclick="onUpdateBook('${bookObj.id}')">Update</button>
                <button onclick="onRemoveBook('${bookObj.id}')">Delete</button>
            </div>
        `
    }).join('')

    elTable.innerHTML = strHtml
}

function onRemoveBook(id) {
    removeBook(id)
    renderBooks()
}

function onUpdateBook(bookId) {
    const elUpdateModal = document.querySelector('.update-modal')
    gEditingBookId = bookId
    elUpdateModal.showModal()
}

function onSavePrice() {
    const elNewPrice = document.querySelector('.new-price')
    const newPrice = elNewPrice.valueAsNumber

    if (!newPrice) return
    updatePrice(newPrice, gEditingBookId)
    gEditingBookId = null
    renderBooks()
}

function onAddBook() {
    const elDetailsModal = document.querySelector('.add-modal')
    elDetailsModal.showModal()
}

function onSaveBook() {
    const elName = document.querySelector('.name')
    const elPrice = document.querySelector('.price')

    const name = elName.value
    const price = elPrice.valueAsNumber

    if(!name || !price) return
    addBook(name, price)
    renderBooks()
}