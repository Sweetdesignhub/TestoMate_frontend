import axios from "axios";

const JIRA_BASE_URL = "http://localhost:3000/api/jira";

export const getProjectInfo = async (projectKey) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/project/${projectKey}`);
    return {
      id: response.data.id,
      key: response.data.key,
      name: response.data.name,
      description: response.data.description || "No description",
      issueTypes: response.data.issueTypes.map((type) => type.name),
    };
  } catch (error) {
    console.error(
      "Error fetching project:",
      error.response?.data || error.message
    );
    if (error.response?.status === 404) {
      throw new Error(`Project '${projectKey}' not found in Jira.`);
    } else if (error.response?.status === 401) {
      throw new Error("Unauthorized: Invalid Jira API token or email.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "Forbidden: API token lacks permission to access the project."
      );
    }
    throw error;
  }
};

export const getStoryInfo = async (storyId) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/issue/${storyId}`);
    return {
      id: response.data.id,
      key: response.data.key,
      summary: response.data.fields.summary,
      status: response.data.fields.status.name,
      assignee: response.data.fields.assignee?.displayName || "Unassigned",
      description:
        response.data.fields.description?.content?.[0]?.content?.[0]?.text ||
        "No description",
      created: response.data.fields.created,
      updated: response.data.fields.updated,
    };
  } catch (error) {
    console.error(
      "Error fetching story:",
      error.response?.data || error.message
    );
    if (error.response?.status === 404) {
      throw new Error(`Story '${storyId}' not found in Jira.`);
    } else if (error.response?.status === 401) {
      throw new Error("Unauthorized: Invalid Jira API token or email.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "Forbidden: API token lacks permission to access the story."
      );
    }
    throw error;
  }
};

export const getAllProjects = async () => {
  const response = await axios.get(`${JIRA_BASE_URL}/projects`);
  return response.data;
};

export const getProjectStories = async (projectKey) => {
  try {
    const response = await axios.get(
      `${JIRA_BASE_URL}/search?project=${projectKey}`
    );
    const stories = response.data.issues.map((issue) => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      issueType: issue.fields.issuetype.name,
      assignee: issue.fields.assignee?.displayName || "Unassigned",
      executionTime: issue.fields.customfield_10041 || 0,
      created: issue.fields.created,
      updated: issue.fields.updated,
      changelog: issue.changelog?.histories || [],
      labels: issue.fields.labels || [], // Include labels
    }));
    return {
      total: response.data.total,
      stories,
      tests: stories.filter((s) => s.labels.includes("test")).length,
      scripts: stories.filter((s) => s.labels.includes("script")).length,
    };
  } catch (error) {
    console.error("Error fetching stories:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.status === 404) {
      throw new Error(`No stories found for project '${projectKey}'.`);
    } else if (error.response?.status === 401) {
      throw new Error("Unauthorized: Invalid Jira API token or email.");
    } else if (error.response?.status === 403) {
      throw new Error(
        "Forbidden: API token lacks permission to access stories."
      );
    }
    throw error;
  }
};
