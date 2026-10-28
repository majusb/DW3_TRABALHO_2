    const db = require("../../../database/databaseconfig");

    const GetAllMedico = async () => {
    return (
        await db.query(
        "SELECT * FROM medico where deleted = false ORDER BY nomeMedico ASC"
        )
    ).rows;
    };

    const GetMedicoByID = async (medicoIDPar) => {
    return (
        await db.query(
        "SELECT * FROM medico WHERE medicoId = $1 and deleted = false ORDER BY nomeMedico ASC",
        [medicoIDPar]
        )
    ).rows;
    };

    const InsertMedico = async (medicoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
        await db.query(
            "INSERT INTO medico " + "values(default, $1, $2, $3, $4, $5, $6)",
            [
            medicoREGPar.crm,
            medicoREGPar.nomeMedico,
            medicoREGPar.telefone,
            medicoREGPar.especialidade,
            medicoREGPar.deleted,
            ]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMedico|InsertMedico] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    const UpdateMedico = async (medicoIDPar, medicoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
        await db.query(
            "UPDATE medico SET " +
            "nomeMedico = $2, " +
            "especialidade = $3, " +
            "crm = $4, " +
            "telefone = $5, " +
            "deleted = $6 " +
            "WHERE medicoId = $1",
            [
            medicoIDPar,
            medicoREGPar.nomeMedico,
            medicoREGPar.especialidade,
            medicoREGPar.crm,
            medicoREGPar.telefone,
            medicoREGPar.deleted,
            ]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMedico|UpdateMedico] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    const DeleteMedico = async (medicoIDPar) => {
    let linhasAfetadas;
    let msg = "ok";

    try {
        linhasAfetadas = (
        await db.query(
            "UPDATE medico SET " + "deleted = true " + "WHERE idMedico = $1",
            [medicoIDPar]
        )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMedico|DeleteMedico] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
    };

    module.exports = {
    GetAllMedico,
    GetMedicoByID,
    InsertMedico,
    UpdateMedico,
    DeleteMedico,
    };