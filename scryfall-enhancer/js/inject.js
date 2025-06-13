const path = window.location.pathname;

const injectCopyButton = () => {
    const displayOptions = document.querySelector('.search-controls-display-options');
    const cardsFound = document.querySelector('.search-empty') == null;

    const copyButton = Object.assign(
        document.createElement('a'), {
            id: 'copy-button',
            className: `button-n icon-only${cardsFound ? '' : ' disabled'}`,
            title: cardsFound ? 'Copy these cards' : 'No cards to copy',
            href: '#',
            textContent: '📋'
        }
    );

    copyButton.addEventListener('click', copyCards);

    displayOptions.after(copyButton);
}

const copyCards = () => {
    const cardGrid = document.querySelector('.card-grid-inner');
    const cards = Array.from(cardGrid.querySelectorAll(
        `.card-grid-item:not(.flexbox-spacer)
         .card-grid-item-card
         .card-grid-item-invisible-label`
    )).map(span => span.textContent);

    navigator.clipboard.writeText(cards.join('\n'));
}

if (path.startsWith('/search')) {
    injectCopyButton();
}
