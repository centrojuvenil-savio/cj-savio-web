const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll("[data-nav] a");
const header = document.querySelector("[data-header]");

document.querySelectorAll(".button").forEach((button) => {
  if (button.querySelector(".button-label")) return;
  const label = button.textContent.trim();
  button.textContent = "";
  const span = document.createElement("span");
  span.className = "button-label";
  span.textContent = label;
  button.append(span);
});

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const shopGate = document.querySelector("[data-shop-gate]");
const shopFull = document.querySelector("[data-shop-full]");
const shopPasswordForm = document.querySelector("[data-shop-password]");
const shopPasswordError = document.querySelector("[data-shop-error]");
const shopAccessKey = "cj-savio-shop-unlocked-v3";

function getShopUnlocked() {
  try {
    return window.localStorage?.getItem(shopAccessKey) === "true";
  } catch {
    return false;
  }
}

function rememberShopUnlock() {
  try {
    window.localStorage?.setItem(shopAccessKey, "true");
  } catch {
    // The preview browser can block storage; the unlock still works for this visit.
  }
}

function unlockShop() {
  if (!shopGate || !shopFull) return;
  shopGate.hidden = true;
  shopFull.hidden = false;
  document.body.classList.remove("shop-locked");
  shopFull.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (shopGate && shopFull) {
  if (getShopUnlocked()) {
    unlockShop();
  }

  shopPasswordForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(shopPasswordForm);
    const password = String(formData.get("password") || "").trim();

    if (password === "silbarmola") {
      rememberShopUnlock();
      unlockShop();
      return;
    }

    if (shopPasswordError) shopPasswordError.hidden = false;
    shopPasswordForm.querySelector("input")?.select();
  });
}

const productForm = document.querySelector("[data-product-form]");
const selectionSummary = document.querySelector("[data-selection-summary]");

function updateSelectionSummary() {
  if (!productForm || !selectionSummary) return;
  const formData = new FormData(productForm);
  const size = formData.get("size");
  const color = formData.get("color");
  selectionSummary.textContent = `Sudadera Centro Juvenil · ${size} · ${color}`;
}

if (productForm) {
  productForm.querySelectorAll(".option-grid label, .color-options label").forEach((label) => {
    label.addEventListener("click", () => {
      const input = label.querySelector("input");
      if (!input) return;
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  productForm.addEventListener("input", updateSelectionSummary);
  productForm.addEventListener("change", updateSelectionSummary);
  updateSelectionSummary();
}
