const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
  window.location.href = "index.html";
}

const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const searchInput = document.getElementById("searchInput");

const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];
let currentFilter = "all";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
};

const getPriorityClass = (priority) => {
  if (priority === "high") return "bg-red-100 text-red-500";
  if (priority === "medium") return "bg-yellow-100 text-yellow-600";
  if (priority === "low") return "bg-slate-100 text-slate-400";
  return "bg-slate-100 text-slate-500";
};

const getBorderClass = (status) => {
  return status === "closed"
    ? "border-t-4 border-violet-500"
    : "border-t-4 border-green-500";
};

const renderLabels = (labels) => {
  return labels
    .map((label) => {
      let classes = "border border-slate-300 text-slate-600 bg-slate-50";

      if (label === "bug") {
        classes = "border border-red-300 text-red-500 bg-red-50";
      } else if (label === "help wanted") {
        classes = "border border-yellow-300 text-yellow-600 bg-yellow-50";
      } else if (label === "enhancement") {
        classes = "border border-green-300 text-green-600 bg-green-50";
      } else if (label === "documentation") {
        classes = "border border-blue-300 text-blue-600 bg-blue-50";
      } else if (label === "good first issue") {
        classes = "border border-purple-300 text-purple-600 bg-purple-50";
      }

      return `<span class="px-3 py-1 rounded-full text-xs font-medium capitalize ${classes}">${label}</span>`;
    })
    .join("");
};

const createIssueCard = (issue) => {
  const {
    id,
    title,
    description,
    status,
    labels,
    priority,
    author,
    createdAt,
  } = issue;

  return `
    <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${getBorderClass(status)}">
      <div class="p-4">
        <div class="flex items-start justify-between gap-3 mb-4">
          <span class="w-8 h-8 rounded-full flex items-center justify-center ${
            status === "closed"
              ? "bg-violet-100 text-violet-500"
              : "bg-green-100 text-green-500"
          }">
            <i class="fa-regular fa-circle-check text-sm"></i>
          </span>

          <span class="px-4 py-1 rounded-full text-sm font-medium uppercase ${getPriorityClass(priority)}">
            ${priority}
          </span>
        </div>

        <h4 class="text-lg font-semibold text-slate-800 leading-snug mb-3">
          ${title}
        </h4>

        <p class="text-slate-500 text-sm leading-6 mb-4">
          ${description}
        </p>

        <div class="flex flex-wrap gap-2 mb-4">
          ${renderLabels(labels)}
        </div>
      </div>

      <div class="border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
        <p>#${id} by ${author}</p>
        <p class="mt-1">${formatDate(createdAt)}</p>
      </div>
    </div>
  `;
};

const renderIssues = (issues) => {
  issueCount.textContent = `${issues.length} Issues`;

  if (!issues.length) {
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center py-10 text-slate-500">
        No issues found.
      </div>
    `;
    return;
  }

  issuesContainer.innerHTML = issues.map(createIssueCard).join("");
};

const setActiveButton = (activeBtn) => {
  [allBtn, openBtn, closedBtn].forEach((btn) => {
    btn.className =
      "px-6 py-2 rounded-md border border-slate-300 text-slate-600 bg-white";
  });

  activeBtn.className =
    "px-6 py-2 rounded-md text-white bg-gradient-to-r from-violet-700 to-purple-600";
};

const getFilteredIssues = () => {
  if (currentFilter === "open") {
    return allIssues.filter((issue) => issue.status === "open");
  }

  if (currentFilter === "closed") {
    return allIssues.filter((issue) => issue.status === "closed");
  }

  return allIssues;
};

const handleSearchAndFilter = () => {
  const searchText = searchInput?.value.toLowerCase().trim() || "";

  let filteredIssues = getFilteredIssues();

  if (searchText) {
    filteredIssues = filteredIssues.filter((issue) => {
      const titleMatch = issue.title.toLowerCase().includes(searchText);
      const descriptionMatch = issue.description
        .toLowerCase()
        .includes(searchText);
      return titleMatch || descriptionMatch;
    });
  }

  renderIssues(filteredIssues);
};

searchInput?.addEventListener("input", handleSearchAndFilter);

const loadIssues = async () => {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    allIssues = result.data;
    handleSearchAndFilter();
  } catch (error) {
    console.error("Fetch error:", error);
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center py-10 text-red-500">
        Failed to load issues.
      </div>
    `;
  }
};

allBtn?.addEventListener("click", () => {
  currentFilter = "all";
  setActiveButton(allBtn);
  handleSearchAndFilter();
});

openBtn?.addEventListener("click", () => {
  currentFilter = "open";
  setActiveButton(openBtn);
  handleSearchAndFilter();
});

closedBtn?.addEventListener("click", () => {
  currentFilter = "closed";
  setActiveButton(closedBtn);
  handleSearchAndFilter();
});

loadIssues();
