    const mdlLivros = require("../model/mdlMedico");

    const GetAllMedico = (req, res) =>
    (async () => {
        let registro = await mdlMedico.GetAllMedico();
        //@ Livros não tem campo de data, então não precisa converter nada.
        res.json({ status: "ok", "registro": registro });
    })();

    const GetMedicoByID = (req, res) =>
    (async () => {
        const medicoID = parseInt(req.params.medicoid);
        let registro = await mdlMedico.GetMedicoByID(medicoID);

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
        const medicoID = parseInt(request.params.medicoid);
        const medicoREG = request.body;
        let { msg, linhasAfetadas } = await mdlMedico.UpdateMedico(medicoID, medicoREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    //-- DELETE /deleteMedico/:medicoid
    const DeleteMedico = (request, res) =>
    (async () => {
        const medicoID = parseInt(request.params.medicoid);
        let { msg, linhasAfetadas } = await mdlMedico.DeleteMedico(medicoID);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    module.exports = {
    GetAllMedico,
    GetMedicoByID,
    InsertMedico,
    UpdateMedico,
    DeleteMedico,
    };