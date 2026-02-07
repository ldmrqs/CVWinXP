import resumeData from '../data/resume-data.json';

const app = document.getElementById('app');
const page = app.dataset.page;
const windowTitle = app.dataset.windowTitle;
const pageTitle = app.dataset.pageTitle;

// Navigation — single source of truth
const NAV_ITEMS = [
    { href: '/resume/', label: 'home', id: 'home' },
    { href: '/resume/about.html', label: 'about', id: 'about' },
    { href: '/resume/skills.html', label: 'skills', id: 'skills' },
    { href: '/resume/experience.html', label: 'experience', id: 'experience' },
    { href: '/resume/projects.html', label: 'projects', id: 'projects' },
    { href: '/resume/contact.html', label: 'contact', id: 'contact' },
];

const PAGE_ORDER = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];

function getNavItem(id) {
    return NAV_ITEMS.find(n => n.id === id);
}

// Shared layout
function renderLayout(contentHTML) {
    const currentIndex = PAGE_ORDER.indexOf(page);
    const prev = currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : null;
    const next = currentIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentIndex + 1] : null;

    const navHTML = NAV_ITEMS.map(item =>
        `<a href="${item.href}" class="nav-button ${item.id === page ? 'active' : ''}">${item.label}</a>`
    ).join('');

    const headerHTML = page === 'home'
        ? `<img src="/images/resume/skull.gif" class="skull-gif">
           <h1 class="site-title">welcome</h1>
           <img src="/images/resume/skull.gif" class="skull-gif">`
        : `<h2 class="page-title">${pageTitle}</h2>`;

    const wrapperClass = page === 'home' ? 'home-container' : 'page-container';

    const bodyHTML = page === 'home'
        ? contentHTML
        : `<div class="window">
               <div class="window-header">
                   <span>${windowTitle}</span>
                   <div class="window-buttons">
                       <button>_</button><button>□</button><button>X</button>
                   </div>
               </div>
               <div class="window-content">${contentHTML}</div>
           </div>`;

    const footerNav = [];
    if (prev) footerNav.push(`<a href="${getNavItem(prev).href}">&laquo; ${prev}</a>`);
    if (next) footerNav.push(`<a href="${getNavItem(next).href}">${next} &raquo;</a>`);

    return `
        <div class="header">${headerHTML}</div>
        <div class="nav-bar">${navHTML}</div>
        <div class="${wrapperClass}">${bodyHTML}</div>
        <div class="footer">
            <center>
                <p>${footerNav.join(' | ')}</p>
                <p>&copy; ${resumeData.site.copyright}</p>
            </center>
        </div>
    `;
}

// Page renderers
function renderHomePage(data) {
    return `
        <div class="main-content" style="width: 100%;">
            <div class="window">
                <div class="window-header">
                    <span>welcome.exe</span>
                    <div class="window-buttons">
                        <button>_</button><button>□</button><button>X</button>
                    </div>
                </div>
                <div class="window-content">
                    <center>
                        <img src="/images/resume/matrix.gif" width="150">
                        <p class="typing-text">> ${data.personal.welcomeMessage}</p>
                        <p class="typing-text">> <span class="blink">_</span></p>
                        <div class="enter-site">
                            <p><a href="/resume/about.html">» enter my domain «</a></p>
                        </div>
                    </center>
                </div>
            </div>
        </div>
    `;
}

function renderAboutPage(data) {
    return `
        <div class="profile-section">
            <h3>☠ who am i?</h3>
            <p>${data.personal.bio}</p><br>
            <p>${data.personal.funBio}</p>
        </div>
        <div class="profile-section">
            <h3>☠ about this site</h3>
            <p>${data.personal.aboutSite}</p>
        </div>
    `;
}

function renderSkillsPage(data) {
    return data.skills.map(skill => {
        if (skill.items) {
            return `
                <div class="skill-category">
                    <h3>${skill.category}</h3>
                    ${skill.items.map(item => `
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${item.percentage}%;">${item.percentage}%</div>
                        </div>
                        <p>${item.name}</p>
                    `).join('')}
                </div>`;
        }
        return `
            <div class="skill-category">
                <h3>${skill.category}</h3>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.percentage}%;">${skill.percentage}%</div>
                </div>
                <p>${skill.tools}</p>
            </div>`;
    }).join('');
}

function renderExperiencePage(data) {
    const exp = data.experience;

    function renderEntries(entries, orgKey) {
        return entries.map(entry => `
            <div class="entry-card">
                <div class="job-header">
                    <span class="job-title">${entry.title}</span>
                    <span class="job-date">[${entry.period}]</span>
                </div>
                <p class="company">${entry[orgKey]}</p>
                <ul>${(entry.responsibilities || entry.details || []).map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
        `).join('');
    }

    return `
        <div class="experience-section">
            <h3>work experience</h3>
            ${renderEntries(exp.work, 'company')}
        </div>
        <div class="experience-section">
            <h3>education</h3>
            ${renderEntries(exp.education, 'institution')}
        </div>
        <div class="experience-section">
            <h3>volunteer work</h3>
            ${renderEntries(exp.volunteer, 'organization')}
        </div>
        <div class="experience-section">
            <h3>certifications</h3>
            <div class="cert-grid">
                ${exp.certifications.map(c => `<div class="cert-item">${c}</div>`).join('')}
            </div>
        </div>
    `;
}

function renderProjectsPage(data) {
    return `
        <center>
            <img src="/images/resume/hammer.gif" width="50" alt="Hammer Icon">
            <p class="red-text">under construction</p>
            ${data.projects.map(p => `
                <div class="project-preview">
                    <h3><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a></h3>
                    <p>${p.description}</p>
                    ${p.details ? `<p>${p.details}</p>` : ''}
                    <p>built with: ${p.tech}</p>
                </div>
            `).join('')}
            <p>check back soon for more awesome projects!</p>
        </center>
    `;
}

function renderContactPage(data) {
    return `
        <center>
            <img src="/images/resume/email.gif">
            <div class="contact-info">
                <h3>☠ reach out</h3>
                <p>email: <a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
                <p>linkedIn: <a href="${data.contact.linkedin.url}" target="_blank" rel="noopener">${data.contact.linkedin.handle}</a></p>
                <p>gitHub: <a href="${data.contact.github.url}" target="_blank" rel="noopener">${data.contact.github.handle}</a></p>
            </div>
            <div class="guestbook-link">
                <img src="/images/resume/arrowdown.gif">
                <p><a href="#" onclick="alert('Use the Notepad in Windows XP to sign my guestbook!')">sign my guestbook!</a></p>
            </div>
        </center>
    `;
}

// Render the page
const renderers = {
    home: renderHomePage,
    about: renderAboutPage,
    skills: renderSkillsPage,
    experience: renderExperiencePage,
    projects: renderProjectsPage,
    contact: renderContactPage,
};

const contentHTML = renderers[page](resumeData);
app.innerHTML = renderLayout(contentHTML);
