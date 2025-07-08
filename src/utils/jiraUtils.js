// jiraUtils.js

export const handleJiraError = (error, context = "resource") => {
  const status = error.response?.status;

  if (status === 404) {
    throw new Error(`${context} not found in Jira.`);
  } else if (status === 401) {
    throw new Error("Unauthorized: Invalid Jira API token or email.");
  } else if (status === 403) {
    throw new Error(
      `Forbidden: API token lacks permission to access ${context}.`
    );
  }

  console.error("Unexpected error:", error.message || error);
  throw error;
};

export const getAssigneeName = (assignee) => {
  return assignee?.displayName || "Unassigned";
};

export const parseDescription = (description) => {
  return description?.content?.[0]?.content?.[0]?.text || "No description";
};
