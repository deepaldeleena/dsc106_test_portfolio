// importing required functions
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';
// Fetch and filter projects 
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
// Selecting the projects container 
const projectsContainer = document.querySelector('.projects');
// Rendering the latest projects 
renderProjects(latestProjects, projectsContainer, 'h2');
// Retrieving GitHub data for specified user 
const githubData = await fetchGitHubData('deepaldeleena');
// Selecting the container element where the GitHub profile stats will be displayed 
const profileStats = document.querySelector('#profile-stats');
// Updating container's content
// if (profileStats) {
//     profileStats.innerHTML = `
//           <dl>
//             <dt>Followers:</dt><dd>${githubData.followers}</dd>
//             <dt>Following:</dt><dd>${githubData.following}</dd>
//             <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
//             <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
//           </dl>
//       `;
//   }
if (profileStats) {
    profileStats.innerHTML = `
      <h2>My GitHub Stats</h2>
      <dl class="stats-grid">
        <dt>Followers</dt>
        <dd>${githubData.followers}</dd>
        <dt>Following</dt>
        <dd>${githubData.following}</dd>
        <dt>Public Repos</dt>
        <dd>${githubData.public_repos}</dd>
        <dt>Public Gists</dt>
        <dd>${githubData.public_gists}</dd>
      </dl>
    `;
  }
  