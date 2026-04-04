function createRatingEl(bookObj) {
    let strHtml = ''
    for (let i = 1; i < 6; i++) {
        const className = (i<= bookObj.rating)? 'active' : ''
        strHtml += `<span 
                        class="${className}" 
                        data-value="${i}" 
                        onclick="onStarClick(this, '${bookObj.id}')"
                    >★</span>`
    }
    return strHtml
}