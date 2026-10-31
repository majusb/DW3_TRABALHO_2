document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }

    var form = document.getElementById('frmConsulta');

    if (!form) {
        return;
    }

    var servidorDw3 = form.dataset.servidorDw3;
    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var btnInserir = document.getElementById('btnInserirConsulta');
    var btnAtualizar = document.getElementById('btnAtualizarConsulta');
    var btnRemover = document.getElementById('btnRemoverConsulta');

    await carregarSelects(servidorDw3);

    if (oper === 'Cr') {
        if (btnInserir) {
            btnInserir.classList.remove('d-none');
        }
    }

    if (oper === 'Re') {
        await vwGetConsultaByID();
    }

    if (oper === 'Up') {
        if (btnAtualizar) {
            btnAtualizar.classList.remove('d-none');
            btnAtualizar.disabled = !(await vwGetConsultaByID());
            btnAtualizar.addEventListener('click', function() {
                vwUpdateConsulta();
            });
        }
    }

    if (oper === 'De') {
        if (btnRemover) {
            btnRemover.classList.remove('d-none');
            btnRemover.disabled = !(await vwGetConsultaByID());
            btnRemover.addEventListener('click', function() {
                vwDeleteConsulta();
            });
        }
    }

    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertConsulta();
        });
    }
});

async function carregarSelects(servidorDw3) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var pacientes = await buscarListaForm(servidorDw3, '/getAllPaciente');
        preencherSelect('idPaciente', pacientes, 'idpaciente', 'nomepaciente');

        var medicos = await buscarListaForm(servidorDw3, '/getAllMedico');
        preencherSelect('idMedico', medicos, 'idmedico', 'nomemedico');
    } catch (error) {
        alert(error.message || 'Erro ao carregar pacientes e médicos.');
    }
}

async function buscarListaForm(servidorDw3, rota) {
    var token = localStorage.getItem('token');

    var response = await fetch(servidorDw3 + rota, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Error('Não foi possível carregar os dados do servidor.');
    }

    var data = await response.json();

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
        throw new Error('Resposta inválida do servidor backend.');
    }

    return data.registro;
}

function preencherSelect(idSelect, lista, campoValor, campoTexto) {
    var select = document.getElementById(idSelect);

    if (!select) {
        return;
    }

    lista.forEach(function(item) {
        var opcao = document.createElement('option');
        opcao.value = item[campoValor];
        opcao.textContent = item[campoTexto];
        select.appendChild(opcao);
    });
}

function montarConsultaFormulario() {
    return {
        idConsulta: document.getElementById('idConsulta').value,
        idPaciente: document.getElementById('idPaciente').value,
        idMedico: document.getElementById('idMedico').value,
        data_hora: document.getElementById('dataHora').value,
        valor: document.getElementById('valor').value,
        status: document.getElementById('status').value === 'true',
        deleted: document.getElementById('deleted').value === 'true'
    };
}

async function vwInsertConsulta() {
    var form = document.getElementById('frmConsulta');
    var btnInserir = document.getElementById('btnInserirConsulta');

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

        var response = await fetch(servidorDw3 + '/insertConsulta', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarConsultaFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível inserir a consulta.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível inserir a consulta.');
        }

        window.location.href = '/consulta';
    } catch (error) {
        alert(error.message || 'Erro ao inserir consulta.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

async function vwGetConsultaByID() {
    var form = document.getElementById('frmConsulta');

    try {
        var parametros = new URLSearchParams(window.location.search);
        var idConsulta = parametros.get('idConsulta');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idConsulta || !/^\d+$/.test(idConsulta) || Number(idConsulta) <= 0) {
            throw new Error('ID da consulta inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var response = await fetch(servidorDw3 + '/getConsultaByID/' + encodeURIComponent(idConsulta), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a consulta.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        var consulta = data.registro[0];

        if (!consulta) {
            throw new Error('Consulta não encontrada.');
        }

        document.getElementById('idConsulta').value = consulta.idconsulta;
        document.getElementById('idPaciente').value = consulta.idpaciente ?? '';
        document.getElementById('idMedico').value = consulta.idmedico ?? '';
        document.getElementById('dataHora').value = (consulta.data_hora ?? '').replace(' ', 'T');
        document.getElementById('valor').value = consulta.valor ?? '';
        document.getElementById('status').value = String(consulta.status === true);
        document.getElementById('deleted').value = String(consulta.deleted === true);

        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar consulta.');
        return false;
    }
}

async function vwUpdateConsulta() {
    var form = document.getElementById('frmConsulta');
    var btnAtualizar = document.getElementById('btnAtualizarConsulta');

    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }

    try {
        var idConsulta = new URLSearchParams(window.location.search).get('idConsulta');
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idConsulta || !/^\d+$/.test(idConsulta) || Number(idConsulta) <= 0) {
            throw new Error('ID da consulta inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnAtualizar.disabled = true;

        var response = await fetch(servidorDw3 + '/updateConsulta/' + encodeURIComponent(idConsulta), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarConsultaFormulario())
        });

        if (!response.ok) {
            throw new Error('Não foi possível atualizar a consulta.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível atualizar a consulta.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma consulta foi atualizada.');
        }

        alert('Consulta atualizada com sucesso.');
        window.location.href = '/consulta';
    } catch (error) {
        alert(error.message || 'Erro ao atualizar consulta.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteConsulta() {
    var form = document.getElementById('frmConsulta');
    var btnRemover = document.getElementById('btnRemoverConsulta');

    if (btnRemover.disabled) {
        return;
    }

    if (!window.confirm('Confirma a remoção desta consulta?')) {
        return;
    }

    try {
        var idConsulta = document.getElementById('idConsulta').value;
        var servidorDw3 = form.dataset.servidorDw3;

        if (!idConsulta || !/^\d+$/.test(idConsulta) || Number(idConsulta) <= 0) {
            throw new Error('ID da consulta inválido.');
        }

        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        btnRemover.disabled = true;

        var response = await fetch(servidorDw3 + '/deleteConsulta/' + encodeURIComponent(idConsulta), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover a consulta.');
        }

        var data = await response.json();

        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faça login novamente.');
        }

        if (data.status !== 'ok') {
            throw new Error(data.status || 'Não foi possível remover a consulta.');
        }

        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma consulta foi removida.');
        }

        window.location.href = '/consulta';
    } catch (error) {
        alert(error.message || 'Erro ao remover consulta.');
    } finally {
        btnRemover.disabled = false;
    }
}
