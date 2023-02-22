const DownloadedFile = require('../models/downloadedFile');
const User = require('../models/user');

exports.gellAllFiles = async (req, res, next) => {
    try {

        if (req.user.isPremiumUser) {
            const allDownloads=await DownloadedFile.findAll({where:{userId:req.user.id}});
            console.log("all downloads====>>>",allDownloads[0]);
            res.status(200).json(allDownloads);


        }
    }
    catch (err) {

    }

}