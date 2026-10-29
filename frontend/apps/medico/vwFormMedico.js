document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmMedico');
    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirMedico');
    var btnAtualizar = document.getElementById('btnAtualizarMedico');
    var btnRemover = document.getElementById('btnRemoverMedico');

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
        document.getElementById('ativo').value = 'true';
    }

    if (oper === 'Re') {
        await vwGetMedicoByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetMedicoByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdateMedico();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetMedicoByID());
            btnRemover.addEventListener('click', function() {
                vwDeleteMedico();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertMedico();
        });
    }
});

function montarMedicoFormulario() {
    return {
        idMedico: document.getElementById('idMedico').value,
        crm: document.getElementById('crm').value,
        nomeMedico: document.getElementById('nomeMedico').value,
        telefone: document.getElementById('telefone').value,
        especialidade: document.getElementById('especialidade').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}

async function vwInsertMedico() {
    var form = document.getElementById('frmMedico');
    var btnInserir = document.getElementById('btnInserirMedico');

    try {
        if (!form.reportValidity()) {
            return;
        }

        var servidorDw3 = form.dataset.servidorDw3;

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        if (btnInserir) {
            btnInserir.disabled = true;
        }

        var response = await fetch(servidorDw3 + '/insertMedico', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarMedicoFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir o médico.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir o médico.');
        }

        window.location.href = '/medico';
    } catch (error) {
        alert(error.message || 'Erro ao inserir médico.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetMedicoByID() {
    var form = document.getElementById('frmMedico');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idMedico = parametros.get('idMedico');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idMedico || !/^\d+$/.test(idMedico) || Number(idMedico) <= 0) {
            throw new Error('ID do médico inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getMedicoByID/' + encodeURIComponent(idMedico), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o médico.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var medico = data.registro[0];

        if (!medico) {
            throw new Error('Médico não encontrado.');
        }

        document.getElementById('idMedico').value = medico.idMedico;
        document.getElementById('nomeMedico').value = medico.nomeMedico ?? '';
        document.getElementById('especialidade').value = medico.especialidade ?? '';
        document.getElementById('telefone').value = medico.telefone ?? '';
        document.getElementById('ativo').value = String(medico.ativo);
        document.getElementById('deleted').value = String(medico.deleted === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar médico.');
        return false;
    }
}

async function vwUpdateMedico() {
    var form = document.getElementById('frmMedico');
    var btnAtualizar = document.getElementById('btnAtualizarMedico');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var idMedico = new URLSearchParams(window.location.search).get('idMedico');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idMedico || !/^\d+$/.test(idMedico) || Number(idMedico) <= 0) {
            throw new Error('ID do médico inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var medico = montarMedicoFormulario();
        medico.idMedico = Number(idMedico);

        var response = await fetch(servidorDw3 + '/updateMedico/' + encodeURIComponent(idMedico), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(medico)
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar o médico.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar o médico.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum médico foi atualizado.');
        }

        alert('Médico atualizado com sucesso.');
        window.location.href = '/medico';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar médico.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteMedico() {
    var form = document.getElementById('frmMedico');
    var btnRemover = document.getElementById('btnRemoverMedico');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste médico?')) {
        return;
    }

    try {
        var idMedico = document.getElementById('idMedico').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idMedico || !/^\d+$/.test(idMedico) || Number(idMedico) <= 0) {
            throw new Error('ID do médico inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deleteMedico/' + encodeURIComponent(idMedico), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o médico.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o médico.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum médico foi removido.');
        }

        window.location.href = '/medicos';
    } catch (error) {
        alert(error.message || 'Erro ao remover médico.');
    } finally {
        btnRemover.disabled = false;
    }
}