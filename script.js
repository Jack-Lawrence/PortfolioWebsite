const toggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
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

  panels.forEach(panel => {
    panel.addEventListener('click', function () {
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
        });
      });

      // ...rest of your show/hide logic...
      carouselContainer.style.display = 'none';
      gamePage.style.display = 'flex';
      if (portfolioTitle) portfolioTitle.style.display = 'none';
      if (portfolioDesc) portfolioDesc.style.display = 'none';

      document.getElementById('game-page-close').onclick = function () {
        gamePage.style.display = 'none';
        carouselContainer.style.display = '';
        if (portfolioTitle) portfolioTitle.style.display = '';
        if (portfolioDesc) portfolioDesc.style.display = '';
      };
    });
  });
});