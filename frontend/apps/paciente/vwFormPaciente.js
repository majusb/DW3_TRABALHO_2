document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmPaciente');
    if (!form) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirPaciente');
    var btnAtualizar = document.getElementById('btnAtualizarPaciente');
    var btnRemover = document.getElementById('btnRemoverPaciente');

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
    }

    if (oper === 'Re') {
        await vwGetPacienteByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetPacienteByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdatePaciente();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetPacienteByID());
            btnRemover.addEventListener('click', function() {
                vwDeletePaciente();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertPaciente();
        });
    }
});

function montarPacienteFormulario() {
    return {
        idPaciente: document.getElementById('idPaciente').value,
        cpf: document.getElementById('cpf').value,
        nomePaciente: document.getElementById('nomePaciente').value,
        telefone: document.getElementById('telefone').value,
        data_nascimento: document.getElementById('dataNascimento').value,
        sexo: document.getElementById('sexo').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}

async function vwInsertPaciente() {
    var form = document.getElementById('frmPaciente');
    var btnInserir = document.getElementById('btnInserirPaciente');

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

        var response = await fetch(servidorDw3 + '/insertPaciente', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarPacienteFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir o paciente.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir o paciente.');
        }

        window.location.href = '/paciente';
    } catch (error) {
        alert(error.message || 'Erro ao inserir paciente.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetPacienteByID() {
    var form = document.getElementById('frmPaciente');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idPaciente = parametros.get('idPaciente');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPaciente || !/^\d+$/.test(idPaciente) || Number(idPaciente) <= 0) {
            throw new Error('ID do paciente inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getPacienteByID/' + encodeURIComponent(idPaciente), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar o paciente.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var paciente = data.registro[0];

        if (!paciente) {
            throw new Error('Paciente não encontrado.');
        }

        document.getElementById('idPaciente').value = paciente.idPaciente;
        document.getElementById('nomePaciente').value = paciente.nomePaciente ?? '';
        document.getElementById('dataNascimento').value = paciente.dataNascimento ?? '';
        document.getElementById('sexo').value = paciente.sexo ?? '';
        document.getElementById('telefone').value = paciente.telefone ?? '';
        document.getElementById('deleted').value = String(paciente.deleted === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar paciente.');
        return false;
    }
}

async function vwUpdatePaciente() {
    var form = document.getElementById('frmPaciente');
    var btnAtualizar = document.getElementById('btnAtualizarPaciente');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var idPaciente = new URLSearchParams(window.location.search).get('idPaciente');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPaciente || !/^\d+$/.test(idPaciente) || Number(idPaciente) <= 0) {
            throw new Error('ID do paciente inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var paciente = montarPacienteFormulario();
        paciente.idPaciente = Number(idPaciente);

        var response = await fetch(servidorDw3 + '/updatePaciente/' + encodeURIComponent(idPaciente), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(paciente)
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar o paciente.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar o paciente.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum paciente foi atualizado.');
        }

        alert('Paciente atualizado com sucesso.');
        window.location.href = '/paciente';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar paciente.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeletePaciente() {
    var form = document.getElementById('frmPaciente');
    var btnRemover = document.getElementById('btnRemoverPaciente');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção deste paciente?')) {
        return;
    }

    try {
        var idPaciente = document.getElementById('idPaciente').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idPaciente || !/^\d+$/.test(idPaciente) || Number(idPaciente) <= 0) {
            throw new Error('ID do paciente inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deletePaciente/' + encodeURIComponent(idPaciente), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o paciente.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover o paciente.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhum paciente foi removido.');
        }

        window.location.href = '/paciente';
    } catch (error) {
        alert(error.message || 'Erro ao remover paciente.');
    } finally {
        btnRemover.disabled = false;
    }
}