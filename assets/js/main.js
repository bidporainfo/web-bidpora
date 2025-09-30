// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Header hamburger toggles sidebar
    var hamburger = document.querySelector('.menu-icon');
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var body = document.body;
    
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function () {
            sidebar.classList.toggle('sidebar--open');
            body.classList.toggle('sidebar-open');
        });
        
        // Support keyboard activation
        hamburger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sidebar.classList.toggle('sidebar--open');
                body.classList.toggle('sidebar-open');
            }
        });
    }
    
    // Close sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('sidebar--open');
            body.classList.remove('sidebar-open');
        });
    }

    // No JS needed for <details>; keep file lean

    // Year filler if present
    var year = document.getElementById('year');
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    // Navigation is now handled by NavigationManager in dashboard.html
    // This prevents conflicts with the new navigation system

    // Render charts on dashboard load
    try { initCharts(); } catch (_) {}
});

// ---- SPA data rendering from JSON dummy ----
async function fetchJSON(path){ const res = await fetch(path + '?v=' + Date.now()); return res.json(); }

async function initCharts(){
    var pieCanvas = document.getElementById('pieAtlet');
    var barCanvas = document.getElementById('barMedali');
    if (!pieCanvas && !barCanvas) return;
    // Ambil dari localStorage dashboard; fallback ke default
    var stored = localStorage.getItem('dispora_dashboard');
    var dashboard = { atlet: 0, tenaga: 0, cabor: 0 };
    try { if (stored) dashboard = JSON.parse(stored); } catch(_) {}
    if (pieCanvas && window.Chart) {
        // Destroy existing instance if any
        if (window.__disporaPieChart) { try { window.__disporaPieChart.destroy(); } catch(e) {} }
        const labels = ['Atlet','Tenaga','CABOR'];
        const values = [dashboard.atlet || 0, dashboard.tenaga || 0, dashboard.cabor || 0];
        window.__disporaPieChart = new Chart(pieCanvas, {
            type: 'pie',
            data: { labels: labels, datasets: [{ data: values, backgroundColor: [
                '#f8636f','#ffb74d','#4fc3f7','#81c784','#9575cd','#ffd54f','#4dd0e1','#a1887f'
            ] }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', align: 'center' }
                },
                layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } }
            }
        });
    }
    if (barCanvas && window.Chart) {
        if (window.__disporaBarChart) { try { window.__disporaBarChart.destroy(); } catch(e) {} }
        const m = {
            labels: ['Atlet','Tenaga','CABOR'],
            emas: [dashboard.atlet || 0, 0, 0],
            perak: [0, dashboard.tenaga || 0, 0],
            perunggu: [0, 0, dashboard.cabor || 0]
        };
        window.__disporaBarChart = new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: m.labels,
                datasets: [
                    { label: 'Emas', data: m.emas, backgroundColor: '#ffd54f' },
                    { label: 'Perak', data: m.perak, backgroundColor: '#cfd8dc' },
                    { label: 'Perunggu', data: m.perunggu, backgroundColor: '#bcaaa4' }
                ]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { position: 'top' } }
            }
        });
    }
}

// Public function to refresh charts when dashboard data changes
window.updateDashboardCharts = async function(){
    try { await initCharts(); } catch(_) {}
}

async function renderEKompetisi(){
    const data = await fetchJSON('assets/data/ekomp.json');
    var tbody = document.querySelector('#ekoTable tbody');
    var search = document.getElementById('ekoSearch');
    var pageSizeSel = document.getElementById('ekoPageSize');
    function draw(){
        var q = (search.value || '').toLowerCase();
        var pageSize = parseInt(pageSizeSel.value, 10) || 10;
        var rows = data.items.filter(function(it){
            return it.nama.toLowerCase().includes(q) || it.deskripsi.toLowerCase().includes(q);
        }).slice(0, pageSize);
        tbody.innerHTML = rows.map(function(it, idx){
            return '<tr>'+
                '<td>'+(idx+1)+'</td>'+
                '<td>'+it.nama+'</td>'+
                '<td>'+it.deskripsi+'</td>'+
                '<td>'+it.tglMulai+'</td>'+
                '<td>'+it.tglSelesai+'</td>'+
                '<td>'+it.tingkat+'</td>'+
            '</tr>';
        }).join('');
    }
    search.oninput = draw; pageSizeSel.onchange = draw; draw();
}

async function renderPelatihan(){
    const data = await fetchJSON('assets/data/pelatihan.json');
    var tbody = document.querySelector('#pelTable tbody');
    var search = document.getElementById('pelSearch');
    var pageSizeSel = document.getElementById('pelPageSize');
    function draw(){
        var q = (search.value || '').toLowerCase();
        var pageSize = parseInt(pageSizeSel.value, 10) || 10;
        var rows = data.items.filter(function(it){
            return it.nama.toLowerCase().includes(q);
        }).slice(0, pageSize);
        tbody.innerHTML = rows.map(function(it, idx){
            return '<tr>'+
                '<td>'+(idx+1)+'</td>'+
                '<td>'+it.nama+'</td>'+
                '<td>'+it.tanggalPendaftaran+'</td>'+
                '<td>'+it.tanggalWorkshop+'</td>'+
                '<td>'+it.kuota+'</td>'+
            '</tr>';
        }).join('');
    }
    search.oninput = draw; pageSizeSel.onchange = draw; draw();
}

async function renderKeolahragaan(){
    const data = await fetchJSON('assets/data/keolahragaan.json');
    var tbody = document.querySelector('#keloTable tbody');
    var search = document.getElementById('keloSearch');
    var pageSizeSel = document.getElementById('keloPageSize');
    function draw(){
        var q = (search.value || '').toLowerCase();
        var pageSize = parseInt(pageSizeSel.value, 10) || 10;
        var rows = data.items.filter(function(it){
            return it.cabor.toLowerCase().includes(q);
        }).slice(0, pageSize);
        tbody.innerHTML = rows.map(function(it, idx){
            return '<tr>'+
                '<td>'+(idx+1)+'</td>'+
                '<td>'+it.cabor+'</td>'+
                '<td>'+it.jumlahAtlet+'</td>'+
                '<td>'+it.pelatih+'</td>'+
                '<td>'+it.klub+'</td>'+
            '</tr>';
        }).join('');
    }
    search.oninput = draw; pageSizeSel.onchange = draw; draw();
}
