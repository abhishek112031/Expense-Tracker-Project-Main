const DownloadedFile = require('../models/downloadedFile');
const User = require('../models/user');

exports.gellAllFiles = async (req, res, next) => {
    try {

        if (!req.user.isPremiumUser) {

            return res.status(401).json({message:'Update to premium to See All download functionalities!'})

        }
        const allDownloads=await DownloadedFile.findAll({where:{userId:req.user.id}});
        // console.log("all downloads====>>>",allDownloads[0]);
        return res.status(200).json(allDownloads);
    }
    catch (err) {
        res.status(500).json({message:'something went wrong!'})

    }

}