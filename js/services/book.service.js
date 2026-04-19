'use strict'

const STORAGE_KEY = 'books_array'
const PLACEHOLDER = 'img/placeholder_290x370.jpg'

var gBooks
_createBooks()

function getBooks(filter = NaN) {
    if (!filter) return gBooks

    const searchTxt = filter.toLowerCase()

    return gBooks.filter(book =>
        book.title.toLowerCase().includes(searchTxt))
}

function getBook(id) {
    return gBooks.find(book => book.id === id)
}

function removeBook(id) {
    const idx = gBooks.findIndex(book => book.id === id)
    gBooks.splice(idx, 1)

    _saveBooks()
}

function updatePrice(price, id) {
    const book = gBooks.find(book => book.id === id)
    book.price = price

    _saveBooks()
}

function updateRating(rating, id) {
    const book = gBooks.find(book => book.id === id)
    book.rating = rating

    _saveBooks()
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.push(book)

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

function _createBook(title, price, img = PLACEHOLDER) {
    return {
        id: makeId(),
        title,
        price,
        img,
        rating: 0
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
