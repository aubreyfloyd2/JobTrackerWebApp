const { jwtDecode } = require('jwt-decode');

const DecodedTokenId = (req) => {
    // Decode cookie to get user id for getJobs
    const decodedToken = jwtDecode(req.cookies.token, { header: false });  // retrieve req.cookies via cookie-parser
    const userId = decodedToken.id;
    return userId;
}

module.exports.CatchError = (error, res) => {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
}

module.exports.createData = async (DataModel, req, res) => {
    const data = new DataModel({ ...req.body, user: DecodedTokenId(req) });
    await data.save();
    res.status(201).json({ success: true, data });
}

module.exports.readData = async (DataModel, req, res) => {
    const data = await DataModel.find({ user: DecodedTokenId(req) });
    res.status(200).json(data);
}

module.exports.updateData = async (DataModel, text, req, res) => {
    const data = await DataModel.findByIdAndUpdate(req.params.id, { ...req.body, user: DecodedTokenId(req) }, { new: true });
    if (!data) return res.status(404).json({ success: false, message: `${text} not found` });
    res.status(200).json({ success: true, data });
}

module.exports.deleteData = async (DataModel, text, req, res) => {
    const data = await DataModel.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: `${text} not found` });
    res.status(200).json({ success: true, message: `${text} deleted successfully` });
}