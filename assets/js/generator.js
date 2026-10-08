/**
 * ====================================================================
 * GUEST NAME & WHATSAPP GENERATOR JAVASCRIPT
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tentukan Base URL Undangan (Mendukung file:/// dan http/https)
    const customBaseUrlInput = document.getElementById('customBaseUrl');
    let autoBaseUrl = '';

    if (window.location.protocol === 'file:') {
        // Jika dibuka langsung via file:/// di browser lokal
        autoBaseUrl = window.location.href.replace(/\/namatamu\/?(index\.html)?([?#].*)?$/i, '/index.html');
    } else {
        // Jika di-hosting di server web (http/https)
        autoBaseUrl = window.location.origin + window.location.pathname.replace(/\/namatamu\/?(index\.html)?$/i, '/');
        if (!autoBaseUrl.endsWith('/')) autoBaseUrl += '/';
    }

    if (customBaseUrlInput) {
        customBaseUrlInput.value = autoBaseUrl;
    }

    // 2. Tab Navigation (Single vs Bulk)
    const tabSingleBtn = document.getElementById('tabSingleBtn');
    const tabBulkBtn = document.getElementById('tabBulkBtn');
    const singleSection = document.getElementById('singleSection');
    const bulkSection = document.getElementById('bulkSection');

    if (tabSingleBtn && tabBulkBtn) {
        tabSingleBtn.addEventListener('click', () => {
            tabSingleBtn.classList.add('active');
            tabBulkBtn.classList.remove('active');
            singleSection.style.display = 'block';
            bulkSection.style.display = 'none';
        });

        tabBulkBtn.addEventListener('click', () => {
            tabBulkBtn.classList.add('active');
            tabSingleBtn.classList.remove('active');
            singleSection.style.display = 'none';
            bulkSection.style.display = 'block';
        });
    }

    // 3. Form Single Generator Submit
    const singleForm = document.getElementById('singleForm');
    const singleOutput = document.getElementById('singleOutput');
    const previewText = document.getElementById('previewText');
    const previewLinkText = document.getElementById('previewLinkText');
    const waShareBtn = document.getElementById('waShareBtn');
    const previewLinkBtn = document.getElementById('previewLinkBtn');

    if (singleForm) {
        singleForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('guestName').value.trim();
            const phone = document.getElementById('guestPhone')?.value.trim() || '';
            const tgl = document.getElementById('eventDateSelect')?.value || '16';
            const template = document.getElementById('templateSelect').value;
            const useIntro = document.querySelector('input[name="useIntro"]:checked')?.value === 'ya';
            const baseUrl = customBaseUrlInput?.value.trim() || autoBaseUrl;

            if (!nama) return;

            // Generate Link
            const linkUndangan = generateLink(baseUrl, nama, tgl);

            // Generate Pesan
            const pesanText = generateMessage(nama, linkUndangan, template, useIntro, tgl);

            // Tampilkan Output
            previewText.textContent = pesanText;
            previewLinkText.textContent = linkUndangan;
            previewLinkText.href = linkUndangan;
            previewLinkBtn.href = linkUndangan;

            // Setup WA Link
            const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
            const waBase = cleanPhone ? `https://wa.me/${cleanPhone}` : `https://wa.me/`;
            waShareBtn.href = `${waBase}?text=${encodeURIComponent(pesanText)}`;

            singleOutput.style.display = 'block';
            singleOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // 4. Form Bulk Generator Submit
    const bulkForm = document.getElementById('bulkForm');
    const bulkOutput = document.getElementById('bulkOutput');
    const bulkTableBody = document.getElementById('bulkTableBody');
    const bulkCountSpan = document.getElementById('bulkCountSpan');

    let currentBulkData = [];

    if (bulkForm) {
        bulkForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const rawNames = document.getElementById('bulkNames').value.trim();
            const tgl = document.getElementById('bulkEventDateSelect')?.value || '16';
            const template = document.getElementById('bulkTemplateSelect').value;
            const useIntro = document.querySelector('input[name="bulkUseIntro"]:checked')?.value === 'ya';
            const baseUrl = customBaseUrlInput?.value.trim() || autoBaseUrl;

            if (!rawNames) return;

            const nameList = rawNames.split('\n')
                .map(n => n.trim())
                .filter(n => n.length > 0);

            if (nameList.length === 0) return;

            currentBulkData = nameList.map((nama, idx) => {
                const link = generateLink(baseUrl, nama, tgl);
                const pesan = generateMessage(nama, link, template, useIntro, tgl);
                return {
                    no: idx + 1,
                    nama: nama,
                    link: link,
                    pesan: pesan,
                    waUrl: `https://wa.me/?text=${encodeURIComponent(pesan)}`
                };
            });

            // Render Table
            bulkTableBody.innerHTML = currentBulkData.map(item => `
                <tr>
                    <td>${item.no}</td>
                    <td><strong>${escapeHtml(item.nama)}</strong></td>
                    <td><a href="${item.link}" target="_blank" class="link-highlight">${escapeHtml(item.link)}</a></td>
                    <td>
                        <div class="bulk-action-btns">
                            <button class="btn-bulk-mini btn-copy" onclick="copyDirectText('${escapeForJs(item.pesan)}', this)" title="Salin Teks Lengkap">
                                <i class="fas fa-copy"></i> Teks
                            </button>
                            <button class="btn-bulk-mini btn-preview-link" onclick="copyDirectText('${escapeForJs(item.link)}', this)" title="Salin Link Saja">
                                <i class="fas fa-link"></i> Link
                            </button>
                            <a href="${item.waUrl}" target="_blank" class="btn-bulk-mini btn-wa" title="Kirim ke WA">
                                <i class="fab fa-whatsapp"></i> WA
                            </a>
                        </div>
                    </td>
                </tr>
            `).join('');

            bulkCountSpan.textContent = `${nameList.length} Tamu Dibuat`;
            bulkOutput.style.display = 'block';
            bulkOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Export Bulk to CSV
    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
        btnExportCsv.addEventListener('click', () => {
            if (!currentBulkData || currentBulkData.length === 0) return;

            let csvContent = 'data:text/csv;charset=utf-8,No,Nama Tamu,Link Undangan\n';
            currentBulkData.forEach(row => {
                csvContent += `"${row.no}","${row.nama.replace(/"/g, '""')}","${row.link}"\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'daftar_link_undangan.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});

/**
 * Generate Link Undangan dengan parameter URL yang rapi
 */
/**
 * Generate Link Undangan dengan parameter URL yang rapi
 */
function generateLink(baseUrl, nama, tgl) {
    let cleanBase = baseUrl.trim();

    // Jika protokol file:/// lokal dan belum ada nama file index.html
    if (cleanBase.startsWith('file:') && !cleanBase.includes('.html')) {
        if (!cleanBase.endsWith('/')) cleanBase += '/';
        cleanBase += 'index.html';
    }

    const params = new URLSearchParams();
    params.set('untuk', nama);
    if (tgl === '15') {
        params.set('tgl', '15');
    }

    const separator = cleanBase.includes('?') ? '&' : '?';
    return `${cleanBase}${separator}${params.toString()}`;
}

/**
 * Generate Pesan WhatsApp berdasarkan template yang dipilih
 */
function generateMessage(nama, link, template, useIntro, tgl) {
    if (!useIntro) {
        return link;
    }

    const tglInfo = (tgl === '15' || (nama && (nama.toLowerCase().includes('aktif') || nama.toLowerCase().includes('ngampel'))))
        ? ' pada hari Kamis, 15 Oktober 2026'
        : '';

    switch (template) {
        case 'bali':
            return `Om Swastyastu,\n\nKepada Yth. Bapak/Ibu/Saudara/i\n*${nama}*\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri Upacara Manusa Yadnya Pawiwahan & Mepandes kami${tglInfo}.\n\nUntuk info selengkapnya mengenai waktu dan lokasi acara, silakan kunjungi tautan undangan kami berikut:\n${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nMatur Suksma.\nOm Shanti Shanti Shanti Om`;

        case 'santai':
            return `Halo *${nama}*! 👋\n\nKami mengundang kamu untuk hadir di acara Upacara Pawiwahan & Mepandes kami${tglInfo}.\n\nYuk buka detail acaranya di link undangan ini ya:\n${link}\n\nKehadiran dan doa restumu sangat berarti untuk kami. Sampai jumpa di hari bahagia kami! 🙏✨`;

        case 'formal':
        default:
            return `Kepada Yth. Bapak/Ibu/Saudara/i\n*${nama}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk dapat menghadiri Upacara Manusa Yadnya Pawiwahan & Mepandes kami${tglInfo}.\n\nDetail acara dan lokasi dapat diakses melalui link undangan berikut:\n${link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.\n\nTerima Kasih.`;
    }
}

/**
 * Copy text from Element
 */
window.copyElementText = function(elementId, btn) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const text = el.textContent || el.innerText;
    copyDirectText(text, btn);
};

/**
 * Copy direct text string
 */
window.copyDirectText = function(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const origText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i> Disalin!';

        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = origText;
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
    });
};

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function escapeForJs(text) {
    return (text || '').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}
