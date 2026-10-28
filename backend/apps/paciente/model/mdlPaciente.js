    const db = require("../../../database/databaseconfig");

    const GetAllPaciente = async () => {
    return (
        await db.query(
        "SELECT * FROM paciente where deleted = false ORDER BY nomePaciente ASC"
        )
    ).rows;
    };

    const GetPacienteByID = async (pacienteIDPar) => {
    return (
        await db.query(
        "SELECT * FROM paciente WHERE idPaciente = $1 and deleted = false ORDER BY nomePaciente ASC",
        [pacienteIDPar]
        )
    ).rows;
    };

    const InsertPaciente = async (pacienteREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
        await db.query(
            "INSERT INTO paciente " + "values(default, $1, $2, $3, $4, $5, $6)",
            [
            pacienteREGPar.cpf,
            pacienteREGPar.nomePaciente,
            pacienteREGPar.telefone,
            pacienteREGPar.data_nascimento,
            pacienteREGPar.sexo,
            pacienteREGPar.deleted
            ]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPaciente|InsertPaciente] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    const UpdatePaciente = async (pacienteIDPar, pacienteREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
        await db.query(
            "UPDATE paciente SET " +
            "nomePaciente = $2, " +
            "data_nascimento = $3, " +
            "sexo = $4, " +
            "telefone = $5, " +
            "deleted = $6 " +
            "WHERE idPaciente = $1",
            [
            pacienteIDPar,
            pacienteREGPar.nomePaciente,
            pacienteREGPar.data_nascimento,
            pacienteREGPar.sexo,
            pacienteREGPar.telefone,
            pacienteREGPar.deleted,
            ]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPaciente|UpdatePaciente] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    const DeletePaciente = async (pacienteIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
        await db.query(
            "UPDATE paciente SET " + "deleted = true " + "WHERE idPaciente = $1",
            [pacienteIDPar]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlPaciente|DeletePaciente] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    module.exports = {
    GetAllPaciente,
    GetPacienteByID,
    InsertPaciente,
    UpdatePaciente,
    DeletePaciente,
    };