// import axios from "axios";
// import {
//   handleJiraError,
//   getAssigneeName,
//   parseDescription,
// } from "./jiraUtils";

// const JIRA_BASE_URL = "http://localhost:3000/api/jira";

// export const getProjectInfo = async (projectKey) => {
//   try {
//     const response = await axios.get(`${JIRA_BASE_URL}/project/${projectKey}`);
//     return {
//       id: response.data.id,
//       key: response.data.key,
//       name: response.data.name,
//       description: response.data.description || "No description",
//       issueTypes: response.data.issueTypes.map((type) => type.name),
//     };
//   } catch (error) {
//     handleJiraError(error, `Project '${projectKey}'`);
//   }
// };

// export const getStoryInfo = async (storyId) => {
//   try {
//     const response = await axios.get(`${JIRA_BASE_URL}/issue/${storyId}`);
//     const fields = response.data.fields;

//     return {
//       id: response.data.id,
//       key: response.data.key,
//       summary: fields.summary,
//       status: fields.status.name,
//       assignee: getAssigneeName(fields.assignee),
//       description: parseDescription(fields.description),
//       created: fields.created,
//       updated: fields.updated,
//     };
//   } catch (error) {
//     handleJiraError(error, `Story '${storyId}'`);
//   }
// };

// export const getAllProjects = async () => {
//   const response = await axios.get(`${JIRA_BASE_URL}/projects`);
//   return response.data;
// };

// export const getProjectStories = async (projectKey) => {
//   try {
//     const response = await axios.get(
//       `${JIRA_BASE_URL}/search?project=${projectKey}`
//     );
//     const stories = response.data.issues.map((issue) => ({
//       id: issue.id,
//       key: issue.key,
//       summary: issue.fields.summary,
//       status: issue.fields.status.name,
//       issueType: issue.fields.issuetype.name,
//       assignee: getAssigneeName(issue.fields.assignee),
//       executionTime: issue.fields.customfield_10041 || 0,
//       created: issue.fields.created,
//       updated: issue.fields.updated,
//       changelog: issue.changelog?.histories || [],
//       labels: issue.fields.labels || [],
//     }));

//     return {
//       total: response.data.total,
//       stories,
//       tests: stories.filter((s) => s.labels.includes("test")).length,
//       scripts: stories.filter((s) => s.labels.includes("script")).length,
//     };
//   } catch (error) {
//     handleJiraError(error, `stories for project '${projectKey}'`);
//   }
// };

// export const createJiraProject = async (projectData) => {
//   try {
//     const response = await axios.post(`${JIRA_BASE_URL}/project`, {
//       key: projectData.key,
//       name: projectData.name,
//       description: projectData.description || "",
//       projectTypeKey: "software",
//     });

//     return {
//       id: response.data.id,
//       key: response.data.key,
//       name: response.data.name,
//     };
//   } catch (error) {
//     console.error(
//       "Error creating project:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

// const projectCache = new Map();

// export const checkProjectKeyExists = async (projectKey) => {
//   const cacheKey = `project-exists-${projectKey}`;
//   if (projectCache.has(cacheKey)) {
//     return projectCache.get(cacheKey);
//   }

//   try {
//     await axios.get(`${JIRA_BASE_URL}/project/${projectKey}`);
//     projectCache.set(cacheKey, true);
//     return true;
//   } catch (error) {
//     if (error.response?.status === 404) {
//       projectCache.set(cacheKey, false);
//       return false;
//     }
//     handleJiraError(error, `checking project key '${projectKey}'`);
//   }
// };

import axios from "axios";
import {
  handleJiraError,
  getAssigneeName,
  parseDescription,
} from "./jiraUtils";

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
    handleJiraError(error, `Project '${projectKey}'`);
  }
};

export const getStoryInfo = async (storyId) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/issue/${storyId}`);
    const fields = response.data.fields;

    return {
      id: response.data.id,
      key: response.data.key,
      summary: fields.summary,
      status: fields.status.name,
      assignee: getAssigneeName(fields.assignee),
      description: parseDescription(fields.description),
      created: fields.created,
      updated: fields.updated,
    };
  } catch (error) {
    handleJiraError(error, `Story '${storyId}'`);
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
      assignee: getAssigneeName(issue.fields.assignee),
      executionTime: issue.fields.customfield_10041 || 0,
      created: issue.fields.created,
      updated: issue.fields.updated,
      changelog: issue.changelog?.histories || [],
      labels: issue.fields.labels || [],
    }));

    return {
      total: response.data.total,
      stories,
      tests: stories.filter((s) => s.labels.includes("test")).length,
      scripts: stories.filter((s) => s.labels.includes("script")).length,
    };
  } catch (error) {
    handleJiraError(error, `stories for project '${projectKey}'`);
  }
};

export const createJiraProject = async (projectData) => {
  try {
    const response = await axios.post(`${JIRA_BASE_URL}/project`, {
      key: projectData.key,
      name: projectData.name,
      description: projectData.description || "",
      projectTypeKey: "software",
    });

    return {
      id: response.data.id,
      key: response.data.key,
      name: response.data.name,
    };
  } catch (error) {
    console.error(
      "Error creating project:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const saveDraft = async (draftData) => {
  try {
    const response = await axios.post(
      `${JIRA_BASE_URL}/history/draft`,
      draftData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving draft:", error.response?.data || error.message);
    throw error;
  }
};

const projectCache = new Map();

export const checkProjectKeyExists = async (projectKey) => {
  const cacheKey = `project-exists-${projectKey}`;
  if (projectCache.has(cacheKey)) {
    return projectCache.get(cacheKey);
  }

  try {
    await axios.get(`${JIRA_BASE_URL}/project/${projectKey}`);
    projectCache.set(cacheKey, true);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      projectCache.set(cacheKey, false);
      return false;
    }
    handleJiraError(error, `checking project key '${projectKey}'`);
  }
};
