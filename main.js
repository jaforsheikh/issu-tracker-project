const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
  window.location.href = "index.html";
}
// Elements
const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const searchInput = document.getElementById("searchInput");
const loadingSpinner = document.getElementById("loadingSpinner");
// Modal elements
const issueModal = document.getElementById("issueModal");
const modalContent = document.getElementById("modalContent");

const showLoading = () => {
  loadingSpinner.classList.remove("hidden");
  issuesContainer.innerHTML = "";
};

const hideLoading = () => {
  loadingSpinner.classList.add("hidden");
};
// API
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let allIssues = [];
let currentFilter = "all";
// Normalize status
const normalizeStatus = (status) => status?.toLowerCase().trim() || "";
// Date format
const formatDate = (dateString) => {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
};
// Priority style for cards
const getPriorityClass = (priority) => {
  const priorityCheck = priority?.toLowerCase().trim();
  if (priorityCheck === "high") return "bg-red-100 text-red-500";
  if (priorityCheck === "medium") return "bg-yellow-100 text-yellow-600";
  if (priorityCheck === "low") return "bg-slate-100 text-slate-400";

  return "bg-slate-100 text-slate-500";
};
// Priority style for modal
const getPriorityBadgeClass = (priority) => {
  const priorityStyle = priority?.toLowerCase().trim();
  if (priorityStyle === "high") return "bg-red-500 text-white";
  if (priorityStyle === "medium") return "bg-yellow-400 text-slate-800";
  if (priorityStyle === "low") return "bg-slate-200 text-slate-500";
  return "bg-slate-200 text-slate-600";
};
// Modal status class
const getModalStatusClass = (status) => {
  const statusClass = normalizeStatus(status);
  if (statusClass === "closed") {
    return "bg-violet-500 text-white";
  }
  return "bg-green-500 text-white";
};
// Card status style
const getStatusStyles = (status) => {
  const getStyle = normalizeStatus(status);

  if (getStyle === "closed") {
    return {
      border: "border-t-4 border-violet-500",
      icon: "bg-violet-100 text-violet-500",
    };
  }
  if (getStyle === "open") {
    return {
      border: "!border-t-4 !border-green-500",
      icon: "bg-green-100 text-green-500",
    };
  }
  return {
    border: "border-t-4 border-slate-300",
    icon: "bg-slate-100 text-slate-500",
  };
};
// Labels render
const renderLabels = (labels = []) => {
  return labels
    .map((label) => {
      const lowerLabel = label?.toLowerCase().trim();
      let classes = "border border-slate-300 text-slate-600 bg-slate-50";
      if (lowerLabel === "bug") {
        classes = "border border-red-300 text-red-500 bg-red-50";
      } else if (lowerLabel === "help wanted") {
        classes = "border border-yellow-300 text-yellow-600 bg-yellow-50";
      } else if (lowerLabel === "enhancement") {
        classes = "border border-green-300 text-green-600 bg-green-50";
      } else if (lowerLabel === "documentation") {
        classes = "border border-blue-300 text-blue-600 bg-blue-50";
      } else if (lowerLabel === "good first issue") {
        classes = "border border-purple-300 text-purple-600 bg-purple-50";
      }
      return `
        <span class="px-3 py-1 rounded-full text-xs font-medium capitalize ${classes}">
          ${label}
        </span>
      `;
    })
    .join("");
};
// Modal content part
const createModalContent = (issue) => {
  const {
    title = "Untitled Issue",
    description = "No description available",
    status = "open",
    labels = [],
    priority = "low",
    author = "unknown",
    createdAt,
    assignee = author || "Unknown Assignee",
  } = issue;
  const normalizedStatus = normalizeStatus(status);
  const statusText = normalizedStatus === "closed" ? "Closed" : "Opened";
  return `
    <div class="p-8 sm:p-10">
      <h3 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
        ${title}
      </h3>
      <div class="flex flex-wrap items-center gap-3 text-sm mb-6">
        <span class="px-4 py-1 rounded-full font-medium ${getModalStatusClass(status)}">
          ${statusText}
        </span>
        <span class="text-slate-400">•</span>
        <span class="text-slate-500">Opened by</span>
        <span class="text-slate-600 font-medium">${author}</span>
        <span class="text-slate-400">•</span>
        <span class="text-slate-500">${formatDate(createdAt)}</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-6">
        ${renderLabels(labels)}
      </div>
      <p class="text-slate-500 text-lg leading-8 mb-8">
        ${description}
      </p>
      <div class="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <p class="text-slate-500 text-lg mb-2">Assignee:</p>
          <h4 class="text-2xl font-bold text-slate-800">
            ${assignee}
          </h4>
        </div>
        <div>
          <p class="text-slate-500 text-lg mb-2">Priority:</p>
          <span class="px-4 py-2 rounded-full text-sm font-bold uppercase ${getPriorityBadgeClass(priority)}">
            ${priority}
          </span>
        </div>
      </div>
      <div class="flex justify-end">
        <form method="dialog">
          <button class="btn text-white border-none bg-gradient-to-r from-violet-700 to-purple-600 px-8 rounded-xl">
            Close
          </button>
        </form>
      </div>
    </div>
  `;
};

// Open modal issue
const openIssueModal = (issue) => {
  modalContent.innerHTML = createModalContent(issue);
  issueModal.showModal();
};
// Global click handler for priority
window.handlePriorityClick = (id) => {
  const selectedIssue = allIssues.find((issue) => issue.id === id);
  if (selectedIssue) {
    openIssueModal(selectedIssue);
  }
};
// Card create
const createIssueCard = (issue) => {
  const {
    id = "N/A",
    title = "Untitled Issue",
    description = "No description available",
    status = "open",
    labels = [],
    priority = "low",
    author = "unknown",
    createdAt,
  } = issue;
  const statusStyles = getStatusStyles(status);
  return `
    <div class="bg-white rounded-lg border-t-4 border-slate-200 shadow-sm overflow-hidden ${statusStyles.border}">
      <div class="p-4">
        <div class="flex items-start justify-between gap-3 mb-4">
          <span class="w-8 h-8 rounded-full flex items-center justify-center ${statusStyles.icon}">
            <i class="fa-regular fa-circle-check text-sm"></i>
          </span>
          <span
            onclick="handlePriorityClick(${id})"
            class="px-4 py-1 rounded-full text-sm font-medium uppercase cursor-pointer ${getPriorityClass(priority)}"
          >
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
// Render issues
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
// Active button all
const setActiveButton = (activeBtn) => {
  [allBtn, openBtn, closedBtn].forEach((btn) => {
    if (!btn) return;
    btn.className =
      "px-6 py-2 rounded-lg border border-slate-300 text-slate-600 bg-white font-medium";
  });
  if (activeBtn) {
    activeBtn.className =
      "px-6 py-2 rounded-lg text-white bg-gradient-to-r from-violet-700 to-purple-600 font-medium";
  }
};
// Filter issues
const getFilteredIssues = () => {
  if (currentFilter === "open") {
    return allIssues.filter(
      (issue) => normalizeStatus(issue.status) === "open",
    );
  }
  if (currentFilter === "closed") {
    return allIssues.filter(
      (issue) => normalizeStatus(issue.status) === "closed",
    );
  }
  return allIssues;
};
// Search + filter
const handleSearchAndFilter = () => {
  const searchText = searchInput?.value.toLowerCase().trim() || "";
  let filteredIssues = getFilteredIssues();
  if (searchText) {
    filteredIssues = filteredIssues.filter((issue) => {
      const titleMatch = issue.title?.toLowerCase().includes(searchText);
      const descriptionMatch = issue.description
        ?.toLowerCase()
        .includes(searchText);
      const authorMatch = issue.author?.toLowerCase().includes(searchText);
      const labelMatch = issue.labels?.some((label) =>
        label.toLowerCase().includes(searchText),
      );
      return titleMatch || descriptionMatch || authorMatch || labelMatch;
    });
  }
  renderIssues(filteredIssues);
};
// Search input
searchInput?.addEventListener("input", handleSearchAndFilter);
// Load issues
const loadIssues = async () => {
  try {
    showLoading(); // spinner show
    const response = await fetch(API_URL);
    const result = await response.json();
    allIssues = Array.isArray(result.data) ? result.data : [];
    setActiveButton(allBtn);
    handleSearchAndFilter();
  } catch (error) {
    console.error("Fetch error:", error);
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center py-10 text-red-500">
        Failed to load issues.
      </div>
    `;
  } finally {
    hideLoading(); // spinner hide
  }
};
// Buttons
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
// Initial load
loadIssues();
