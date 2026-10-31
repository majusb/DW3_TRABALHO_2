    const mdlConsulta = require("../model/mdlConsulta");

    const GetAllConsulta = (req, res) =>
    (async () => {
        let registro = await mdlConsulta.GetAllConsulta();
        res.json({ status: "ok", "registro": registro });
    })();

    const GetConsultaByID = (req, res) =>
    (async () => {
        const idConsulta = parseInt(req.params.consultaid);
        let registro = await mdlConsulta.GetConsultaByID(idConsulta);

        res.json({ status: "ok", "registro": registro });
    })();

    const InsertConsulta = (request, res) =>
    (async () => {
        const consultaREG = request.body;
        let { msg, linhasAfetadas } = await mdlConsulta.InsertConsulta(consultaREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const UpdateConsulta = (request, res) =>
    (async () => {
        const idConsulta = parseInt(request.params.consultaid);
        const consultaREG = request.body;
        let { msg, linhasAfetadas } = await mdlConsulta.UpdateConsulta(idConsulta, consultaREG);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    const DeleteConsulta = (request, res) =>
    (async () => {
        const consultaID = parseInt(request.params.consultaid);
        let { msg, linhasAfetadas } = await mdlConsulta.DeleteConsulta(consultaID);
        res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
    })();

    module.exports = {
    GetAllConsulta,
    GetConsultaByID,
    InsertConsulta,
    UpdateConsulta,
    DeleteConsulta,
    };
