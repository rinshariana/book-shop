
const gBooks = [
    _createBook('The adventures of Lori Ipsi', 120),
    _createBook('World Atlas', 300),
    _createBook('Zobra The Greek', 87),
]

function addBook(name, price) {
    const book = _createBook(name, price)
    gBooks.push(book)
}

function getBooks() {
    return gBooks
}

function removeBook(id) {
    const idx = gBooks.findIndex(book => book.id = id)
    gBooks.splice(idx, 1)
}

function updatePrice(price, id) {
    const book = gBooks.find(book => book.id === id)
    book.price = price
}

function _createBook(title, price, imgUrl = 'lori-ipsi.jpg') {
    return {
        id: crypto.randomUUID(),
        title,
        price,
        imgUrl
    }
}

console.log(gBooks)