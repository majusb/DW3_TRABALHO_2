document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return;
    }

    var listagem = document.getElementById('consultaListagem');
    var alertBox = document.getElementById('consultaAlert');

    if (!listagem) {
        return;
    }

    var servidorDw3 = listagem.dataset.servidorDw3;

    configurarOperacoesConsulta(alertBox);
    carregarConsulta(servidorDw3, alertBox);
});

async function carregarConsulta(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend não configurado.');
        }

        var consultas = await buscarListaConsulta(servidorDw3, '/getAllConsulta');
        var pacientes = await buscarListaConsulta(servidorDw3, '/getAllPaciente');
        var medicos = await buscarListaConsulta(servidorDw3, '/getAllMedico');

        var mapaPaciente = {};
        pacientes.forEach(function(p) {
            mapaPaciente[p.idpaciente] = p.nomepaciente;
        });

        var mapaMedico = {};
        medicos.forEach(function(m) {
            mapaMedico[m.idmedico] = m.nomemedico;
        });

        inicializarTabelaConsulta(consultas, mapaPaciente, mapaMedico);
    } catch (error) {
        exibirErroConsulta(alertBox, error.message || 'Erro ao carregar consultas.');
        inicializarTabelaConsulta([], {}, {});
    }
}

async function buscarListaConsulta(servidorDw3, rota) {
    var token = localStorage.getItem('token');

    var response = await fetch(servidorDw3 + rota, {
        method: 'GET',
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

function inicializarTabelaConsulta(consultas, mapaPaciente, mapaMedico) {
    new DataTable('#tblConsulta', {
        data: consultas,
        columns: [
            { data: 'idconsulta', defaultContent: '' },
            {
                data: 'idpaciente',
                render: function(data) {
                    return escaparHtmlConsulta(mapaPaciente[data] || ('#' + data));
                }
            },
            {
                data: 'idmedico',
                render: function(data) {
                    return escaparHtmlConsulta(mapaMedico[data] || ('#' + data));
                }
            },
            { data: 'data_hora', defaultContent: '' },
            {
                data: 'valor',
                render: function(data) {
                    if (data === null || data === undefined || data === '') {
                        return '';
                    }
                    return 'R$ ' + Number(data).toFixed(2);
                }
            },
            {
                data: 'status',
                render: function(data) {
                    return data ? 'Agendada' : 'Cancelada';
                }
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }

                    var idConsulta = escaparHtmlConsulta(row.idconsulta || '');

                    return [
                        '<div class="btn-group btn-group-sm" role="group">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-id-consulta="' + idConsulta + '" title="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-id-consulta="' + idConsulta + '" title="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-id-consulta="' + idConsulta + '" title="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        language: {
            emptyTable: 'Nenhuma consulta cadastrada.',
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

function configurarOperacoesConsulta(alertBox) {
    var tabela = document.getElementById('tblConsulta');

    if (!tabela) {
        return;
    }

    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-id-consulta]');

        if (!botao) {
            return;
        }

        var action = botao.dataset.action;
        var idConsulta = botao.dataset.idConsulta;

        if (action === 'visualizar') {
            window.location.href = '/consulta/form?oper=Re&idConsulta=' + encodeURIComponent(idConsulta);
            return;
        }

        if (action === 'atualizar') {
            window.location.href = '/consulta/form?oper=Up&idConsulta=' + encodeURIComponent(idConsulta);
            return;
        }

        if (action === 'remover') {
            window.location.href = '/consulta/form?oper=De&idConsulta=' + encodeURIComponent(idConsulta);
        }
    });
}

function escaparHtmlConsulta(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function exibirErroConsulta(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }

    alertBox.textContent = mensagem;
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}
