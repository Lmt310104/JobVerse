function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const menuButton = document.querySelector('[aria-controls="mobile-menu"]');

  if (mobileMenu && !mobileMenu.classList.contains("hidden") && menuButton) {
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  }
}

function handleSmoothScroll(event) {
  const targetId = event.currentTarget.getAttribute("href");

  if (targetId && targetId.startsWith("#")) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      closeMobileMenu();
    }
  }
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", handleSmoothScroll);
  });
}

function animateCountUp(element) {
  const target = parseInt(element.dataset.target, 10);
  if (isNaN(target) || element.dataset.counted === "true") {
    return;
  }

  const duration = 1500;
  let startTimestamp = null;
  const suffix = element.dataset.suffix || "";

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentNumber = Math.floor(progress * target);
    const formattedNumber = currentNumber.toLocaleString("en-US");

    element.textContent = formattedNumber + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      const finalFormatted = target.toLocaleString("en-US");
      element.textContent = finalFormatted + suffix;
      element.dataset.counted = "true";
    }
  };
  window.requestAnimationFrame(step);
}

function applyScrollAnimation(element) {
  const animationType = element.dataset.animation || "fade-in";
  const delay = parseFloat(element.dataset.animationDelay || 0) * 1000;

  if (element.classList.contains("fake-simulation-item")) return;

  element.style.opacity = "0";
  if (animationType === "slide-in-left") {
    element.style.transform = "translateX(-50px)";
  } else if (animationType === "slide-in-right") {
    element.style.transform = "translateX(50px)";
  } else if (animationType === "slide-in-bottom") {
    element.style.transform = "translateY(50px)";
  } else {
    element.style.transform = "translate(0, 0)";
  }
  element.style.transition = `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`;

  setTimeout(() => {
    element.style.opacity = "1";
    element.style.transform = "translate(0, 0)";
    element.dataset.hasAnimated = "true";
    triggerCountersIfNeeded(element);
  }, 50);
}

function triggerCountersIfNeeded(element) {
  const countersToAnimate = element.querySelectorAll(
    '.count-up:not([data-counted="true"])'
  );
  countersToAnimate.forEach((counter) => {
    animateCountUp(counter);
  });
}

function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    const element = entry.target;

    if (element.classList.contains("fake-simulation-item")) {
      observer.unobserve(element);
      return;
    }
    if (entry.isIntersecting) {
      if (!element.dataset.hasAnimated) {
        applyScrollAnimation(element);
      } else {
        triggerCountersIfNeeded(element);
      }
    }
  });
}

function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const animationObserver = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  animatedElements.forEach((el) => {
    if (el && !el.classList.contains("fake-simulation-item")) {
      animationObserver.observe(el);
    }
  });
}

function setupSingleTestimonialAnimation(wrapper) {
  const card = wrapper.querySelector(".testimonial-card");
  const borderTop = wrapper.querySelector(".border-top");
  const borderRight = wrapper.querySelector(".border-right");
  const borderBottom = wrapper.querySelector(".border-bottom");
  const borderLeft = wrapper.querySelector(".border-left");

  if (
    typeof gsap === "undefined" ||
    !card ||
    !borderTop ||
    !borderRight ||
    !borderBottom ||
    !borderLeft
  ) {
    return;
  }
  if (typeof gsap.to !== "function" || typeof gsap.timeline !== "function") {
    console.warn(
      "GSAP core or timeline not fully loaded for testimonial animation."
    );
    return;
  }

  try {
    const liftTween = gsap.to(wrapper, {
      y: -8,
      duration: 0.3,
      ease: "power1.out",
      paused: true,
    });
    const shadowTween = gsap.to(card, {
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      duration: 0.3,
      ease: "power1.out",
      paused: true,
    });

    const borderTimeline = gsap.timeline({
      paused: true,
      defaults: { duration: 0.15, ease: "linear" },
    });
    borderTimeline
      .to(borderTop, { width: "100.5%", height: "5px" })
      .to(borderRight, { height: "100.5%", width: "5px" }, "-=0.01")
      .to(borderBottom, { width: "100.5%", height: "5px" }, "-=0.01")
      .to(borderLeft, { height: "100.5%", width: "5px" }, "-=0.01");

    wrapper.addEventListener("mouseenter", () => {
      if (borderTimeline && liftTween && shadowTween) {
        borderTimeline.play();
        liftTween.play();
        shadowTween.play();
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      if (borderTimeline && liftTween && shadowTween) {
        borderTimeline.reverse();
        liftTween.reverse();
        shadowTween.reverse();
      }
    });
  } catch (error) {
    console.error(
      "Error setting up testimonial GSAP animation:",
      error,
      wrapper
    );
  }
}

function setupTestimonialAnimations() {
  const testimonialWrappers = document.querySelectorAll(".testimonial-wrapper");
  testimonialWrappers.forEach(setupSingleTestimonialAnimation);
}

function setupSimulationScroller() {
  const container = document.getElementById("simulation-scroll-container");
  const content = document.getElementById("simulation-scroll-content");
  const prevButton = document.getElementById("sim-scroll-prev");
  const nextButton = document.getElementById("sim-scroll-next");
  const viewAllLink = document.getElementById("view-all-sims");

  const cards = content?.querySelectorAll(
    ".simulation-card:not(.fake-simulation-item)"
  );
  const firstCard = cards?.[0];
  const fakeItem = content?.querySelector(".fake-simulation-item");

  if (
    !container ||
    !content ||
    !prevButton ||
    !nextButton ||
    !viewAllLink ||
    !firstCard ||
    !fakeItem ||
    cards.length === 0
  ) {
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
    return;
  }

  let cardWidth = 0;
  let gap = 0;
  let scrollAmount = 0;
  let maxScroll = 0;
  let finalScrollStop = 0;
  let preFinalScrollStop = 0;
  const tolerance = 5;

  function calculateDimensions() {
    if (!firstCard || cards.length === 0 || !container || !content) return;

    cardWidth = firstCard.offsetWidth;

    const contentStyle = window.getComputedStyle(content);
    gap = parseFloat(contentStyle.gap) || 24;

    if (cards.length > 1 && cards[1]) {
      const firstCardRect = firstCard.getBoundingClientRect();
      const secondCardRect = cards[1].getBoundingClientRect();
      const calculatedGap = secondCardRect.left - firstCardRect.right;

      if (calculatedGap > 0) {
        gap = calculatedGap;
      }
    }

    gap = Math.max(0, gap);
    scrollAmount = cardWidth + gap;

    maxScroll = Math.max(0, content.scrollWidth - container.clientWidth);

    finalScrollStop = maxScroll;
    preFinalScrollStop = Math.max(0, finalScrollStop - scrollAmount);

    preFinalScrollStop = Math.min(preFinalScrollStop, finalScrollStop);
  }

  function updateButtonStates() {
    setTimeout(() => {
      if (!container || !prevButton || !nextButton || !viewAllLink) return;

      const currentScroll = container.scrollLeft;

      const isAtStart = currentScroll <= tolerance;

      const isAtEnd = currentScroll >= finalScrollStop - tolerance;

      prevButton.disabled = isAtStart;
      nextButton.disabled = isAtEnd;

      if (isAtEnd) {
        viewAllLink.classList.remove("hidden");
      } else {
        viewAllLink.classList.add("hidden");
      }
    }, 50);
  }

  prevButton.addEventListener("click", () => {
    if (!container || scrollAmount <= 0) return;
    const currentScroll = container.scrollLeft;
    const isAtEnd = currentScroll >= finalScrollStop - tolerance;
    let targetScroll;

    if (isAtEnd) {
      targetScroll = preFinalScrollStop;
    } else {
      targetScroll = currentScroll - scrollAmount;
    }

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  });

  nextButton.addEventListener("click", () => {
    if (!container || scrollAmount <= 0) return;
    const currentScroll = container.scrollLeft;
    let targetScroll;

    targetScroll = currentScroll + scrollAmount;

    targetScroll = Math.min(targetScroll, finalScrollStop);

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  });

  let scrollEndTimer;
  container.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        if (document.body.contains(container)) {
          updateButtonStates();
        }
      }, 150);
    },
    { passive: true }
  );

  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (document.body.contains(container)) {
        calculateDimensions();
        updateButtonStates();
      }
    }, 250);
  };
  window.addEventListener("resize", handleResize);

  calculateDimensions();
  updateButtonStates();
}
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScrolling();
  setupScrollAnimations();
  setupTestimonialAnimations();
  setupSimulationScroller();
});
