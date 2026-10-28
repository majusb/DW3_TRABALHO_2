CREATE TABLE IF NOT EXISTS medico (
    idMedico BIGSERIAL,
    crm VARCHAR(30),
    nomeMedico VARCHAR(100),
    telefone VARCHAR(20),
    especialidade VARCHAR(100),
    deleted BOOLEAN DEFAULT false,
    CONSTRAINT pk_idMedico PRIMARY KEY (idMedico),
    CONSTRAINT u_crm UNIQUE (crm)
);

INSERT INTO medico (crm, nomeMedico, telefone, especialidade) VALUES
('123456-SP', 'Carlos Silva', '(11) 98765-4321', 'Cardiologia'),
('654321-SP', 'Ana Souza', '(17) 91234-5678', 'Pediatria')
ON CONFLICT (crm) DO NOTHING;

CREATE TABLE IF NOT EXISTS paciente (
    idPaciente BIGSERIAL,
    cpf VARCHAR(14),
    nomePaciente VARCHAR(100),
    telefone VARCHAR(20),
    data_nascimento DATE,
    sexo VARCHAR(3),
    deleted BOOLEAN DEFAULT false,
    CONSTRAINT pk_idPaciente PRIMARY KEY (idPaciente),
    CONSTRAINT u_cpf UNIQUE (cpf)
);

INSERT INTO paciente (cpf, nomePaciente, telefone, data_nascimento, sexo) VALUES
('12345678901', 'João Pereira', '(11) 99888-7777', '1985-05-12', 'M'),
('98765432109', 'Maria Oliveira', '(11) 97777-6666', '1990-10-22', 'F'),
('45678912345', 'Pedro Santos', '(11) 96666-5555', '2000-02-15', 'M')
ON CONFLICT (cpf) DO NOTHING;

CREATE TABLE IF NOT EXISTS consultas (
    idConsulta BIGSERIAL,
    idPaciente BIGINT,
    idMedico BIGINT,
    data_hora TIMESTAMP,
    status BOOLEAN,
    deleted BOOLEAN DEFAULT false,
    CONSTRAINT pk_idConsulta PRIMARY KEY (idConsulta),
    CONSTRAINT fk_idPaciente FOREIGN KEY (idPaciente) REFERENCES paciente(idPaciente),
    CONSTRAINT fk_idMedico FOREIGN KEY (idMedico) REFERENCES medico(idMedico)
);

INSERT INTO consultas (idPaciente, idMedico, data_hora, status) VALUES
(1, 1, '2026-06-01 10:30:00', true),
(2, 2, '2026-06-02 14:00:00', true),
(3, 1, '2026-06-03 09:15:00', false);

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioId BIGSERIAL,
    username VARCHAR(50) UNIQUE,
    password  VARCHAR(255),
	deleted boolean DEFAULT false,
	CONSTRAINT pk_usuarios PRIMARY KEY (usuarioId)
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (usuarioId, username, password) 
VALUES (default, 'girl', crypt('girl', gen_salt('bf')))
ON CONFLICT DO NOTHING;