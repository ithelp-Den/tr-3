// Анімація лічильників у блоці "Meet your coach": від 0 до кінцевого значення при доскролі
document.addEventListener("DOMContentLoaded", () => {
  const statsBanner = document.querySelector(".coach-stats");
  if (!statsBanner) return;

  const format = (value, decimals, sep) => {
    let str = value.toFixed(decimals);
    if (sep) str = str.replace(/\B(?=(\d{3})+(?!\d))/g, sep); // роздільник тисяч (60.000)
    return str;
  };

  const animateNumber = (element) => {
    const target = parseFloat(element.dataset.count);
    if (isNaN(target)) return;
    const decimals = parseInt(element.dataset.decimals || "0", 10);
    const sep = element.dataset.sep || "";
    const finalText = element.textContent.trim();

    const duration = 2000; // 2 секунди
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress * (2 - progress); // easeOutQuad
      const current = ease * target;
      const factor = Math.pow(10, decimals);
      element.textContent = format(Math.floor(current * factor) / factor, decimals, sep);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = finalText; // в кінці — точний текст з макету
      }
    };

    element.textContent = format(0, decimals, sep);
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach(animateNumber);
      obs.unobserve(entry.target); // лише один раз за візит
    });
  }, { root: null, rootMargin: "0px", threshold: 0.1 });

  observer.observe(statsBanner);
});
