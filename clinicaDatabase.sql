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