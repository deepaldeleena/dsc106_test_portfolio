console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
let navLinks = $$("nav a");

// Find the link matching the current page's URL
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);
if (currentLink) {
    // or if (currentLink !== undefined)
    currentLink.classList.add('current');
  }
// Defining the navigation menu items - creating array named pages with 2 items - url and title 
let pages = [
    { url: '', title: 'Home' },
    { url: '../dsc106_test_portfolio/projects/index.html', title: 'Projects' },
    { url: '../dsc106_test_portfolio/contact/index.html', title: 'Contact' },
    { url: '../dsc106_test_portfolio/resume/index.html', title: 'Resume' },
    { url: '../dsc106_test_portfolio/meta/index.html', title: 'Meta' },
    { url: 'https://github.com/deepaldeleena', title: 'GitHub' }
];

// Creating a <nav> element in mmory
let nav = document.createElement('nav');

// Iterating through the pages array and creating links
for (let p of pages) { // p is the current object being processed
    let url = p.url; // item 1 - url
    let title = p.title; // item 2 - title 

    // Adjusting relative URLs if not on the home page
    // The variable ARE_WE_HOME checks if the <html> element 
    // contains the home class (indicating the current page is the home page).
    // If the current page is not the home page, and the url is relative (doesn’t start with http), ../ 
    // is prepended to the url
    const ARE_WE_HOME = document.documentElement.classList.contains('home');
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    // Create an <a> element
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    // Add the "current" class if this is the current page
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    // Add "target=_blank" for external links - opens in a new tab
    if (url.startsWith('http')) {
        a.target = '_blank';
    }

    // Add the link to the <nav>
    nav.append(a);
}

// Add the <nav> element to the beginning of the <body>
document.body.prepend(nav);

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select id="theme-switcher">
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    `
);
const themeSwitcher = document.querySelector('#theme-switcher');

themeSwitcher.addEventListener('input', function (event) {
    const colorScheme = event.target.value;
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    localStorage.colorScheme = colorScheme; // Save preference
});
if ('colorScheme' in localStorage) {
    const savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedScheme);
    document.querySelector('#theme-switcher').value = savedScheme;
}

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        //Log response for debugging
        console.log(response);
        // Parsing the JSON data 
        const data = await response.json();
        return data; 

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Your code will go here
    // Clear existing content
    containerElement.innerHTML = '';

    // Create and populate <article> elements
    project.forEach(project => {
        const article = document.createElement('article');
        article.innerHTML = `
            <div>
                <${headingLevel}>${project.title}</${headingLevel}>
                <img src="${project.image}" alt="${project.title}">
                <p>${project.description}</p>
                <p class="project-year">c. ${project.year}</p>
            </div>
        `;
        // Appending the article to the container
        containerElement.appendChild(article);
    });
}

export async function fetchGitHubData(username) {
    // return statement here
    return fetchJSON(`https://api.github.com/users/${username}`);
  }
  
