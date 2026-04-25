'use strict'

const STORAGE_KEY = 'books_array_v2'
const PLACEHOLDER = 'img/placeholder_290x370.jpg'
const PAGE_SIZE = 5

var gBooks
var gFilterBy = _getDefaultFilterBy()
var gSortBy = _getDefaultSortBy()
var gPageIdx = 0
_createBooks()

function getBooksForDisplay() {
    const books = _getFilteredAndSortedBooks()
    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function getBook(id) {
    return gBooks.find(book => book.id === id)
}

function getFilterBy() {
    return { ...gFilterBy }
}

function setFilterBy(filterBy = {}) {
    gFilterBy = {
        ...gFilterBy,
        ...filterBy
    }

    gFilterBy.txt = gFilterBy.txt.trim()
    gFilterBy.minRating = +gFilterBy.minRating || 0
    gPageIdx = 0
}

function getSortBy() {
    return { ...gSortBy }
}

function setSortBy(sortBy = {}) {
    gSortBy = {
        ...gSortBy,
        ...sortBy
    }
}

function getPageIdx() {
    return gPageIdx
}

function setPageIdx(pageIdx) {
    const pageCount = getPageCount()
    if (!pageCount) {
        gPageIdx = 0
        return
    }

    if (pageIdx < 0) gPageIdx = pageCount - 1
    else if (pageIdx >= pageCount) gPageIdx = 0
    else gPageIdx = pageIdx
}

function getPageCount() {
    return Math.ceil(_getFilteredAndSortedBooks().length / PAGE_SIZE)
}

function removeBook(id) {
    const idx = gBooks.findIndex(book => book.id === id)
    gBooks.splice(idx, 1)
    _normalizePageIdx()

    _saveBooks()
}

function updateBookById(id, bookToSave) {
    const book = gBooks.find(book => book.id === id)
    if (!book) return

    book.title = bookToSave.title
    book.price = +bookToSave.price
    book.rating = _normalizeRating(bookToSave.rating)
    book.img = bookToSave.img || PLACEHOLDER

    _saveBooks()
}

function updateRating(rating, id) {
    const book = gBooks.find(book => book.id === id)
    if (!book) return

    book.rating = _normalizeRating(rating)
    _saveBooks()
}

function addBook(title, price, rating = 1, img = PLACEHOLDER) {
    const book = _createBook(title, price, img, rating)
    gBooks.push(book)
    _normalizePageIdx()

    _saveBooks()
}

function getByPriceAvg() {
    return gBooks.filter(book => book.price > 100 && book.price < 200).length
}

function getByPriceExpensive() {
    return gBooks.filter(book => book.price >= 200).length
}

function getByPriceCheap() {
    return gBooks.filter(book => book.price <= 100).length
}

function getPriceMap() {
    return gBooks.reduce((map, book) => {
        if (book.price <= 100) map.cheap++
        else if (book.price < 200) map.avg++
        else map.expensive++

        return map
    }, { cheap: 0, avg: 0, expensive: 0 })
}

function _createBook(title, price, img = PLACEHOLDER, rating = getRandomIntInclusive(1, 5)) {
    return {
        id: makeId(),
        title,
        price: +price,
        img,
        rating: _normalizeRating(rating)
    }
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length > 0) return

    gBooks = [
        _createBook('Dune', 120, 'img/81Ua99CURsL._AC_UF1000,1000_QL80_.jpg'),
        _createBook('God Emperor Of Dune', 300, 'img/81Vd8KaCXzL._SL1500_.jpg'),
        _createBook('For Whom Bells Tolls', 75, 'img/9780099289821.jpg'),
        _createBook('Metamorphosis And Other Stories', 249, 'img/9780241436240.jpg'),
        _createBook('The Second Sex', 279, 'img/9780099595731.jpg'),
        _createBook('Anna Karenina', 150, 'img/9780099540663.jpg'),
        _createBook('Crime And Punishment', 79, 'img/9780141192802.jpg'),
    ]
    _saveBooks()
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _getFilteredAndSortedBooks() {
    var books = gBooks.slice()

    if (gFilterBy.txt) {
        const searchTxt = gFilterBy.txt.toLowerCase()
        books = books.filter(book => book.title.toLowerCase().includes(searchTxt))
    }

    if (gFilterBy.minRating) {
        books = books.filter(book => book.rating >= gFilterBy.minRating)
    }

    books.sort((book1, book2) => {
        const dir = gSortBy.dir === 'desc' ? -1 : 1
        const { field } = gSortBy

        if (field === 'title') return book1.title.localeCompare(book2.title) * dir
        return (book1[field] - book2[field]) * dir
    })

    return books
}

function _normalizePageIdx() {
    const pageCount = getPageCount()
    if (!pageCount) {
        gPageIdx = 0
        return
    }

    if (gPageIdx > pageCount - 1) gPageIdx = pageCount - 1
}

function _normalizeRating(rating) {
    rating = +rating || 1
    return Math.min(Math.max(rating, 1), 5)
}

function _getDefaultFilterBy() {
    return {
        txt: '',
        minRating: 0
    }
}

function _getDefaultSortBy() {
    return {
        field: 'title',
        dir: 'asc'
    }
}
