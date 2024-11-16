// content.js
const badgeHTML = `
    <style>
        .ask-joshu-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1.5rem;
            border-radius: 9999px;
            background: linear-gradient(to right, #ec4899, #a855f7);
            color: white;
            font-weight: bold;
            font-size: 1.25rem;
            font-family: Arial, Helvetica, sans-serif;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-decoration: none;
            transition: background 0.3s ease-in-out;
        }

        .ask-joshu-badge:hover {
            background: linear-gradient(to right, #db2777, #9333ea);
        }

        .ask-joshu-badge:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.3);
        }
    </style>
    <a href="https://askjoshu.com/api-todo" class="ask-joshu-badge">
        Ask Joshu
    </a>
`;

function injectBadge() {
    const messageActions = document.querySelectorAll('div[aria-label="Message actions"]');
    if (messageActions) {
        messageActions.forEach((element) => {
            if (!element.querySelector('.ask-joshu-badge')) {
                element.insertAdjacentHTML('beforeend', badgeHTML);
            }
        });
    }
}

// Inject badge when the page is loaded
document.addEventListener('DOMContentLoaded', injectBadge);

// Observe changes in the DOM to inject badge when new elements are loaded
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            injectBadge();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
