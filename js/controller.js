function onInit() {
    renderBooks()
}

function renderBooks() {
    const elTable = document.querySelector('.table')
    const strHtml = gBooks.map(bookObj => {
        return `
            <div>${bookObj.title}</div>
            <div>${bookObj.price}</div>
            <div>
                <button>Read</button>
                <button>Update</button>
                <button>Delete</button>
            </div>
        `
    })
    elTable.innerHTML += strHtml.join('')
}