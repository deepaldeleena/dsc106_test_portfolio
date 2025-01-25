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
    { url: 'index.html', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
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
