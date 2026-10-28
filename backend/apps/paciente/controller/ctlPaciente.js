    const mdlPaciente = require("../model/mdlPaciente");

    const GetAllPaciente = (req, res) =>
    (async () => {
        let registro = await mdlPaciente.GetAllPaciente();
        res.json({ status: "ok", "registro": registro });
    })();

    const GetPacienteByID = (req, res) =>
    (async () => {
        const idPaciente = parseInt(req.params.pacienteid);
        let registro = await mdlPaciente.GetPacienteByID(idPaciente);

        res.json({ status: "ok", "registro": registro });
    })();

    const InsertPaciente = (request, res) =>
    (async () => {
        const pacienteREG = request.body;
        let { msg, linhasAfetadas } = await mdlPaciente.InsertPaciente(pacienteREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const UpdatePaciente = (request, res) =>
    (async () => {
        const idPaciente = parseInt(request.params.pacienteid);
        const pacienteREG = request.body;
        let { msg, linhasAfetadas } = await mdlPaciente.UpdatePaciente(idPaciente, pacienteREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const DeletePaciente = (request, res) =>
    (async () => {
        const pacienteID = parseInt(request.params.pacienteid);
        let { msg, linhasAfetadas } = await mdlPaciente.DeletePaciente(pacienteID);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    module.exports = {
    GetAllPaciente,
    GetPacienteByID,
    InsertPaciente,
    UpdatePaciente,
    DeletePaciente,
    };