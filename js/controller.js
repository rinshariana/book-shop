let gEditingBookId = null

function onInit() {
    renderBooks()
}

function renderBooks(filter = NaN) {
    const elTable = document.querySelector('.table')
    let strHtml = `
            <div class="table-header"><span>Title</span></div>
            <div class="table-header"><span>Rating</span></div>
            <div class="table-header"><span>Price</span></div>
            <div class="table-header"><span>Action</span></div>
    `
    const books = getBooks(filter)
    if (!books.length) {
        strHtml += `<div class="message">
                        <span>No matching books were found...</span>
                    </div>`
    } else {
        strHtml += books.map(bookObj => {
            const ratingStr = createRatingEl(bookObj)
            return `
            <div>
                <img src="${bookObj.img}" alt="book cover">
                <span>${bookObj.title}</span>
            </div>
            <div class="rating">${ratingStr}</div>
            <div>
                <span>${bookObj.price}</span>
            </div>
            <div>
                <button>Read</button>
                <button onclick="onUpdateBook('${bookObj.id}')">Update</button>
                <button onclick="onRemoveBook('${bookObj.id}')">Delete</button>
                <button onclick="onShowDetails('${bookObj.id}')">Details</button>
            </div>
            `
        }).join('')
    }

    elTable.innerHTML = strHtml
    renderStats()
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
    const elBookCover = elDetailsModal.querySelector('img')
    // const elDetails = elDetailsModal.querySelector('p')
    const elRating = elDetailsModal.querySelector('.rating')

    const book = getBook(id)
    const rating = createRatingEl(book)
    console.dir(elBookCover)
    
    elRating.innerHTML = rating
    elBookCover.src = book.img
    // elDetails.innerText = 'shdsahfvakufv'
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
    const elTxt = elPopUp.querySelector('span')
    elTxt.innerText = txt

    elPopUp.show()
    setTimeout(() => elPopUp.close(), 2000)
}

function renderStats() {
    const elExpensive = document.querySelector('.expensive-count')
    const elAvg = document.querySelector('.average-count')
    const elCheap = document.querySelector('.cheap-count')

    elExpensive.innerText = getByPriceCheap()
    elAvg.innerText = getByPriceAvg()
    elCheap.innerText = getByPriceExpensive()
}

function onStarClick(el, id) {
    const value = el.dataset.value
    updateRating(value, id)
    renderBooks()
    console.log(gBooks)
}