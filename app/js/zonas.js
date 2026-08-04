/* ============================================================
   BTS App – zonas.js
   CRUD de zonas de atuação. Mesma filosofia das outras listagens
   (clientes.js/servicos.js): estado num objeto, render() redesenha
   tudo a partir da cache do DB.
   ============================================================ */

const ZonasPage = {
  state: { search: '' },
  modal: null,

  async init() {
    Auth.requireAuth();
    await DB.ready();
    UI.init('zonas');
    this.modal = new bootstrap.Modal(document.getElementById('modal-zona'));
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.getElementById('busca-zonas').addEventListener('input', Utils.debounce((e) => {
      this.state.search = e.target.value.trim().toLowerCase();
      this.render();
    }, 200));

    ['btn-nova-zona', 'btn-nova-zona-empty'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.abrirModal());
    });

    document.getElementById('form-zona').addEventListener('submit', (e) => this.guardar(e));
  },

  contarClientes(nomeZona) {
    return DB.getClientes().filter(c => c.zona === nomeZona).length;
  },
  contarServicos(nomeZona) {
    return DB.getServicos().filter(s => s.zona === nomeZona).length;
  },

  render() {
    const zonas = [...DB.getZonas()]
      .filter(z => !this.state.search || z.nome.toLowerCase().includes(this.state.search))
      .sort((a, b) => a.nome.localeCompare(b.nome));

    document.getElementById('contador-zonas').textContent = `${zonas.length} zona${zonas.length !== 1 ? 's' : ''}`;

    const tbody = document.getElementById('tbody-zonas');
    const tableWrap = document.getElementById('tabela-zonas-wrap');
    const empty = document.getElementById('zonas-empty');

    if (!zonas.length) {
      tableWrap.style.display = 'none';
      empty.style.display = 'block';
      return;
    }
    tableWrap.style.display = 'block';
    empty.style.display = 'none';

    tbody.innerHTML = zonas.map(z => `
      <tr>
        <td><strong>${Utils.escapeHtml(z.nome)}</strong></td>
        <td>${this.contarClientes(z.nome)}</td>
        <td>${this.contarServicos(z.nome)}</td>
        <td class="text-end">
          <div class="bts-row-actions">
            <button title="Editar" onclick="ZonasPage.abrirModal('${z.id}')"><i class="fa-solid fa-pen"></i></button>
            <button title="Eliminar" class="danger" onclick="ZonasPage.eliminar('${z.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  abrirModal(id) {
    const erro = document.getElementById('zona-erro');
    erro.style.display = 'none';
    document.getElementById('form-zona').reset();
    if (id) {
      const zona = DB.getZonas().find(z => z.id === id);
      document.getElementById('modal-zona-titulo').textContent = 'Editar Zona';
      document.getElementById('zona-id').value = zona.id;
      document.getElementById('zona-nome').value = zona.nome;
    } else {
      document.getElementById('modal-zona-titulo').textContent = 'Nova Zona';
      document.getElementById('zona-id').value = '';
    }
    this.modal.show();
  },

  async guardar(e) {
    e.preventDefault();
    const id = document.getElementById('zona-id').value;
    const nome = document.getElementById('zona-nome').value.trim();
    const erro = document.getElementById('zona-erro');

    if (!nome) { erro.textContent = 'O nome da zona é obrigatório.'; erro.style.display = 'block'; return; }

    const duplicado = DB.getZonas().some(z => z.nome.toLowerCase() === nome.toLowerCase() && z.id !== id);
    if (duplicado) { erro.textContent = 'Já existe uma zona com esse nome.'; erro.style.display = 'block'; return; }

    try {
      if (id) {
        await DB.updateZona(id, nome);
        Utils.toast('Zona atualizada.', 'success');
      } else {
        await DB.addZona(nome);
        Utils.toast('Zona criada.', 'success');
      }
      this.modal.hide();
      this.render();
    } catch (err) {
      erro.textContent = err.message || 'Não foi possível guardar a zona. Tenta novamente.';
      erro.style.display = 'block';
    }
  },

  async eliminar(id) {
    const zona = DB.getZonas().find(z => z.id === id);
    if (!zona) return;
    const emUso = this.contarClientes(zona.nome) + this.contarServicos(zona.nome);
    const aviso = emUso > 0
      ? ` Esta zona está associada a ${emUso} registo(s) — o nome deixará de aparecer neles, mas os dados mantêm-se.`
      : '';
    const ok = await Utils.confirmDialog(`Eliminar a zona "${zona.nome}"?${aviso}`, 'Eliminar zona');
    if (!ok) return;
    try {
      await DB.deleteZona(id);
      Utils.toast('Zona eliminada.', 'success');
      this.render();
    } catch (e) {
      Utils.toast(e.message || 'Não foi possível eliminar a zona.', 'danger');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => ZonasPage.init());
