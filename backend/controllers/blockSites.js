import BlockSite from "../models/BlockSIte.js";

//add a site to block
const AddBlockSite=async(req,res)=>{
const{url}=req.body
if(!url){
    return res.status(400).json({success:false})
}
   const existingSite = await BlockSite.findOne({
      user: req.userId,
      url: url.toLowerCase()
    });
    if(existingSite){
         return res.status(400).json({success:false,message:"site is alredy blocked"})
    }
    const newSite=new BlockSite({
         user: req.userId,
      url: url.toLowerCase()
    })
    await newSite.save()

    return res.status(200).json({success:true,message:"site added to blocklist",newSite})
}



//remove blocksite
const removeBlocksite = async (req, res) => {
  try {
    const siteId = req.params.siteId;

    const site = await BlockSite.findById(siteId);
    if (!site) {
      return res.status(404).json({ success: false, message: "Site not found" });
    }

    if (site.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to remove this site" });
    }

    await site.deleteOne();

    return res.status(200).json({ success: true, message: "Site removed from blocklist" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


//get all blockedsites

const getAllBlockSites = async (req, res) => {
  try {
    const allSites = await BlockSite.find({ user: req.userId });

    if (allSites.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No sites blocked",
        allSites: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blocked sites fetched",
      allSites
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export {AddBlockSite,removeBlocksite,getAllBlockSites}