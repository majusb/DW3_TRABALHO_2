    const db = require("../../../database/databaseconfig");

    const GetAllConsulta = async () => {
    return (
        await db.query(
        "SELECT idConsulta, idPaciente, idMedico, to_char(data_hora, 'YYYY-MM-DD HH24:MI') AS data_hora, valor, status, deleted FROM consultas where deleted = false ORDER BY data_hora ASC"
        )
    ).rows;
    };

    const GetConsultaByID = async (consultaIDPar) => {
    return (
        await db.query(
        "SELECT idConsulta, idPaciente, idMedico, to_char(data_hora, 'YYYY-MM-DD HH24:MI') AS data_hora, valor, status, deleted FROM consultas WHERE idConsulta = $1 and deleted = false",
        [consultaIDPar]
        )
    ).rows;
    };

    const InsertConsulta = async (consultaREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
        await db.query(
            "INSERT INTO consultas " + "values(default, $1, $2, $3, $4, $5, $6)",
            [
            consultaREGPar.idPaciente,
            consultaREGPar.idMedico,
            consultaREGPar.data_hora,
            consultaREGPar.valor,
            consultaREGPar.status,
            consultaREGPar.deleted
            ]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlConsulta|InsertConsulta] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    const UpdateConsulta = async (consultaIDPar, consultaREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
        await db.query(
            "UPDATE consultas SET " +
            "idPaciente = $2, " +
            "idMedico = $3, " +
            "data_hora = $4, " +
            "valor = $5, " +
            "status = $6, " +
            "deleted = $7 " +
            "WHERE idConsulta = $1",
            [
            consultaIDPar,
            consultaREGPar.idPaciente,
            consultaREGPar.idMedico,
            consultaREGPar.data_hora,
            consultaREGPar.valor,
            consultaREGPar.status,
            consultaREGPar.deleted,
            ]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlConsulta|UpdateConsulta] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    const DeleteConsulta = async (consultaIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
        await db.query(
            "UPDATE consultas SET " + "deleted = true " + "WHERE idConsulta = $1",
            [consultaIDPar]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlConsulta|DeleteConsulta] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    module.exports = {
    GetAllConsulta,
    GetConsultaByID,
    InsertConsulta,
    UpdateConsulta,
    DeleteConsulta,
    };
