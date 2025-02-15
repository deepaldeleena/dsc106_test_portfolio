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
    // processCommits();
    displayStats();
    console.log(commits);
}
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
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
                enumerable: false, // Hide from console output
            });

            return ret;
        });
}

// function displayStats() {
    // Process commits first
    // processCommits();

    // // Create the dl element
    // const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    // // Add total LOC
    // dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    // dl.append('dd').text(data.length);

    // // Add total Commits
    // dl.append('dt').text('Total Commits');
    // dl.append('dd').text(commits.length);

    // // Number of Unique Files
    // const totalFiles = d3.groups(data, d => d.file).length;
    // dl.append('dt').text('Total Files');
    // dl.append('dd').text(totalFiles);

    // // Maximum File Depth
    // const maxDepth = d3.max(data, d => d.depth);
    // dl.append('dt').text('Max Depth');
    // dl.append('dd').text(maxDepth);

    // // Longest Line Length
    // const longestLine = d3.max(data, d => d.length);
    // dl.append('dt').text('Longest Line');
    // dl.append('dd').text(longestLine);

    // // Most Active Time Period
    // const workByPeriod = d3.rollups(
    //     data,
    //     v => v.length,
    //     d => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    // );
    // const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
    // dl.append('dt').text('Most Active Time');
    // dl.append('dd').text(maxPeriod);
    // Process commits first
    // processCommits();

//     // Clear existing content to prevent duplicate stats
//     d3.select('#stats').html("");

//     // Create a structured stats container
//     const statsContainer = d3.select("#stats").append("div").attr("class", "stats");

//     // Define stats with labels
//     const stats = [
//         { label: "Total LOC", value: data.length },
//         { label: "Total Commits", value: commits.length },
//         { label: "Total Files", value: d3.groups(data, d => d.file).length || 0 },
//         { label: "Max Depth", value: d3.max(data, d => d.depth) || 0 },
//         { label: "Longest Line", value: d3.max(data, d => d.length) || 0 },
//         { label: "Most Active Time", value: d3.greatest(
//             d3.rollups(
//                 data, v => v.length,
//                 d => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
//             ), d => d[1]
//         )?.[0] || "N/A" }
//     ];

//     // Append stats in correct format
//     stats.forEach(stat => {
//         const statBlock = statsContainer.append("div").attr("class", "stat-block");
//         statBlock.append("p").attr("class", "stat-label").text(stat.label);
//         statBlock.append("p").attr("class", "stat-value").text(stat.value);
//     });
// }

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





