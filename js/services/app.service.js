'use strict'

const STORAGE_KEY = 'books_array'

let gBooks
_createBooks()

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.push(book)
    _saveBooks()
}

function getBooks(filter = NaN) {
    if (!filter) return gBooks

    const searchTxt = filter.toLowerCase()
    const books = gBooks.filter(book => book.title.toLowerCase().includes(searchTxt))
    return books
}

function getBook(id) {
    return gBooks.find(book => book.id === id)
}

function removeBook(id) {
    const idx = gBooks.findIndex(book => book.id = id)
    gBooks.splice(idx, 1)
    _saveBooks()
}

function updatePrice(price, id) {
    const book = gBooks.find(book => book.id === id)
    book.price = price
    _saveBooks()
}

function _createBook(title, price, imgUrl = 'lori-ipsi.jpg') {
    return {
        id: crypto.randomUUID(),
        title,
        price,
        imgUrl
    }
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)

    if (gBooks && gBooks.length > 0) return
    gBooks = [
        _createBook('The adventures of Lori Ipsi', 120),
        _createBook('World Atlas', 300),
        _createBook('Zobra The Greek', 87),
    ]
    _saveBooks()
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}
