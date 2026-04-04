let gEditingBookId = null

function onInit() {
    renderBooks()
}

function renderBooks(filter = NaN) {
    const elTable = document.querySelector('.table')
    let strHtml = `
            <div class="table-header">Title</div>
            <div class="table-header">Price</div>
            <div class="table-header">Action</div>
    `
    strHtml += getBooks(filter).map(bookObj => {
        return `
            <div>${bookObj.title}</div>
            <div>${bookObj.price}</div>
            <div>
                <button>Read</button>
                <button onclick="onUpdateBook('${bookObj.id}')">Update</button>
                <button onclick="onRemoveBook('${bookObj.id}')">Delete</button>
                <button onclick="onShowDetails('${bookObj.id}')">Details</button>
            </div>
        `
    }).join('')

    elTable.innerHTML = strHtml
}

function onRemoveBook(id) {
    removeBook(id)
    renderBooks()
    successPopUp('Book removed')
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
    successPopUp('Price updated')
}

function onAddBook() {
    const elAddBookModal = document.querySelector('.add-modal')
    elAddBookModal.showModal()
}

function onSaveBook() {
    const elName = document.querySelector('.name')
    const elPrice = document.querySelector('.price')

    const name = elName.value
    const price = elPrice.valueAsNumber

    if (!name || !price) return
    addBook(name, price)
    renderBooks()
    successPopUp('New book added')
}

function onShowDetails(id) {
    const elDetailsModal = document.querySelector('.details-modal')
    const elDetails = elDetailsModal.querySelector('pre')

    const book = getBook(id)
    const json = JSON.stringify(book, null, 4)

    elDetails.innerText = json
    elDetailsModal.showModal()
}

function onFilterBooks(elInput) {
    const txt = elInput.value
    renderBooks(txt)
}

function onClearFilter() {
    document.querySelector('.search-input').value = ''
    renderBooks()
}

function successPopUp(txt) {
    const elPopUp = document.querySelector('.pop-up-modal')
    const elTxt = elPopUp.querySelector('p')
    elTxt.innerText = txt

    elPopUp.show()
    setTimeout(() => elPopUp.close(), 2000)
}