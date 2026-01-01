async function loadComponent(targetId, path) {
  try {
    const html = await (await fetch(path)).text();
    const el = document.getElementById(targetId);
    if (el) el.innerHTML = html;
  } catch (e) {
    console.error("Failed to load component:", path, e);
  }
}

function setActiveNav() {
  const links = document.querySelectorAll("[data-nav]");
  const here = location.pathname.replace(/\\/g, "/");
  links.forEach((a) => {
    const match = here.endsWith("/") ? a.getAttribute("href")?.endsWith("/index.html") : a.getAttribute("href") === here;
    a.classList.toggle("text-brand-600", match);
    a.classList.toggle("font-semibold", match);
  });
}

function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : prefersDark;
  root.classList.toggle("dark", isDark);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.onclick = () => {
      const next = root.classList.toggle("dark") ? "dark" : "light";
      localStorage.setItem("theme", next);
    };
  }
}

async function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  try {
    const data = await (await fetch("../src/data/projects.json")).json().catch(async () => {
      return (await (await fetch("./src/data/projects.json")).json());
    });
    grid.innerHTML = data
      .map(
        (p) => `
      <article class="card">
        <img src="${p.image}" alt="${p.title}" class="h-40 w-full object-cover rounded-t-lg" />
        <div class="card-body">
          <h3 class="font-semibold">${p.title}</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">${p.description}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            ${p.tags.map((t) => `<span class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">${t}</span>`).join("")}
          </div>
          <a class="btn mt-4" href="${p.url}" target="_blank" rel="noopener">View</a>
        </div>
      </article>`
      )
      .join("");
  } catch (e) {
    console.error("Failed to load projects.json", e);
  }
}

function initCtaLinksGlobal() {
  const links = document.querySelectorAll('.cta-link');
  links.forEach(el => {
    let raf;
    const reset = () => {
      el.style.transform = '';
      el.style.removeProperty('--x');
      el.style.removeProperty('--y');
    };
    el.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--x', x + 'px');
        el.style.setProperty('--y', y + 'px');
        const dx = (x / rect.width - 0.5) * 10;
        const dy = (y / rect.height - 0.5) * 10;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    });
    el.addEventListener('mouseleave', reset);
    el.addEventListener('blur', reset);
  });
}

function setupImageFallbacksGlobal() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const fallbacks = img.dataset.fallback.split(',').map(s => s.trim()).filter(Boolean);
    let i = 0;
    img.addEventListener('error', () => {
      if (i < fallbacks.length) {
        img.src = fallbacks[i++];
      }
    });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-scroll-animate]').forEach(el => {
    observer.observe(el);
  });
}

(async function bootstrap() {
  // Determine the correct path prefix based on current location
  const isInPages = location.pathname.includes('/pages/');
  const prefix = isInPages ? '../' : './';
  
  await loadComponent("site-header", prefix + "src/components/header.html");
  await loadComponent("site-footer", prefix + "src/components/footer.html");
  setActiveNav();
  initTheme();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  renderProjects();
  initCtaLinksGlobal();
  setupImageFallbacksGlobal();
  initScrollAnimations();
})();
