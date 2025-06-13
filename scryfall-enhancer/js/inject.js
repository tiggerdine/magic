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

    callApi(location.search)
        .then(result => {
            const cardNames = result.data.map(card => card.name).join('\n');

            navigator.clipboard.writeText(cardNames);
        })
        .catch(console.error)
        .finally(() => copyButton.classList.remove('disabled'));
}

const callApi = async (search) => {
    try {
        const response = await fetch(
            'https://api.scryfall.com/cards/search' + search, {
                headers: {
                    'User-Agent': 'com.github.tiggerdine.scryfall-enhancer/0.1',
                    'Accept': '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

if (location.pathname.startsWith('/search')) {
    injectCopyButton();
}
