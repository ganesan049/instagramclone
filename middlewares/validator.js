const fs = require("fs")

module.exports = (req, res, next) => {
    console.log(req.file)
        if (typeof (req.file) === 'undefined') {
            return res.status(401).json({
                message: "problem with sending data"
            })
        }
        let image = req.file.path;
        if (!(req.file.mimetype).includes("jpeg") && !(req.file.mimetype).includes("png") && (!(req.file.mimetype).includes("jpg"))) {
                    fs.unlinkSync(image)
                    return res.json({
                        message: "file not supported"
                    })
                }
                if (req.file.size > 1024 * 1024) {
                    fs.unlinkSync(image);
                    return res.status(400).json({
                        image: "file is too large"
                    })
                }
                if (!image) {
                    return res.status(400).json({
                        image: "all fields are required"
                    })
                }
                return res.json({
                    message:image
                })
            }