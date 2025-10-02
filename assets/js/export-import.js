// Export/Import Manager for data/database.json
(function(){
    class ExportImportManager {
        constructor(){
            this.initButtons();
        }

        initButtons(){
            const header = document.querySelector('.dashboard-header');
            if (!header || document.getElementById('export-import-db')) return;
            const wrap = document.createElement('div');
            wrap.id = 'export-import-db';
            wrap.style.cssText = 'display:flex;gap:10px;margin-left:20px;';
            wrap.innerHTML = `
                <button class="btn-secondary" onclick="exportImport.exportDatabase()"><i class="fas fa-download"></i> Export DB</button>
                <button class="btn-secondary" onclick="document.getElementById('import-db-file').click()"><i class="fas fa-upload"></i> Import DB</button>
                <input id="import-db-file" type="file" accept=".json" style="display:none" onchange="exportImport.handleImport(event)">
            `;
            header.appendChild(wrap);
        }

        buildDatabaseFromLocal(){
            // Local content from ContentManager
            let localContent = {};
            try {
                const d = localStorage.getItem('dispora_data');
                if (d) localContent = JSON.parse(d);
            } catch(_) {}

            // Dashboard numbers
            let dashboard = {};
            try {
                const d = localStorage.getItem('dispora_dashboard');
                if (d) dashboard = JSON.parse(d);
            } catch(_) {}

            // News
            let news = [];
            try { news = JSON.parse(localStorage.getItem('dispora_news') || '[]'); } catch(_) {}

            // Optional other sections
            const medals = localContent.medal_tallies || [];
            const matches = localContent.match_schedules || [];
            const results = localContent.results || [];

            // Compose minimal database.json
            const database = {
                users: [],
                news: news,
                achievements: localContent.achievements || [],
                gallery: localContent.gallery || [],
                events: localContent.events || [],
                medal_tallies: medals,
                match_schedules: matches,
                results: results,
                _dashboard: dashboard
            };
            return database;
        }

        exportDatabase(){
            const db = this.buildDatabaseFromLocal();
            const str = JSON.stringify(db, null, 2);
            const blob = new Blob([str], {type:'application/json'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `database-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        }

        handleImport(e){
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    // Save pieces to localStorage so admin can edit further
                    const localContent = {
                        achievements: data.achievements || [],
                        gallery: data.gallery || [],
                        events: data.events || []
                    };
                    localStorage.setItem('dispora_data', JSON.stringify(localContent));
                    if (data._dashboard) {
                        localStorage.setItem('dispora_dashboard', JSON.stringify(data._dashboard));
                    }
                    alert('Import berhasil. Commit file ke data/database.json di repo agar pengunjung melihat perubahan.');
                    // Optional: refresh tables if available
                    if (window.contentManager) {
                        window.contentManager.data = localContent;
                        window.contentManager.renderAllTables();
                    }
                    if (window.updateDashboardCharts) window.updateDashboardCharts();
                } catch(err){
                    alert('Gagal membaca file JSON: ' + err.message);
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        }
    }

    window.ExportImportManager = ExportImportManager;
})();


