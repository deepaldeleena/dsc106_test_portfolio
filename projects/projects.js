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

// let rolledData = d3.rollups(
//     projects,
//     (v) => v.length, // Count the number of projects
//     (d) => d.year    // Group by year
// );

// let data = rolledData.map(([year, count]) => {
//     return { value: count, label: year };
//   });

// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);

// // let total = data.reduce((acc, value) => acc + value, 0);
// // let angle = 0;
// // data.forEach(d => {
// //     let endAngle = angle + (d / total) * 2 * Math.PI; 
// //     arcData.push({ startAngle: angle, endAngle: endAngle });
// //     angle = endAngle; 
// // });

// // Define the arc generator
// let arcGenerator = d3.arc()
//     .innerRadius(0)   
//     .outerRadius(50); 

// // Define a color scale for the slices
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// // Generate paths for each slice
// let arcs = arcData.map(d => arcGenerator(d));

// // Adding legend
// let legend = d3.select(".legend");
// data.forEach((d, idx) => {
//     legend.append('li')
//           .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//           .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// })

// // Selecting the SVG element and append paths
// d3.select("#projects-pie-plot")
//     .selectAll("path")
//     .data(arcData)
//     .enter()
//     .append("path")
//     .attr("d", d => arcGenerator(d))
//     .attr("fill", (_, i) => colors(i))

// let query = ''; 
// let searchInput = document.querySelector('.searchBar');
// searchInput.addEventListener('input', (event) => {
//     query = event.target.value.toLowerCase(); 
//     let filteredProjects = projects.filter((project) => {
//         let values = Object.values(project).join('\n').toLowerCase();
//         return values.includes(query); 
//     });
//     renderProjects(filteredProjects, projectsContainer, 'h2');
// });


// function renderPieChart(projectsGiven) {
//     // Recalculate rolled data
//     let newRolledData = d3.rollups(
//       projectsGiven,
//       (v) => v.length,
//       (d) => d.year
//     );
  
//     // Convert rolled data to required format
//     let newData = newRolledData.map(([year, count]) => ({
//       value: count,
//       label: year,
//     }));
  
//     // Recalculate slice generator, arc data, etc.
//     let newSliceGenerator = d3.pie().value((d) => d.value);
//     let newArcData = newSliceGenerator(newData);
//     let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  
//     // Clear existing SVG and legend
//     let svg = d3.select("#projects-pie-plot");
//     svg.selectAll("path").remove();
//     let legend = d3.select(".legend");
//     legend.selectAll("li").remove();
  
//     // Append new paths to SVG
//     svg
//       .selectAll("path")
//       .data(newArcData)
//       .enter()
//       .append("path")
//       .attr("d", (d) => arcGenerator(d))
//       .attr("fill", (_, i) => d3.schemeTableau10[i]);
  
//     // Append legend entries
//     newData.forEach((d, idx) => {
//       legend
//         .append("li")
//         .attr("style", `--color:${d3.schemeTableau10[idx]}`)
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
//     });
//   }
  
//   // Initial render
//   renderPieChart(projects);
  
//   // Add event listener for search
//   searchInput.addEventListener("input", (event) => {
//     query = event.target.value.toLowerCase();
//     let filteredProjects = projects.filter((project) => {
//       let values = Object.values(project).join("\n").toLowerCase();
//       return values.includes(query);
//     });
  
//     renderProjects(filteredProjects, projectsContainer, "h2");
//     renderPieChart(filteredProjects);
//   });

// Render projects dynamically
// renderProjects(projects, projectsContainer, 'h2');

// let selectedIndex = -1;

// // Function to render pie chart
// function renderPieChart(projectsGiven) {
//     // Recalculate rolled data
//     let newRolledData = d3.rollups(
//         projectsGiven,
//         (v) => v.length, // Count the number of projects
//         (d) => d.year    // Group by year
//     );

//     // Map rolled data to pie chart data format
//     let newData = newRolledData.map(([year, count]) => ({
//         value: count,
//         label: year,
//     }));

//     // Generate pie chart slices
//     let sliceGenerator = d3.pie().value((d) => d.value);
//     let arcData = sliceGenerator(newData);
//     let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
//     let newArcs = newArcData.map((d) => newArcgenerator(d));

//     // Clear existing chart and legend
//     let svg = d3.select("#projects-pie-plot");
//     svg.selectAll("path").remove();
//     let legend = d3.select(".legend");
//     legend.selectAll("li").remove();

//     // Append pie chart slices to SVG
//     s.forEach((d, i) =newArc> {
//         svg
//             .append("path")
//             .attr("d", arc)
//             .attr("fill", colors(i))
//             .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""))
//             .on("click", () => {
//                 selectedIndex = selectedIndex === i ? -1 : i;

//                 svg
//                 .selectAll('path')
//                 .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));
                
//                 legend
//                 .selectAll('li')
//                 .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));


//                 if (selectedIndex === -1) {
//                     renderProjects(projects, projectsContainer, "h2");
//                 } else {
//                     let selectedYear = newData[selectedIndex].label;
//                     let filteredProjects = projects.filter(
//                         (project) => project.year === selectedYear
//                     );
//                     renderProjects(filteredProjects, projectsContainer, "h2");
//                 }
//             });
//         });

//     // Append legend items
//     newData.forEach((d, i) => {
//         legend
//             .append("li")
//             .attr("style", `--color:${colors(i)}`)
//             .attr("class", (_, i) === selectedIndex ? "selected" : "")
//             .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
//             .on("click", () => {
//                 selectedIndex = selectedIndex === i ? -1 : i;

//                 svg
//                 .selectAll('path')
//                 .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));
            
//                 legend
//                 .selectAll('li')
//                 .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

//                 if (selectedIndex === -1) {
//                     renderProjects(projects, projectsContainer, "h2");
//                 } else {
//                     let selectedYear = d.label;
//                     let filteredProjects = projects.filter(
//                         (project) => project.year === selectedYear
//                     );
//                     renderProjects(filteredProjects, projectsContainer, "h2");
//                 }
//             });
//     });
// }

// // Initial render of the pie chart
// renderPieChart(projects);

// // Set up search functionality
// let query = '';
// let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener("change", (event) => {
//     // Update query and filter projects
//     query = event.target.value.toLowerCase();
//     let filteredProjects = projects.filter((project) => {
//         let values = Object.values(project).join("\n").toLowerCase();
//         return values.includes(query);
//     });

//     // Render filtered projects and update pie chart
//     renderProjects(filteredProjects, projectsContainer, "h2");
//     renderPieChart(filteredProjects);
// });



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

