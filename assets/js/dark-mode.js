/* =========================================================
   🌙 DARK MODE — cross-page persistence via localStorage
   Load this in <head> (before body renders) to prevent flash
========================================================= */

(function () {
    // Apply saved theme immediately on load
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var html = document.documentElement;

    function applyTheme(isDark) {
        if (isDark) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    // Set correct icon on load
    updateIcon();

    btn.addEventListener('click', function () {
        var isDark = !html.classList.contains('dark');
        applyTheme(isDark);
        updateIcon();
    });

    function updateIcon() {
        var isDark = html.classList.contains('dark');
        // Sun icon (shown in dark mode — click to go light)
        btn.innerHTML = isDark
            ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
            // Moon icon (shown in light mode — click to go dark)
            : '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
});
