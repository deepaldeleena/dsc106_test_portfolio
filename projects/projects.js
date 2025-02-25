// Import necessary functions
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Fetch and render project data
const projects = await fetchJSON('../lib/projects.json'); // Fetch data from JSON file
const projectsContainer = document.querySelector('.projects'); // Select container
const projectsTitle = document.querySelector('.projects-title'); // Select title container

// Update the project count dynamically
projectsTitle.textContent = `${projects.length} Projects`;
// renderProjects(projects, projectsContainer, 'h2'); // Render projects with <h2> headings


renderProjects(projects, projectsContainer, 'h2');

let selectedIndex = -1;

// Function to render pie chart
function renderPieChart(projectsGiven) {
    // Recalculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length, // Count the number of projects
        (d) => d.year    // Group by year
    );

    // Map rolled data to pie chart data format
    let newData = newRolledData.map(([year, count]) => ({
        value: count,
        label: year,
    }));

    // Generate pie chart slices
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(newData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newArcs = arcData.map((d) => arcGenerator(d));

    // Define color scale
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Clear existing chart and legend
    let svg = d3.select("#projects-pie-plot");
    svg.selectAll("path").remove();
    let legend = d3.select(".legend");
    legend.selectAll("li").remove();

    // Append pie chart slices to SVG
    newArcs.forEach((arc, idx) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
    
                svg.selectAll('path')
                    .attr('class', (_, Idx) => (Idx === selectedIndex ? 'selected' : ''));
    
                legend.selectAll('li')
                    .attr('class', (_, Idx) => (Idx === selectedIndex ? 'selected' : ''));
    
                let filteredProjects = projects;
    
                if (selectedIndex !== -1) {
                    let selectedYear = newData[selectedIndex].label;
                    filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
                }
    
                renderProjects(filteredProjects, projectsContainer, 'h2');
            });
    });
    

    // Append legend items
    newData.forEach((d, idx) => {
        legend
            .append("li")
            .attr("style", `--color:${colors(idx)}`)
            .attr("class", idx === selectedIndex ? "selected" : "")
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .style("cursor", "pointer")
            .on("click", () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;

                svg
                    .selectAll("path")
                    .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));
            
                legend
                    .selectAll("li")
                    .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, "h2");
                } else {
                    let selectedYear = d.label;
                    let filteredProjects = projects.filter((project) => project.year === selectedYear);
                    renderProjects(filteredProjects, projectsContainer, "h2");
                }
            });
    });
}

// Initial render of the pie chart
renderPieChart(projects);

// Set up search functionality
let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener("input", (event) => { // Use "input" for real-time updates
    // Update query and filter projects
    query = event.target.value.toLowerCase();
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // Render filtered projects and update pie chart
    renderProjects(filteredProjects, projectsContainer, "h2");
    renderPieChart(filteredProjects);
});

