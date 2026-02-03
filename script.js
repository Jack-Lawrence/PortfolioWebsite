
// Mobile menu overlay logic
const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const mobileMenu = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');

function openMobileMenu() {
  mobileMenu.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    openMobileMenu();
  } else {
    navLinks.classList.toggle('active');
  }
});

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when a link is clicked
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Optional: Close menu on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const panelsContainer = document.getElementById('carousel-panels');
  const panels = Array.from(document.querySelectorAll('.portfolio-panel'));
  const leftBtn = document.getElementById('carousel-left');
  const rightBtn = document.getElementById('carousel-right');
  const panelWidth = 300 + 32; // 300px panel + 2rem (32px) gap
  let position = 0;
  let maxPosition = panels.length - 5; // 5 visible panels

  function slideTo(pos) {
    panelsContainer.style.transition = 'transform 0.5s cubic-bezier(.6,1.5,.6,1)';
    panelsContainer.style.transform = `translateX(${-pos * panelWidth}px)`;
  }

  rightBtn.addEventListener('click', () => {
    if (position < maxPosition) {
      position++;
      slideTo(position);
    }
  });

  leftBtn.addEventListener('click', () => {
    if (position > 0) {
      position--;
      slideTo(position);
    }
  });

  function resetCarouselOnMobile() {
    const panelsContainer = document.getElementById('carousel-panels');
    if (window.innerWidth <= 1024) {
      panelsContainer.style.transform = 'none';
      position = 0;
    }
  }

  // Listen for resize and call on load
  window.addEventListener('resize', resetCarouselOnMobile);
  window.addEventListener('DOMContentLoaded', resetCarouselOnMobile);
});

document.addEventListener('DOMContentLoaded', function () {
  // ...carousel code...

  const panels = Array.from(document.querySelectorAll('.portfolio-panel'));
  const carouselContainer = document.querySelector('.carousel-container');
  const gamePage = document.getElementById('game-page');
  const portfolioTitle = document.getElementById('portfolio-title');
  const portfolioDesc = document.getElementById('portfolio-desc');
  let lastOpenedPanel = null;

  // Create a reusable image focus overlay (lightbox) and attach to body.
  // The overlay now contains a bottom container (like a framed strip) that
  // holds thumbnails and the close button so the image itself stays contained
  // and doesn't grow to fill the whole viewport.
  const imageOverlay = document.createElement('div');
  imageOverlay.className = 'image-focus-overlay';
  imageOverlay.innerHTML = `
    <div class="image-focus-inner">
      <button class="image-focus-close" aria-label="Close image">&times;</button>
      <img class="image-focus-img" alt="Expanded image">
      <div class="image-focus-bottom">
        <div class="image-focus-thumb-row" aria-hidden="false"></div>
      </div>
    </div>
  `;
  document.body.appendChild(imageOverlay);
  const overlayImg = imageOverlay.querySelector('.image-focus-img');
  const overlayClose = imageOverlay.querySelector('.image-focus-close');

  // Calculate and set the bottom container width to match the thumbnails' total width
  function updateBottomWidth() {
    const overlayBottom = imageOverlay.querySelector('.image-focus-bottom');
    const overlayThumbRow = imageOverlay.querySelector('.image-focus-thumb-row');
    if (!overlayBottom || !overlayThumbRow) return;

    const thumbs = Array.from(overlayThumbRow.children).filter(n => n.offsetWidth);
    if (thumbs.length === 0) {
      overlayBottom.style.width = '';
      return;
    }

    const thumbStyle = getComputedStyle(overlayThumbRow);
    // gap may be returned as '8px' etc. Try columnGap then gap
    const gapPx = parseFloat(thumbStyle.columnGap || thumbStyle.gap) || 8;

    // Sum widths of thumbnails
    const thumbsWidth = thumbs.reduce((sum, t) => sum + t.offsetWidth, 0);

    const bottomStyle = getComputedStyle(overlayBottom);
    const paddingLeft = parseFloat(bottomStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(bottomStyle.paddingRight) || 0;

    // Total desired width = thumbs + gaps between thumbs + horizontal padding
    const gapsTotal = gapPx * Math.max(0, thumbs.length - 1);
    const desired = thumbsWidth + gapsTotal + paddingLeft + paddingRight;

    // Constrain so it never exceeds viewport width (leave little margin)
    const constrained = Math.min(desired + 8, Math.round(window.innerWidth * 0.94));
    overlayBottom.style.width = constrained + 'px';
  }

  // Recompute on resize while the overlay is open
  window.addEventListener('resize', () => {
    if (imageOverlay.classList.contains('visible')) updateBottomWidth();
  });

  // Close overlay when clicking backdrop or close button
  imageOverlay.addEventListener('click', (e) => {
    if (e.target === imageOverlay || e.target === overlayClose) {
      imageOverlay.classList.remove('visible');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      imageOverlay.classList.remove('visible');
    }
  });

  panels.forEach(panel => {
    panel.addEventListener('click', function () {
      // remember which panel was opened so we can return to it on close (mobile)
      lastOpenedPanel = panel;
      // On mobile (or narrow viewports) ensure the portfolio section is scrolled
      // into view before opening the panel details. This prevents the page from
      // jumping to a different position when the panel expands vertically.
      const portfolioSection = document.getElementById('portfolio');

      const openPanel = () => {
        const img = panel.querySelector('img').cloneNode(true);
        const gameTitle = panel.getAttribute('data-game-title') || '';
        const gameDesc = panel.getAttribute('data-game-desc') || '';
        const thumbnails = (panel.getAttribute('data-thumbnails') || '').split(',').map(s => s.trim()).filter(Boolean);

        gamePage.innerHTML = `
          <div class="game-page-inner">
            <div class="game-page-image">
              <div class="main-image-container"></div>
              <div class="thumbnail-row"></div>
            </div>
            <div class="game-page-content">
              <div class="game-page-header-row">
                <h3>${gameTitle}</h3>
                <button class="game-page-close" id="game-page-close" aria-label="Close">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <p>${gameDesc}</p>
            </div>
          </div>
        `;

        // Main image
        img.classList.add('main-image');
        gamePage.querySelector('.main-image-container').appendChild(img);

        // Clicking the main image container opens the focus/lightbox overlay
        const mainImageContainer = gamePage.querySelector('.main-image-container');
        if (mainImageContainer) {
          mainImageContainer.style.cursor = 'zoom-in';
          mainImageContainer.addEventListener('click', () => {
            overlayImg.src = img.src;
            // populate overlay thumbnails to match the current panel
            const overlayThumbRow = imageOverlay.querySelector('.image-focus-thumb-row');
            if (overlayThumbRow) {
              overlayThumbRow.innerHTML = '';
              thumbnails.forEach(src => {
                const oThumb = document.createElement('img');
                oThumb.src = src;
                oThumb.className = 'image-focus-thumb';
                if (src === img.src) oThumb.classList.add('active');
                overlayThumbRow.appendChild(oThumb);

                // When a thumb is clicked, swap the overlay image and the game page main image
                oThumb.addEventListener('click', () => {
                  overlayImg.src = src;
                  img.src = src; // also swap the main image in the game page
                  // update active state
                  overlayThumbRow.querySelectorAll('.image-focus-thumb').forEach(t => t.classList.remove('active'));
                  oThumb.classList.add('active');
                });

                // Ensure measurements update after the thumbnail loads
                oThumb.addEventListener('load', () => {
                  // small timeout so layout settles
                  setTimeout(updateBottomWidth, 30);
                });
              });

              // call once after insertion to set the bottom width (if images cached may be immediate)
              setTimeout(updateBottomWidth, 40);
            }
            imageOverlay.classList.add('visible');
          });
        }

        // Thumbnails
        const thumbRow = gamePage.querySelector('.thumbnail-row');
        thumbnails.forEach(src => {
          const thumb = document.createElement('img');
          thumb.src = src;
          thumb.className = 'game-thumb';
          thumb.alt = 'Screenshot thumbnail';
          thumbRow.appendChild(thumb);

          // Click to swap main image
          thumb.addEventListener('click', () => {
            img.src = src;
            // if the overlay is visible, keep it in sync (update overlay main image and active thumb)
            const overlayThumbRow = imageOverlay.querySelector('.image-focus-thumb-row');
            if (imageOverlay.classList.contains('visible')) {
              overlayImg.src = src;
              if (overlayThumbRow) {
                overlayThumbRow.querySelectorAll('.image-focus-thumb').forEach(t => t.classList.toggle('active', t.src === src));
              }
            }
          });
        });

        // Show/hide logic
        carouselContainer.style.display = 'none';
        gamePage.style.display = 'flex';
        if (portfolioTitle) portfolioTitle.style.display = 'none';
        if (portfolioDesc) portfolioDesc.style.display = 'none';

        document.getElementById('game-page-close').onclick = function () {
          gamePage.style.display = 'none';
          carouselContainer.style.display = '';
          if (portfolioTitle) portfolioTitle.style.display = '';
          if (portfolioDesc) portfolioDesc.style.display = '';

          // On mobile / narrow viewports, scroll back to the panel the user opened
          // so they return to the same place in the list.
          if (lastOpenedPanel && window.innerWidth <= 1024) {
            // Use smooth scroll to center the panel in the viewport where possible
            try {
              lastOpenedPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (e) {
              // fallback: instant scroll
              lastOpenedPanel.scrollIntoView();
            }
          }
        };
      };

      // If on a narrow viewport (mobile/tablet), scroll the portfolio section into view
      // first and wait a short moment for the smooth scroll to complete before opening.
      if (portfolioSection && window.innerWidth <= 1024) {
        portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Delay to allow scroll animation to progress; small enough to feel snappy.
        setTimeout(openPanel, 300);
      } else {
        openPanel();
      }
    });
  });
});