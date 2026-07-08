const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCategory = document.querySelector(".lightbox-category");
const lightboxCounter = document.querySelector(".lightbox-counter");
const closeBtn = document.querySelector(".lightbox-close");
const prevBtn = document.querySelector(".lightbox-prev");
const nextBtn = document.querySelector(".lightbox-next");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentIndex = 0;
let visibleItems = [];

function getVisibleItems() {
    return [...galleryItems].filter((item) => !item.classList.contains("hidden"));
}

function showImage(index) {
    const items = getVisibleItems();
    if (!items.length) return;

    currentIndex = ((index % items.length) + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector("img");

    lightboxImage.classList.remove("loaded");
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCategory.textContent = item.dataset.category;
    lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;

    lightboxImage.onload = () => lightboxImage.classList.add("loaded");
    if (lightboxImage.complete) lightboxImage.classList.add("loaded");
}

function openLightbox(item) {
    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    if (currentIndex === -1) return;

    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("open"));
    document.body.classList.add("lightbox-open");
    showImage(currentIndex);
}

function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");

    setTimeout(() => {
        lightbox.hidden = true;
        lightboxImage.src = "";
    }, 350);
}

function navigate(direction) {
    showImage(currentIndex + direction);
}

galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
    item.setAttribute("tabindex", "0");
    item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(item);
        }
    });
});

closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", () => navigate(-1));
nextBtn.addEventListener("click", () => navigate(1));

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "ArrowLeft") navigate(-1);
});

// Touch swipe support
let touchStartX = 0;

lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) < 50) return;
    navigate(diff < 0 ? 1 : -1);
}, { passive: true });

// Category filters
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        galleryItems.forEach((item) => {
            const match = filter === "all" || item.classList.contains(filter);
            item.classList.toggle("hidden", !match);
        });
    });
});
