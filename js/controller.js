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
    strHtml += gBooks.map(bookObj => {
        return `
            <div>${bookObj.title}</div>
            <div>${bookObj.price}</div>
            <div>
                <button>Read</button>
                <button>Update</button>
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