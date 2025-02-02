// Import necessary functions
import { fetchJSON, renderProjects } from '../global.js';

// Fetch and render project data
const projects = await fetchJSON('../lib/projects.json'); // Fetch data from JSON file
const projectsContainer = document.querySelector('.projects'); // Select container
const projectsTitle = document.querySelector('.projects-title'); // Select title container

// Update the project count dynamically
projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2'); // Render projects with <h2> headings
