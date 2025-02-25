let data = [];
let commits = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));
    processCommits();
    displayStats();
    console.log(commits);
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    createScatterplot();
});


function processCommits() {
    commits = d3
        .groups(data, (d) => d.commit) 
        .map(([commit, lines]) => {
            let first = lines[0]; 
            let { author, date, time, timezone, datetime } = first;

            let ret = {
                id: commit, 
                url: 'https://github.com/vis-society/lab-7/commit/' + commit,
                author,
                date,
                time,
                timezone,
                datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60, // Commit time as decimal
                totalLines: lines.length, // Number of lines modified
            };

            Object.defineProperty(ret, 'lines', {
                value: lines,
                configurable: false, // Prevent modification
                writable: false, // Prevent overwriting
                enumerable: true, // Hide from console output
            });

            return ret;
        });
}

function displayStats() {
    // Process commits first
    processCommits();

    // Clear existing content
    d3.select('#stats').html("");

    // Create the main stats container
    const statsContainer = d3.select("#stats").append("div").attr("class", "stats");

    // Create the header row
    const headerRow = statsContainer.append("div").attr("class", "stats-header");
    const labels = ["Commits", "Files", "Total LOC", "Max Depth", "Longest Line", "Max Lines"];
    labels.forEach(label => {
        headerRow.append("div").attr("class", "stat-label").text(label);
    });

    // Create the values row
    const valueRow = statsContainer.append("div").attr("class", "stats-values");
    const values = [
        commits.length,
        d3.groups(data, d => d.file).length || 0,
        data.length,
        d3.max(data, d => d.depth) || 0,
        d3.max(data, d => d.length) || 0,
        d3.max(data, d => d.line) || 0
    ];
    values.forEach(value => {
        valueRow.append("div").attr("class", "stat-value").text(value);
    });
}

let xScale, yScale; // Declare global scales

function createScatterplot() {
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

    const svg = d3.select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

    // Define scales globally
    xScale = d3.scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

    // Gridlines
    svg.append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

    // Axes
    svg.append('g')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(d3.axisLeft(yScale)
            .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00'));

    // Dot Size Scale
    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    const rScale = d3.scaleLinear()
        .domain([minLines, maxLines])
        .range([2, 30]);

    // Append dots
    const dots = svg.append('g').attr('class', 'dots');

    dots.selectAll('circle')
        .data(commits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines))
        .attr('fill', 'steelblue')
        .style('fill-opacity', 0.7)
        .on('mouseover', function (event, commit) {
            updateTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
            d3.select(this).style('fill-opacity', 1);
        })
        .on('mouseout', function () {
            updateTooltipContent({});
            updateTooltipVisibility(false);
            d3.select(this).style('fill-opacity', 0.7);
        });

    // Brushing
    const brush = d3.brush()
        .extent([[usableArea.left, usableArea.top], [usableArea.right, usableArea.bottom]])
        .on('brush end', brushed);

    svg.append('g').attr('class', 'brush').call(brush);
    svg.select('.dots').raise();
}

function brushSelector() {
    const svg = document.querySelector('svg');
    // Update brush initialization to listen for events
    d3.select(svg).call(d3.brush().on('start brush end', brushed));
    // Raise dots and everything after overlay
    d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
  }

let brushSelection = null;

function brushed(event) {
    console.log(event);
    brushSelection = event.selection;
    updateSelection();
    updateSelectionCount();
    updateLanguageBreakdown();
}

function isCommitSelected(commit) {
    if (!brushSelection) return false;
    
    const min = { x: brushSelection[0][0], y: brushSelection[0][1] };
    const max = { x: brushSelection[1][0], y: brushSelection[1][1] };
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);

    return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
}

function updateSelection() {
    d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d)).attr('fill', (d) => isCommitSelected(d) ? "#ff6b6b" : "steelblue"); // Highlight selected dots

}

function updateSelectionCount() {
    const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    const countElement = document.getElementById('selection-count');
    countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
    return selectedCommits;
}

function updateLanguageBreakdown() {
    const selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    const container = document.getElementById('language-breakdown');

    if (selectedCommits.length === 0) {
        container.innerHTML = '';
        return;
    }

    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap((d) => d.lines);

    // Use d3.rollup to count lines per language
    const breakdown = d3.rollup(
    lines,
    (v) => v.length,
    (d) => d.type
    );

    container.innerHTML = '';
    for (const [language, count] of breakdown) {
        const proportion = count / lines.length;
        const formatted = d3.format('.1%')(proportion);
        container.innerHTML += `<dt>${language}</dt><dd>${count} lines (${formatted})</dd>`;
    }
    return breakdown;
}

// Tooltip Functions
function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');

    if (Object.keys(commit).length === 0) return;

    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' });
}

function updateTooltipVisibility(isVisible) {
    document.getElementById('commit-tooltip').hidden = !isVisible;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
}

