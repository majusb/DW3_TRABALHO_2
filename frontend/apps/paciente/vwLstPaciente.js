document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('pacienteListagem');
    var alertBox = document.getElementById('pacienteAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesPaciente(alertBox);
    carregarPaciente(servidorDw3, alertBox);
});

async function carregarPaciente(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var token = localStorage.getItem('jwt') || localStorage.getItem('token');

        var response = await fetch(servidorDw3 + '/getAllPaciente', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Não foi possível carregar a lista de pacientes.');
        }

        var data = await response.json();

        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta inválida do servidor backend.');
        }

        inicializarTabelaPaciente(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar pacientes.');
        inicializarTabelaPaciente([]);
    }
}

function inicializarTabelaPaciente(paciente) {
    new DataTable('#tblPaciente', {
        data: paciente,
        columns: [
            { data: 'idPaciente', defaultContent: '' },
            { data: 'cpf', defaultContent: '' },
            { data: 'nomePaciente', defaultContent: '' },
            { data: 'telefone', defaultContent: '' },
            { data: 'data_nascimento', defaultContent: '' },
            { data: 'sexo', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var idPaciente = escaparHtml(row.idPaciente || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do Paciente">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-idPaciente="' + idPaciente + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-idPaciente="' + idPaciente + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-idPaciente="' + idPaciente + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhum paciente cadastrado.',
            info: 'Mostrando _START_ até _END_ de _TOTAL_ registros',
            infoEmpty: 'Mostrando 0 até 0 de 0 registros',
            infoFiltered: '(filtrado de _MAX_ registros no total)',
            lengthMenu: 'Mostrar _MENU_ registros',
            loadingRecords: 'Carregando...',
            processing: 'Processando...',
            search: 'Pesquisar:',
            zeroRecords: 'Nenhum registro encontrado',
            paginate: {
                first: 'Primeiro',
                last: 'Último',
                next: 'Próximo',
                previous: 'Anterior'
            }
        }
    });
}

function configurarOperacoesPaciente(alertBox) {
    var tabela = document.getElementById('tblPaciente');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-idPaciente]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var idPaciente = botao.dataset.idPaciente;

        if (action === 'visualizar') {
            window.location.href = '/paciente/form?oper=Re&idPaciente=' + encodeURIComponent(idPaciente);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/paciente/form?oper=Up&idPaciente=' + encodeURIComponent(idPaciente);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/paciente/form?oper=De&idPaciente=' + encodeURIComponent(idPaciente);
        }
    });
}

function exibirAviso(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-danger');
    alertBox.classList.add('alert-info');
    alertBox.classList.remove('d-none');
}

function escaparHtml(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function exibirErro(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-info');
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}