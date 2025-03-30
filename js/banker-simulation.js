document.addEventListener("DOMContentLoaded", () => {
  const taskNavigation = document.getElementById("task-navigation");
  const taskItems = taskNavigation
    ? Array.from(taskNavigation.querySelectorAll(".task-item"))
    : [];
  const taskTitleElement = document.getElementById("task-title");
  const taskDescriptionElement = document.getElementById("task-description");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll("[data-tab-content]");

  const tasks = {
    intro: {
      title: "Introduction & Scenario",
      time: "5 min",
      isIntro: true,
      next: "1",
      content: `<h4 class="text-md font-semibold mb-2 text-muted-foreground">Welcome!</h4><p class="mb-4 text-text">In this simulation, you'll step into the role of a junior financial analyst at a reputable investment bank. Your team is evaluating a potential investment opportunity in a mid-sized tech company, 'Innovate Solutions'.</p><h4 class="text-md font-semibold mb-2 text-muted-foreground">Your Goal:</h4><p class="mb-4 text-text">Analyze the financial health and performance of Innovate Solutions to provide a recommendation on whether the bank should proceed with a significant investment.</p><h4 class="text-md font-semibold mb-2 text-muted-foreground">How it Works:</h4><p class="text-text">Work through the modules sequentially. Each module builds upon the last, guiding you through the analysis process. Click 'Start Simulation' when you're ready to begin.</p>`,
    },
    1: {
      title: "Financial Statement Analysis",
      time: "45 min",
      learn:
        "Understanding the structure and purpose of the Income Statement, Balance Sheet, and Cash Flow Statement.",
      do: "Analyze revenue streams, expenses, and profitability to assess the company's financial performance.",
      next: "2",
    },
    2: {
      title: "Financial Ratio Calculation",
      time: "60 min",
      learn:
        "Key financial metrics such as Return on Equity (ROE), Debt-to-Equity Ratio, and Current Ratio.",
      do: "Calculate and interpret these ratios to evaluate the company's efficiency, profitability, and liquidity.",
      next: "3",
    },
    3: {
      title: "Trend and Risk Identification",
      time: "40 min",
      learn: "Methods to identify financial trends and potential risks.",
      do: "Examine historical data to detect growth patterns, cost fluctuations, and financial risks.",
      next: "4",
    },
    4: {
      title: "Competitor Benchmarking",
      time: "50 min",
      learn: "Techniques for comparing the target company with industry peers.",
      do: "Assess market position and performance relative to competitors.",
      next: "5",
    },
    5: {
      title: "Financial Report Preparation",
      time: "75 min",
      learn: "How to structure and present financial findings.",
      do: "Compile your analysis and recommendations into a clear, professional financial report.",
      next: "finish",
    },
    finish: {
      title: "Finish Line",
      time: "15 min",
      isFinish: true,
      content: `<h4 class="text-md font-semibold mb-2 text-muted-foreground">Course Summary</h4><p class="mb-4 text-text">You've successfully analyzed Innovate Solutions' financials, benchmarked its performance, and prepared a recommendation report. This simulation provided hands-on practice in key banking analysis tasks.</p><h4 class="text-md font-semibold mb-2 text-muted-foreground">Next Steps:</h4><p class="mb-6 text-text">Review your report (in a real scenario!) and reflect on the skills you've practiced. Consider exploring other JobVerse simulations to broaden your experience.</p>`,
    },
  };

  let currentTaskId = "intro";

  function initializeSimulation() {
    if (!taskNavigation) return;

    taskItems.forEach((item) => {
      const taskId = item.dataset.taskId;
      const taskData = tasks[taskId];
      const detailsElement = item.querySelector(".task-details");

      if (taskData?.time) {
        const timeElement = item.querySelector(".task-time");
        if (timeElement) timeElement.textContent = taskData.time;
      }

      if (detailsElement) {
        detailsElement.addEventListener("click", (e) => {
          e.preventDefault();
          loadTask(taskId);
        });
      }
    });

    loadTask("intro");
    setupTabs();
    
  }

  function loadTask(taskId) {
    const taskData = tasks[taskId];
    if (!taskData || !taskTitleElement || !taskDescriptionElement) return;
    currentTaskId = taskId;

    taskTitleElement.textContent = taskData.title;
    if (taskData.content) taskDescriptionElement.innerHTML = taskData.content;
    else if (taskData.learn && taskData.do)
      taskDescriptionElement.innerHTML = `<h4 class="text-md font-semibold mb-2 text-muted-foreground">What You'll Learn:</h4><p class="mb-4 text-text">${taskData.learn}</p><h4 class="text-md font-semibold mb-2 text-muted-foreground">What You'll Do:</h4><p class="text-text">${taskData.do}</p>`;
    else taskDescriptionElement.innerHTML = "";

    updateSidebarUI();
  }

  function updateSidebarUI() {
    if (!taskNavigation) return;

    taskItems.forEach((item) => {
      const taskId = item.dataset.taskId;
      item.classList.remove("active");
      if (taskId === currentTaskId) {
        item.classList.add("active");
      }
    });
  }

  function setupTabs() {    
    if (!tabButtons.length || !tabContents.length) return;
    const initialActiveTab = "tasks";
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.dataset.tab;
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        tabContents.forEach((content) =>
          content.classList.toggle(
            "hidden",
            content.dataset.tabContent !== targetTab
          )
        );
        button.setAttribute("aria-selected", "true");
        tabButtons.forEach((btn) => {
          if (btn !== button) btn.setAttribute("aria-selected", "false");
        });
      });
      const isInitiallyActive = button.dataset.tab === initialActiveTab;
      button.setAttribute(
        "aria-selected",
        isInitiallyActive ? "true" : "false"
      );
      button.classList.toggle("active", isInitiallyActive);
    });
    tabContents.forEach((content) =>
      content.classList.toggle(
        "hidden",
        content.dataset.tabContent !== initialActiveTab
      )
    );
  }

  initializeSimulation();
  const startButton = document.getElementById('start-simulation-btn');
  if (startButton) {
    startButton.addEventListener('click', () => {
      window.location.href = 'chat.html';
    });
  }
});
