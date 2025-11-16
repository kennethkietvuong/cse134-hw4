window.addEventListener('DOMContentLoaded', init);

function init() {
    const LOCAL_STORAGE_KEY = 'kv-portfolio-theme';

    let root = document.documentElement;
    let widget = document.querySelector('theme-widget');
    let toggle = widget.querySelector("#theme-toggle-btn");
    let panel = widget.querySelector("#theme-window");
    let options = widget.querySelectorAll("[data-theme]");

    // Load theme from localStorage
    function loadTheme() {
        return localStorage.getItem(LOCAL_STORAGE_KEY) || "light";
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem(LOCAL_STORAGE_KEY, theme);

        options.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    applyTheme(loadTheme());

    // Event Listeners
    toggle.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) {
            widget.classList.remove('open');
        }
    });

    options.forEach(btn => {
        btn.addEventListener('click', () => {
            let theme = btn.dataset.theme;
            applyTheme(theme);
        });
    });

    preventFooter();

    console.log('theme toggle loaded.');
}

function preventFooter() {
    let footer = document.querySelector('footer');
    let widget = document.querySelector('theme-widget');

    function updateWidgetPos() {
        let footerBound = footer.getBoundingClientRect();

        if (footerBound.top <= window.innerHeight - 20) {
            widget.classList.add('stuck-to-footer');
        }

        else {
            widget.classList.remove('stuck-to-footer');
        }
    }
    
    window.addEventListener('scroll', updateWidgetPos);
    window.addEventListener('resize', updateWidgetPos);
    updateWidgetPos();
}