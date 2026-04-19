'use strict'

var gEditingBookId = null
var gFilter = ''
var gIsDetailsShown = false

function onInit() {
    renderBooks()
}

function renderBooks() {
    const elTable = document.querySelector('.table')
    var strHtml = `
        <div class="table-header"><span>Title</span></div>
        <div class="table-header"><span>Rating</span></div>
        <div class="table-header"><span>Price</span></div>
        <div class="table-header"><span>Action</span></div>
    `
    const books = getBooks(gFilter)
    if (!books.length) {
        strHtml += `<div class="message">
                        <span>No matching books were found...</span>
                    </div>`
    } else {
        strHtml += books
            .map(book => {
                const ratingHtml = createRatingEl(book)
                return `
                <div>
                    <img src="${book.img}" alt="book cover">
                    <span>${book.title}</span>
                </div>
                <div class="rating">${ratingHtml}</div>
                <div>
                    <span>${book.price}</span>
                </div>
                <div>
                    <button onclick="onUpdateBook('${book.id}')">Update</button>
                    <button onclick="onRemoveBook('${book.id}')">Delete</button>
                    <button onclick="onShowDetails('${book.id}')">Details</button>
                </div>`
            })
            .join('')
    }

    elTable.innerHTML = strHtml
    renderStats()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    successPopUp('Book removed')
}

function onUpdateBook(bookId) {
    const elUpdateModal = document.querySelector('.update-modal')

    const elNewPrice = document.querySelector('.new-price')
    elNewPrice.value = ''

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

function onCloseUpdateModal() {
    const elModal = document.querySelector('.update-modal')
    elModal.close()
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
    const elRating = elDetailsModal.querySelector('.rating')
    const elPrice = elDetailsModal.querySelector('.price')

    const book = getBook(id)
    const ratingHtml = createRatingEl(book)

    elRating.innerHTML = ratingHtml
    elPrice.innerHTML = book.price
    elBookCover.src = book.img
    gIsDetailsShown = true
    elDetailsModal.showModal()
}

function onCloseDetails() {
    gIsDetailsShown = false
}

function onFilterBooks(elInput) {
    gFilter = elInput.value
    renderBooks()
}

function onClearFilter() {
    document.querySelector('.search-input').value = ''
    gFilter = ''
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
    const priceMap = getPriceMap()

    const elExpensive = document.querySelector('.expensive-count')
    const elAvg = document.querySelector('.average-count')
    const elCheap = document.querySelector('.cheap-count')

    elExpensive.innerText = priceMap.expensive
    elAvg.innerText = priceMap.avg
    elCheap.innerText = priceMap.cheap
}

function createRatingEl(book) {
    const stars = '★★★★★'.split('')
    const strHtmls = stars.map((star, idx) => {
        const className = idx <= book.rating ? 'active' : ''
        return `<span 
            class="${className}" 
            data-value="${idx}" 
            onclick="onStarClick(this, '${book.id}')">${star}</span>`
    })

    return strHtmls.join('')
}

function onStarClick(elStar, bookId) {
    const value = +elStar.dataset.value
    updateRating(value, bookId)

    if (gIsDetailsShown) {
        const elRating = document.querySelector('.details-modal .rating')
        const book = getBook(bookId)
        elRating.innerHTML = createRatingEl(book)
    }

    renderBooks()
}
