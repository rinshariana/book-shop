'use strict'

var gEditingBookId = null
var gDetailsBookId = null

function onInit() {
    _applyStateFromQueryParams()
    renderPage()
    _restoreModalStateFromQueryParams()
}

function renderPage() {
    renderFilterControls()
    renderSortControls()
    renderBooks()
    renderPagination()
    renderStats()
    _updateQueryParams()
}

function renderFilterControls() {
    const filterBy = getFilterBy()

    document.querySelector('.search-input').value = filterBy.txt
    document.querySelector('.min-rating-select').value = String(filterBy.minRating)
}

function renderSortControls() {
    const sortBy = getSortBy()
    document.querySelector('.sort-select').value = sortBy.field
    document.querySelector(`input[name="sort-dir"][value="${sortBy.dir}"]`).checked = true
}

function renderBooks() {
    const elTable = document.querySelector('.table')
    const sortBy = getSortBy()
    const books = getBooksForDisplay()

    var strHtml = `
        <button class="table-header sort-btn" onclick="onSetSort('title')">
            Title ${_getSortIndicator('title', sortBy)}
        </button>
        <button class="table-header sort-btn" onclick="onSetSort('rating')">
            Rating ${_getSortIndicator('rating', sortBy)}
        </button>
        <button class="table-header sort-btn" onclick="onSetSort('price')">
            Price ${_getSortIndicator('price', sortBy)}
        </button>
        <div class="table-header">Actions</div>
    `

    if (!books.length) {
        strHtml += `
            <div class="message">
                <span>No matching books were found...</span>
            </div>
        `
    } else {
        strHtml += books.map(book => `
            <div class="book-cell">
                <img src="${book.img}" alt="${book.title}">
                <span>${book.title}</span>
            </div>
            <div class="rating">${createRatingEl(book.rating)}</div>
            <div class="price-cell">$${book.price}</div>
            <div class="actions-cell">
                <button onclick="onOpenEditModal('${book.id}')">Edit</button>
                <button onclick="onRemoveBook('${book.id}')">Delete</button>
                <button onclick="onShowDetails('${book.id}')">Details</button>
            </div>
        `).join('')
    }

    elTable.innerHTML = strHtml
}

function renderPagination() {
    const elPagination = document.querySelector('.pagination')
    const pageCount = getPageCount()
    const pageIdx = getPageIdx()

    if (!pageCount) {
        elPagination.innerHTML = ''
        return
    }

    var strHtml = `<button onclick="onChangePage(-1)">Prev</button>`

    for (var idx = 0; idx < pageCount; idx++) {
        const className = idx === pageIdx ? 'active' : ''
        strHtml += `
            <button class="${className}" onclick="onGoToPage(${idx})">${idx + 1}</button>
        `
    }

    strHtml += `<button onclick="onChangePage(1)">Next</button>`
    elPagination.innerHTML = strHtml
}

function renderStats() {
    const priceMap = getPriceMap()

    document.querySelector('.expensive-count').innerText = priceMap.expensive
    document.querySelector('.average-count').innerText = priceMap.avg
    document.querySelector('.cheap-count').innerText = priceMap.cheap
}

function onFilterBooks(elInput) {
    setFilterBy({ txt: elInput.value })
    renderPage()
}

function onSetMinRating(elSelect) {
    setFilterBy({ minRating: +elSelect.value })
    renderPage()
}

function onClearFilter() {
    setFilterBy({ txt: '', minRating: 0 })
    renderPage()
}

function onSetSort(field) {
    const sortBy = getSortBy()

    if (sortBy.field === field) {
        setSortBy({ dir: sortBy.dir === 'asc' ? 'desc' : 'asc' })
    } else {
        setSortBy({ field, dir: 'asc' })
    }

    renderPage()
}

function onSetSortField(elSelect) {
    setSortBy({ field: elSelect.value })
    renderPage()
}

function onSetSortDir(elRadio) {
    setSortBy({ dir: elRadio.value })
    renderPage()
}

function onChangePage(diff) {
    setPageIdx(getPageIdx() + diff)
    renderPage()
}

function onGoToPage(pageIdx) {
    setPageIdx(pageIdx)
    renderPage()
}

function onRemoveBook(bookId) {
    removeBook(bookId)

    if (gDetailsBookId === bookId) _closeDetailsModal()
    if (gEditingBookId === bookId) _closeEditModal()

    renderPage()
    successPopUp('Book removed')
}

function onAddBook() {
    gEditingBookId = null
    _populateEditForm()
    _openEditModal()
}

function onOpenEditModal(bookId) {
    gEditingBookId = bookId
    _populateEditForm(getBook(bookId))
    _openEditModal()
}

function onSaveBook(ev) {
    ev.preventDefault()

    const elForm = document.querySelector('.book-edit-form')
    const formData = new FormData(elForm)
    const title = formData.get('title').trim()
    const price = +formData.get('price')
    const img = formData.get('img').trim() || undefined
    const rating = +document.querySelector('.book-rating-value').value

    if (!title || !price) return

    if (gEditingBookId) {
        updateBookById(gEditingBookId, { title, price, rating, img })
        successPopUp('Book updated')
    } else {
        addBook(title, price, rating, img)
        successPopUp('New book added')
    }

    _closeEditModal()
    renderPage()
}

function onAdjustEditRating(diff) {
    const elInput = document.querySelector('.book-rating-value')
    const nextRating = Math.min(Math.max(+elInput.value + diff, 1), 5)
    elInput.value = nextRating
    document.querySelector('.book-rating-preview').innerHTML = createRatingEl(nextRating)
}

function onShowDetails(id) {
    const book = getBook(id)
    if (!book) return

    gDetailsBookId = id
    _renderDetailsModal(book)

    const elModal = document.querySelector('.details-modal')
    if (!elModal.open) elModal.showModal()
    _updateQueryParams()
}

function onCloseDetails() {
    gDetailsBookId = null
    _updateQueryParams()
}

function onDetailsToEdit() {
    const bookId = gDetailsBookId
    _closeDetailsModal()
    onOpenEditModal(bookId)
}

function onCloseEditModal() {
    _closeEditModal()
}

function successPopUp(txt) {
    const elPopUp = document.querySelector('.pop-up-modal')
    elPopUp.querySelector('span').innerText = txt

    elPopUp.show()
    setTimeout(() => elPopUp.close(), 1800)
}

function createRatingEl(rating) {
    return '★★★★★'.split('').map((star, idx) => {
        const className = idx < rating ? 'active' : ''
        return `<span class="${className}">${star}</span>`
    }).join('')
}

function _populateEditForm(book) {
    const elForm = document.querySelector('.book-edit-form')
    const title = book ? book.title : ''
    const price = book ? book.price : ''
    const img = book ? book.img : ''
    const rating = book ? book.rating : 3

    elForm.querySelector('[name="title"]').value = title
    elForm.querySelector('[name="price"]').value = price
    elForm.querySelector('[name="img"]').value = img
    elForm.querySelector('.book-rating-value').value = rating
    elForm.querySelector('.book-rating-preview').innerHTML = createRatingEl(rating)
    document.querySelector('.book-edit-title').innerText = book ? 'Edit book' : 'Add book'
}

function _renderDetailsModal(book) {
    const elModal = document.querySelector('.details-modal')
    elModal.querySelector('.details-title').innerText = book.title
    elModal.querySelector('img').src = book.img
    elModal.querySelector('img').alt = book.title
    elModal.querySelector('.details-rating').innerHTML = createRatingEl(book.rating)
    elModal.querySelector('.details-price').innerText = `$${book.price}`
}

function _openEditModal() {
    const elModal = document.querySelector('.edit-modal')
    if (!elModal.open) elModal.showModal()
    _updateQueryParams()
}

function _closeEditModal() {
    gEditingBookId = null
    const elModal = document.querySelector('.edit-modal')
    if (elModal.open) elModal.close()
    _updateQueryParams()
}

function _closeDetailsModal() {
    gDetailsBookId = null
    const elModal = document.querySelector('.details-modal')
    if (elModal.open) elModal.close()
    _updateQueryParams()
}

function _getSortIndicator(field, sortBy) {
    if (sortBy.field !== field) return ''
    return sortBy.dir === 'asc' ? '+' : '-'
}

function _applyStateFromQueryParams() {
    const params = new URLSearchParams(window.location.search)
    const sortField = params.get('sortField')
    const sortDir = params.get('sortDir')

    setFilterBy({
        txt: params.get('txt') || '',
        minRating: +(params.get('minRating') || 0)
    })

    setSortBy({
        field: ['title', 'price', 'rating'].includes(sortField) ? sortField : 'title',
        dir: ['asc', 'desc'].includes(sortDir) ? sortDir : 'asc'
    })

    setPageIdx(+(params.get('pageIdx') || 0))

    const detailsId = params.get('detailsId')
    const editId = params.get('editId')

    gDetailsBookId = getBook(detailsId) ? detailsId : null
    gEditingBookId = getBook(editId) ? editId : null
}

function _restoreModalStateFromQueryParams() {
    if (gDetailsBookId) onShowDetails(gDetailsBookId)
    if (gEditingBookId) onOpenEditModal(gEditingBookId)
}

function _updateQueryParams() {
    const filterBy = getFilterBy()
    const sortBy = getSortBy()
    const pageIdx = getPageIdx()
    const params = new URLSearchParams()

    if (filterBy.txt) params.set('txt', filterBy.txt)
    if (filterBy.minRating) params.set('minRating', filterBy.minRating)
    if (sortBy.field !== 'title') params.set('sortField', sortBy.field)
    if (sortBy.dir !== 'asc') params.set('sortDir', sortBy.dir)
    if (pageIdx) params.set('pageIdx', pageIdx)
    if (gDetailsBookId) params.set('detailsId', gDetailsBookId)
    if (gEditingBookId) params.set('editId', gEditingBookId)

    const queryString = params.toString()
    const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname
    window.history.replaceState({}, '', nextUrl)
}
