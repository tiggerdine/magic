const location = window.location;

var copyButton;

const injectCopyButton = () => {
    const displayOptions = document.querySelector('.search-controls-display-options');
    const cardsFound = document.querySelector('.search-empty') == null;

    copyButton = Object.assign(
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
    copyButton.classList.add('disabled');

    fetchAllCards('https://api.scryfall.com/cards/search' + location.search)
        .then(cards => {
            const cardNames = cards.map(card => card.name).join('\n');
            navigator.clipboard.writeText(cardNames);
        })
        .catch(console.error)
        .finally(() => copyButton.classList.remove('disabled'));
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
