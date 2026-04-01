
const gBooks = [
    _createBook('The adventures of Lori Ipsi', 120),
    _createBook('World Atlas', 300),
    _createBook('Zobra The Greek', 87),
]

function getBook() {
    return gBooks
}





function _createBook(title, price, imgUrl = 'lori-ipsi.jpg') {
    return {
        id: crypto.randomUUID(),
        title,
        price,
        imgUrl
    }
}
