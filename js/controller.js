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
    const elDetailsModal = document.querySelector('.update-modal')
    gEditingBookId = bookId
    elDetailsModal.showModal()
}

function onSavePrice() {
    const elInput = document.querySelector('.new-price')
    const newPrice = elInput.valueAsNumber
    
    if (!newPrice) return
    updatePrice(newPrice, gEditingBookId)
    gEditingBookId = null
    renderBooks()
}