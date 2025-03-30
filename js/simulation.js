document.addEventListener("DOMContentLoaded", () => {
  const taskLinks = document.querySelectorAll("#task-navigation .task-link");
  const taskTitleElement = document.getElementById("task-title");
  const taskDescriptionElement = document.getElementById("task-description");

  const tasks = {
    1: {
      title: "Task 1: Financial Statement Analysis",
      learn:
        "Understanding the structure and purpose of the Income Statement, Balance Sheet, and Cash Flow Statement.",
      do: "Analyze revenue streams, expenses, and profitability to assess the company's financial performance.",
    },
    2: {
      title: "Task 2: Financial Ratio Calculation",
      learn:
        "Key financial metrics such as Return on Equity (ROE), Debt-to-Equity Ratio, and Current Ratio.",
      do: "Calculate and interpret these ratios to evaluate the company's efficiency, profitability, and liquidity.",
    },
    3: {
      title: "Task 3: Trend and Risk Identification",
      learn: "Methods to identify financial trends and potential risks.",
      do: "Examine historical data to detect growth patterns, cost fluctuations, and financial risks.",
    },
    4: {
      title: "Task 4: Competitor and Industry Benchmarking",
      learn: "Techniques for comparing the target company with industry peers.",
      do: "Assess market position and performance relative to competitors.",
    },
    5: {
      title: "Task 5: Financial Report Preparation",
      learn: "How to structure and present financial findings.",
      do: "Compile analysis and recommendations into a clear, professional financial report.",
    },
  };

  function updateTaskContent(taskId) {
    const task = tasks[taskId];
    if (!task || !taskTitleElement || !taskDescriptionElement) {
      taskTitleElement.textContent = "Task Not Found";
      taskDescriptionElement.innerHTML =
        "<p class='text-red-600'>Could not load details for this task.</p>";
      return;
    }

    taskTitleElement.textContent = task.title;
    taskDescriptionElement.innerHTML = `
            <h4 class="text-md font-semibold mb-2 text-muted-foreground">What You'll Learn:</h4>
            <p class="mb-4 text-text">${task.learn}</p>
            <h4 class="text-md font-semibold mb-2 text-muted-foreground">What You'll Do:</h4>
            <p class="text-text">${task.do}</p>
        `;

    taskLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.task === taskId) {
        link.classList.add("active");
      }
    });

    document.getElementById("simulation-content")?.scrollTo(0, 0);
  }

  taskLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const taskId = link.dataset.task;
      updateTaskContent(taskId);

      if (history.pushState) {
        history.pushState(null, null, `#task-${taskId}`);
      } else {
        location.hash = `#task-${taskId}`;
      }
    });
  });

  function loadTaskFromHash() {
    const hash = window.location.hash;
    const match = hash.match(/#task-(\d+)/);
    if (match && match[1]) {
      const taskId = match[1];
      if (tasks[taskId]) {
        updateTaskContent(taskId);

        document
          .querySelector(`.task-link[data-task="${taskId}"]`)
          ?.classList.add("active");
      } else {
        updateTaskContent("1");
      }
    } else {
      updateTaskContent("1");
    }
  }

  window.addEventListener("popstate", loadTaskFromHash);

  loadTaskFromHash();
});
