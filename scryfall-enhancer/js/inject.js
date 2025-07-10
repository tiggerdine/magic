const location = window.location;

var copyButton;

const injectCopyButton = () => {
    const displayOptions = document.querySelector('.search-controls-display-options');
    const cardsFound = document.querySelector('.search-empty') == null;

    // Create copy button
    copyButton = Object.assign(
        document.createElement('a'), {
            id: 'copy-button',
            className: `button-n icon-only${cardsFound ? '' : ' disabled'}`,
            title: cardsFound ? 'Copy these cards' : 'No cards to copy',
            href: '#',
            textContent: '📋'
        }
    );

    // Call copyCards when copy button is clicked
    copyButton.addEventListener('click', copyCards);

    // Inject copy button after display options
    displayOptions.after(copyButton);
}

const copyCards = async () => {
    const lastPage = document.querySelector('p.last-page');
    let cardNames;

    if (lastPage) {
        // Read card names from page
        cardNames = [...document.querySelectorAll('span.card-grid-item-invisible-label')]
            .map(it => it.textContent);
    } else {
        copyButton.classList.add('disabled');

        try {
            // Get card names from API
            const cards = await fetchAllCards('https://api.scryfall.com/cards/search' + location.search);
            cardNames = cards.map(card => card.name);
        } catch (e) {
            console.error(e);
        } finally {
            copyButton.classList.remove('disabled');
        }
    }

    // Copy card names to clipboard
    navigator.clipboard.writeText(cardNames.join('\n'));
};

const fetchAllCards = async (url) => {
    const allCards = [];

    try {
        while (url) {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'com.github.tiggerdine.scryfall-enhancer/0.1',
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            allCards.push(...json.data);

            if (json.has_more) {
                // Continue to next page after 100 ms
                url = json.next_page;
                await sleep(100);
            } else {
                url = null;
            }
        }
    } catch (error) {
        console.error('Error fetching cards:', error.message);
    }

    return allCards;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

if (location.pathname.startsWith('/search')) {
    injectCopyButton();
}
