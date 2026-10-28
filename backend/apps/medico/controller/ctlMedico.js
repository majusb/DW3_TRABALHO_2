    const mdlMedico = require("../model/mdlMedico");

    const GetAllMedico = (req, res) =>
    (async () => {
        let registro = await mdlMedico.GetAllMedico();
        res.json({ status: "ok", "registro": registro });
    })();

    const GetMedicoByID = (req, res) =>
    (async () => {
        const idMedico = parseInt(req.params.medicoid);
        let registro = await mdlMedico.GetMedicoByID(idMedico);

        res.json({ status: "ok", "registro": registro });
    })();

    const InsertMedico = (request, res) =>
    (async () => {
        const medicoREG = request.body;
        let { msg, linhasAfetadas } = await mdlMedico.InsertMedico(medicoREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const UpdateMedico = (request, res) =>
    (async () => {
        const idMedico = parseInt(request.params.medicoid);
        const medicoREG = request.body;
        let { msg, linhasAfetadas } = await mdlMedico.UpdateMedico(idMedico, medicoREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const DeleteMedico = (request, res) =>
    (async () => {
        const idMedico = parseInt(request.params.medicoid);
        let { msg, linhasAfetadas } = await mdlMedico.DeleteMedico(idMedico);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    module.exports = {
    GetAllMedico,
    GetMedicoByID,
    InsertMedico,
    UpdateMedico,
    DeleteMedico,
    };