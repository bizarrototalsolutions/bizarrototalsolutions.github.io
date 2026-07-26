/* ============================================================
   BTS App – utils.js
   Funções auxiliares partilhadas por todos os módulos.
   ============================================================ */

const Utils = {

  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  formatDate(iso, withTime) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    let out = `${dd}/${mm}/${yyyy}`;
    if (withTime) {
      out += ` ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return out;
  },

  formatHora(date) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  },

  todayISO() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  },

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait || 250);
    };
  },

  /* -------- Toasts (Bootstrap) -------- */
  toast(message, type) {
    type = type || 'success';
    let container = document.getElementById('bts-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bts-toast-container';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = 1080;
      document.body.appendChild(container);
    }
    const icons = { success: 'fa-circle-check', danger: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${type} border-0`;
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body"><i class="fa-solid ${icons[type] || icons.info} me-2"></i>${this.escapeHtml(message)}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    container.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: 3500 });
    t.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
  },

  /* -------- Confirmação (modal Bootstrap em vez de confirm()) -------- */
  confirmDialog(message, title) {
    return new Promise(resolve => {
      let modalEl = document.getElementById('bts-confirm-modal');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'bts-confirm-modal';
        modalEl.className = 'modal fade';
        modalEl.innerHTML = `
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="bts-confirm-title">Confirmar</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" id="bts-confirm-body"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="bts-confirm-ok">Confirmar</button>
              </div>
            </div>
          </div>`;
        document.body.appendChild(modalEl);
      }
      modalEl.querySelector('#bts-confirm-title').textContent = title || 'Confirmar';
      modalEl.querySelector('#bts-confirm-body').textContent = message;
      const modal = new bootstrap.Modal(modalEl);
      const okBtn = modalEl.querySelector('#bts-confirm-ok');
      const onOk = () => { cleanup(); modal.hide(); resolve(true); };
      const onHide = () => { cleanup(); resolve(false); };
      function cleanup() {
        okBtn.removeEventListener('click', onOk);
        modalEl.removeEventListener('hidden.bs.modal', onHide);
      }
      okBtn.addEventListener('click', onOk);
      modalEl.addEventListener('hidden.bs.modal', onHide, { once: true });
      modal.show();
    });
  },

  /* -------- Paginação -------- */
  paginate(array, page, perPage) {
    const total = array.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const p = Math.min(Math.max(1, page), totalPages);
    const start = (p - 1) * perPage;
    return { items: array.slice(start, start + perPage), page: p, totalPages, total };
  },

  /* -------- Exportações -------- */
  exportToExcel(rows, filename, sheetName) {
    if (typeof XLSX === 'undefined') { this.toast('Biblioteca de Excel não carregou.', 'danger'); return; }
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Dados');
    XLSX.writeFile(wb, filename || 'export.xlsx');
  },

  exportToPDF(title, columns, rows, filename) {
    if (typeof window.jspdf === 'undefined') { this.toast('Biblioteca de PDF não carregou.', 'danger'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 22,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 43, 74] }
    });
    doc.save(filename || 'export.pdf');
  },

  /* -------- Validações específicas PT --------
     Ensinar aqui porquê: em vez de aceitar "qualquer texto" no NIF,
     validamos o dígito de controlo oficial. Isto evita dados sujos
     na base (ex: NIFs trocados por engano) logo à entrada. */
  validateNIF(nif) {
    if (!nif) return true; // campo opcional — só validamos se preenchido
    const clean = String(nif).replace(/\s/g, '');
    if (!/^\d{9}$/.test(clean)) return false;
    const digits = clean.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += digits[i] * (9 - i);
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? 0 : 11 - remainder;
    return checkDigit === digits[8];
  },

  validatePostalCode(cp) {
    if (!cp) return true;
    return /^\d{4}-\d{3}$/.test(String(cp).trim());
  },

  downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'backup.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
};
