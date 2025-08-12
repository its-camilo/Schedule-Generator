// --- Tema claro/oscuro ---
const themeBtn = document.getElementById('toggle-theme');
const body = document.body;
function setTheme(theme) {
    body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
}
themeBtn.onclick = () => {
    setTheme(body.classList.contains('light') ? 'dark' : 'light');
};
(function initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    setTheme(theme);
})();

// --- Tabs ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
    btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    };
});

// --- Modal ---
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');
closeModal.onclick = () => modal.classList.add('hidden');
function showModal(html) {
    modalBody.innerHTML = html;
    modal.classList.remove('hidden');
}
function hideModal() {
    modal.classList.add('hidden');
}
window.onclick = e => { if (e.target === modal) hideModal(); };

// --- Local Storage ---
const LS_KEY = 'scheduleGenData';
function saveData(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function loadData() {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
}
function clearData() {
    localStorage.removeItem(LS_KEY);
    renderAll();
}
document.getElementById('clear-data').onclick = clearData;

// --- Datos de prueba ---
const sampleData = {
    materias: [
        { nombre: 'Matemáticas', grupos: [
            { grupo: '101', profesor: 'Dr. Pérez', dias: 'Lunes/Miércoles', franja: '7–9', cupos: 2 },
            { grupo: '102', profesor: 'Dra. Gómez', dias: 'Martes/Jueves', franja: '9–11', cupos: 1 },
            { grupo: '103', profesor: 'Dr. Pérez', dias: 'Viernes', franja: '11–1', cupos: 1 }
        ] },
        { nombre: 'Física', grupos: [
            { grupo: '201', profesor: 'Dr. Pérez', dias: 'Martes/Jueves', franja: '11–1', cupos: 1 },
            { grupo: '202', profesor: 'Dra. Gómez', dias: 'Lunes/Miércoles', franja: '2–4', cupos: 2 },
            { grupo: '203', profesor: 'Lic. Torres', dias: 'Sábado', franja: '7–9', cupos: 1 }
        ] },
        { nombre: 'Química', grupos: [
            { grupo: '301', profesor: 'Ing. Ruiz', dias: 'Lunes/Miércoles', franja: '2–4', cupos: 3 },
            { grupo: '302', profesor: 'Dr. Pérez', dias: 'Martes/Jueves', franja: '4–6', cupos: 1 }
        ] },
        { nombre: 'Historia', grupos: [
            { grupo: '401', profesor: 'Lic. Torres', dias: 'Viernes', franja: '4–6', cupos: 1 },
            { grupo: '402', profesor: 'Dra. Gómez', dias: 'Martes/Jueves', franja: '6–8', cupos: 2 }
        ] },
        { nombre: 'Programación', grupos: [
            { grupo: '501', profesor: 'Ing. Ruiz', dias: 'Lunes/Miércoles', franja: '9–11', cupos: 2 },
            { grupo: '502', profesor: 'Dr. Pérez', dias: 'Martes/Jueves', franja: '2–4', cupos: 1 }
        ] },
        { nombre: 'Literatura', grupos: [
            { grupo: '601', profesor: 'Lic. Torres', dias: 'Viernes', franja: '7–9', cupos: 1 },
            { grupo: '602', profesor: 'Dra. Gómez', dias: 'Lunes/Miércoles', franja: '11–1', cupos: 2 }
        ] },
        { nombre: 'Biología', grupos: [
            { grupo: '701', profesor: 'Dr. Pérez', dias: 'Martes/Jueves', franja: '7–9', cupos: 2 },
            { grupo: '702', profesor: 'Ing. Ruiz', dias: 'Sábado', franja: '2–4', cupos: 1 }
        ] }
    ],
    prioridadMaterias: ['Matemáticas', 'Física', 'Química', 'Historia', 'Programación', 'Literatura', 'Biología'],
    prioridadProfesores: ['Dr. Pérez', 'Dra. Gómez', 'Ing. Ruiz', 'Lic. Torres']
};
document.getElementById('load-sample').onclick = () => {
    saveData(sampleData);
    renderAll();
};

// --- Estado principal ---
let state = {};
function loadState() {
    state = loadData();
    if (!state.materias) state.materias = [];
    if (!state.prioridadMaterias) state.prioridadMaterias = [];
    if (!state.prioridadProfesores) state.prioridadProfesores = [];
}
function updateState() {
    saveData(state);
    renderAll();
}

// --- Render Materias ---
function renderMaterias() {
    const list = document.getElementById('materias-list');
    list.innerHTML = '';
    state.materias.forEach((mat, i) => {
        const li = document.createElement('li');
        li.className = 'materia-item';
        li.innerHTML = `
            <div class="materia-header">
                <span><b>${mat.nombre}</b></span>
                <span class="materia-actions">
                    <button onclick="editMateria(${i})">Editar</button>
                    <button onclick="deleteMateria(${i})">Eliminar</button>
                    <button onclick="addGrupo(${i})">Agregar grupo</button>
                </span>
            </div>
            <ul class="grupos-list">
                ${(mat.grupos||[]).map((g,j) => `
                    <li class="grupo-item">
                        <span>${g.grupo} - ${g.profesor} - ${g.dias} - ${g.franja} - Cupos: ${g.cupos}</span>
                        <span class="grupo-actions">
                            <button onclick="editGrupo(${i},${j})">Editar</button>
                            <button onclick="deleteGrupo(${i},${j})">Eliminar</button>
                        </span>
                    </li>
                `).join('')}
            </ul>
        `;
        list.appendChild(li);
    });
}
window.editMateria = function(idx) {
    const mat = state.materias[idx];
    showModal(`<form id='edit-mat-form'>
        <label>Nombre de la materia</label>
        <input type='text' name='nombre' value='${mat.nombre}' required>
        <button type='submit'>Guardar</button>
    </form>`);
    document.getElementById('edit-mat-form').onsubmit = e => {
        e.preventDefault();
        mat.nombre = e.target.nombre.value.trim();
        updateState();
        hideModal();
    };
};
window.deleteMateria = function(idx) {
    if (confirm('¿Eliminar materia?')) {
        state.materias.splice(idx,1);
        updateState();
    }
};
window.addGrupo = function(idx) {
    showModal(`<form id='add-grupo-form'>
        <label>Número de grupo</label>
        <input type='text' name='grupo' required>
        <label>Profesor</label>
        <input type='text' name='profesor' required>
        <label>Días</label>
        <select name='dias'>
            <option>Lunes/Miércoles</option>
            <option>Martes/Jueves</option>
            <option>Miércoles/Viernes</option>
            <option>Viernes</option>
            <option>Sábado</option>
        </select>
        <label>Franja</label>
        <select name='franja'>
            <option>7–9</option>
            <option>9–11</option>
            <option>11–1</option>
            <option>2–4</option>
            <option>4–6</option>
            <option>6–8</option>
        </select>
        <label>Cupos</label>
        <input type='number' name='cupos' min='0' value='1' required>
        <button type='submit'>Agregar</button>
    </form>`);
    document.getElementById('add-grupo-form').onsubmit = e => {
        e.preventDefault();
        const g = {
            grupo: e.target.grupo.value.trim(),
            profesor: e.target.profesor.value.trim(),
            dias: e.target.dias.value,
            franja: e.target.franja.value,
            cupos: parseInt(e.target.cupos.value)
        };
        state.materias[idx].grupos = state.materias[idx].grupos || [];
        state.materias[idx].grupos.push(g);
        updateState();
        hideModal();
    };
};
window.editGrupo = function(matIdx, grpIdx) {
    const g = state.materias[matIdx].grupos[grpIdx];
    showModal(`<form id='edit-grupo-form'>
        <label>Número de grupo</label>
        <input type='text' name='grupo' value='${g.grupo}' required>
        <label>Profesor</label>
        <input type='text' name='profesor' value='${g.profesor}' required>
        <label>Días</label>
        <select name='dias'>
            <option${g.dias==='Lunes/Miércoles'?' selected':''}>Lunes/Miércoles</option>
            <option${g.dias==='Martes/Jueves'?' selected':''}>Martes/Jueves</option>
            <option${g.dias==='Miércoles/Viernes'?' selected':''}>Miércoles/Viernes</option>
            <option${g.dias==='Viernes'?' selected':''}>Viernes</option>
            <option${g.dias==='Sábado'?' selected':''}>Sábado</option>
        </select>
        <label>Franja</label>
        <select name='franja'>
            <option${g.franja==='7–9'?' selected':''}>7–9</option>
            <option${g.franja==='9–11'?' selected':''}>9–11</option>
            <option${g.franja==='11–1'?' selected':''}>11–1</option>
            <option${g.franja==='2–4'?' selected':''}>2–4</option>
            <option${g.franja==='4–6'?' selected':''}>4–6</option>
            <option${g.franja==='6–8'?' selected':''}>6–8</option>
        </select>
        <label>Cupos</label>
        <input type='number' name='cupos' min='0' value='${g.cupos}' required>
        <button type='submit'>Guardar</button>
    </form>`);
    document.getElementById('edit-grupo-form').onsubmit = e => {
        e.preventDefault();
        g.grupo = e.target.grupo.value.trim();
        g.profesor = e.target.profesor.value.trim();
        g.dias = e.target.dias.value;
        g.franja = e.target.franja.value;
        g.cupos = parseInt(e.target.cupos.value);
        updateState();
        hideModal();
    };
};
window.deleteGrupo = function(matIdx, grpIdx) {
    if (confirm('¿Eliminar grupo?')) {
        state.materias[matIdx].grupos.splice(grpIdx,1);
        updateState();
    }
};
document.getElementById('add-materia').onclick = function() {
    showModal(`<form id='add-mat-form'>
        <label>Nombre de la materia</label>
        <input type='text' name='nombre' required>
        <button type='submit'>Agregar</button>
    </form>`);
    document.getElementById('add-mat-form').onsubmit = e => {
        e.preventDefault();
        const nombre = e.target.nombre.value.trim();
        if (!nombre) return;
        state.materias.push({ nombre, grupos: [] });
        updateState();
        hideModal();
    };
};

// --- Render Prioridad ---
function getUniqueMaterias() {
    return state.materias.map(m => m.nombre);
}
function getUniqueProfesores() {
    const set = new Set();
    state.materias.forEach(m => (m.grupos||[]).forEach(g => {
        if (g.profesor && !set.has(g.profesor)) set.add(g.profesor);
    }));
    return Array.from(set);
}
function renderPrioridad() {
    // Materias
    const matList = document.getElementById('prioridad-materias');
    const mats = state.prioridadMaterias.length ? state.prioridadMaterias : getUniqueMaterias();
    matList.innerHTML = '';
    mats.forEach((mat,i) => {
        const li = document.createElement('li');
        li.draggable = true;
        li.className = 'draggable';
        li.dataset.index = i;
        li.innerHTML = `<span>${mat}</span>`;
        matList.appendChild(li);
    });
    // Drag and drop eventos
    let dragSrcIdx = null;
    matList.querySelectorAll('li').forEach(li => {
        li.addEventListener('dragstart', e => {
            dragSrcIdx = Number(li.dataset.index);
            li.classList.add('dragging');
        });
        li.addEventListener('dragend', e => {
            li.classList.remove('dragging');
        });
        li.addEventListener('dragover', e => {
            e.preventDefault();
            li.classList.add('drag-over');
        });
        li.addEventListener('dragleave', e => {
            li.classList.remove('drag-over');
        });
        li.addEventListener('drop', e => {
            li.classList.remove('drag-over');
            const dropIdx = Number(li.dataset.index);
            if (dragSrcIdx === null || dragSrcIdx === dropIdx) return;
            const arr = [...mats];
            const moved = arr.splice(dragSrcIdx,1)[0];
            arr.splice(dropIdx,0,moved);
            state.prioridadMaterias = arr;
            updateState();
        });
    });
    // Profesores
    const profList = document.getElementById('prioridad-profesores');
    let profs = getUniqueProfesores();
    if (state.prioridadProfesores.length) {
        const seen = new Set();
        profs = state.prioridadProfesores.filter(p => {
            if (seen.has(p)) return false;
            seen.add(p);
            return true;
        });
    }
    profList.innerHTML = '';
    profs.forEach((prof,i) => {
        const li = document.createElement('li');
        li.draggable = true;
        li.className = 'draggable';
        li.dataset.index = i;
        li.innerHTML = `<span>${prof}</span>`;
        profList.appendChild(li);
    });
    // Drag and drop eventos
    let dragSrcIdxProf = null;
    profList.querySelectorAll('li').forEach(li => {
        li.addEventListener('dragstart', e => {
            dragSrcIdxProf = Number(li.dataset.index);
            li.classList.add('dragging');
        });
        li.addEventListener('dragend', e => {
            li.classList.remove('dragging');
        });
        li.addEventListener('dragover', e => {
            e.preventDefault();
            li.classList.add('drag-over');
        });
        li.addEventListener('dragleave', e => {
            li.classList.remove('drag-over');
        });
        li.addEventListener('drop', e => {
            li.classList.remove('drag-over');
            const dropIdx = Number(li.dataset.index);
            if (dragSrcIdxProf === null || dragSrcIdxProf === dropIdx) return;
            const arr = [...profs];
            const moved = arr.splice(dragSrcIdxProf,1)[0];
            arr.splice(dropIdx,0,moved);
            state.prioridadProfesores = arr;
            updateState();
        });
    });
}

// --- Generador de horarios ---
const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const FRANJAS = ['7–9','9–11','11–1','2–4','4–6','6–8'];
function renderScheduleTable(tableId, schedule) {
    const table = document.getElementById(tableId);
    let html = '<thead><tr><th></th>';
    DIAS.forEach(d => html += `<th>${d}</th>`);
    html += '</tr></thead><tbody>';
    FRANJAS.forEach(f => {
        html += `<tr><th>${f}</th>`;
        DIAS.forEach(d => {
            const cell = schedule.find(s => s.dia===d && s.franja===f);
            html += `<td>${cell ? cell.materia+'<br>'+cell.profesor+'<br>Grupo '+cell.grupo : ''}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';
    table.innerHTML = html;
}
function renderScheduleDetails(detailsId, selected) {
    const div = document.getElementById(detailsId);
    div.innerHTML = selected.map(s => `<div>${s.materia} - ${s.profesor} - ${s.dias} - ${s.franja} - Grupo ${s.grupo} - Cupos: ${s.cupos}</div>`).join('');
}
function generateAllSchedules() {
    // Filtrar grupos con cupos
    const materias = state.materias.filter(m => (m.grupos||[]).some(g => g.cupos>0));
    // Prioridad
    const matOrder = state.prioridadMaterias.length ? state.prioridadMaterias : getUniqueMaterias();
    const profOrder = state.prioridadProfesores.length ? state.prioridadProfesores : getUniqueProfesores();
    // Generar combinaciones normales
    let optionsNormal = [];
    let profOrderNormal = [...profOrder];
    for (let opt=0; opt<2; opt++) {
        let selected = [];
        let schedule = [];
        let usedSlots = {};
        for (let matName of matOrder) {
            const mat = materias.find(m => m.nombre===matName);
            if (!mat) continue;
            let grupos = (mat.grupos||[]).filter(g => g.cupos>0);
            grupos.sort((a,b) => profOrderNormal.indexOf(a.profesor)-profOrderNormal.indexOf(b.profesor));
            let found = null;
            for (let g of grupos) {
                let dias = g.dias.split('/');
                let conflict = false;
                for (let dia of dias) {
                    let key = dia+'-'+g.franja;
                    if (usedSlots[key]) { conflict=true; break; }
                }
                if (!conflict) { found=g; break; }
            }
            if (found) {
                let dias = found.dias.split('/');
                for (let dia of dias) {
                    usedSlots[dia+'-'+found.franja]=true;
                    schedule.push({dia, franja:found.franja, materia:mat.nombre, profesor:found.profesor, grupo:found.grupo});
                }
                selected.push({...found, materia:mat.nombre});
            }
        }
        optionsNormal.push({schedule, selected});
        profOrderNormal.reverse();
    }
    // Generar combinaciones almuerzo libre
    let optionsLunch = [];
    let profOrderLunch = [...profOrder];
    for (let opt=0; opt<2; opt++) {
        let selected = [];
        let schedule = [];
        let usedSlots = {};
        for (let matName of matOrder) {
            const mat = materias.find(m => m.nombre===matName);
            if (!mat) continue;
            let grupos = (mat.grupos||[]).filter(g => g.cupos>0);
            grupos.sort((a,b) => profOrderLunch.indexOf(a.profesor)-profOrderLunch.indexOf(b.profesor));
            let found = null;
            for (let g of grupos) {
                let dias = g.dias.split('/');
                let conflict = false;
                for (let dia of dias) {
                    let key = dia+'-'+g.franja;
                    if (usedSlots[key]) { conflict=true; break; }
                    // Almuerzo libre: no empalmar 11–1 y 2–4 el mismo día
                    if ((g.franja==='11–1'||g.franja==='2–4')) {
                        let lunchKey = dia+'-'+(g.franja==='11–1'?'2–4':'11–1');
                        if (usedSlots[lunchKey]) { conflict=true; break; }
                    }
                }
                if (!conflict) { found=g; break; }
            }
            if (found) {
                let dias = found.dias.split('/');
                for (let dia of dias) {
                    usedSlots[dia+'-'+found.franja]=true;
                    schedule.push({dia, franja:found.franja, materia:mat.nombre, profesor:found.profesor, grupo:found.grupo});
                }
                selected.push({...found, materia:mat.nombre});
            }
        }
        optionsLunch.push({schedule, selected});
        profOrderLunch.reverse();
    }
    // Render en columnas
    renderScheduleTable('schedule1', optionsNormal[0].schedule);
    renderScheduleDetails('details1', optionsNormal[0].selected);
    renderScheduleTable('schedule2', optionsNormal[1].schedule);
    renderScheduleDetails('details2', optionsNormal[1].selected);
    renderScheduleTable('schedule3', optionsLunch[0].schedule);
    renderScheduleDetails('details3', optionsLunch[0].selected);
    renderScheduleTable('schedule4', optionsLunch[1].schedule);
    renderScheduleDetails('details4', optionsLunch[1].selected);
}
document.getElementById('generate-normal').onclick = () => generateAllSchedules();
document.getElementById('generate-lunch').onclick = () => generateAllSchedules();

// --- Render All ---
function renderAll() {
    loadState();
    renderMaterias();
    renderPrioridad();
    generateAllSchedules();
}
window.onload = renderAll;
