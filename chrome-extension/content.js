function injectBadge() {
  const messageActions = document.querySelectorAll(
    'div[aria-label="Message actions"]'
  );
  const messageBodyElement = document.querySelector(
    'div[aria-label="Message body"]'
  );
  const messageBodyText = messageBodyElement
    ? encodeURIComponent(messageBodyElement.textContent.trim())
    : "";

  if (messageActions) {
    messageActions.forEach((element) => {
      if (!element.querySelector(".ask-joshu-badge")) {
        // Update badge HTML with extracted text as parameter
        const badgeHTML = `
                    <div class="ms-OverflowSet-item item-175" role="none">
                        <div class="s82IJ body-157">
                            <a href="https://www.askjoshu.com/ask?q=lEjRfi2U4o" class="ask-joshu-badge" target="_blank">
                                Ask Joshu
                            </a>
                        </div>
                    </div>
                `;

        element.insertAdjacentHTML("afterbegin", badgeHTML);
      }
    });
  }
}

// Inject badge when the page is loaded
document.addEventListener("DOMContentLoaded", injectBadge);

// Observe changes in the DOM to inject badge when new elements are loaded
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      injectBadge();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Add CSS styling through JavaScript
const style = document.createElement("style");
style.textContent = `
    .ask-joshu-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 1.4rem;
        border-radius: 9999px;
        background: linear-gradient(90deg, #ec4899, #a855f7, #ec4899);
        background-size: 200% 100%;
        color: white;
        font-weight: bold;
        font-size: 1.0rem;
        font-family: Arial, Helvetica, sans-serif;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        animation: gradient 2.0s ease infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .ask-joshu-badge:hover {
        background: linear-gradient(90deg, #db2777, #9333ea, #db2777);
        background-size: 200% 100%;
    }

    .ask-joshu-badge:focus {
        outline: none;
        box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.3);
    }
`;
document.head.appendChild(style);
