const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.deleteOne(req.params.id);

            res.status(200).json("Account has been delete");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update  only your account");
    }
});
//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});
//get user
router.get("/:id", async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (err){
        res.status(500).json(err);
    }
})
//follow user
router.put("/:id/follow", async (req,res) => {
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("your allready follow this user")
            }
        }catch(err) {
            res.status(500).json(err)
        }


    }else {
        res.status(403).json("you cant follow yourselft")
    }
})
//unfollow user


router.put("/:id/unfollow", async (req,res) => {
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}})
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("your allready unfollow this user")
            }
        }catch(err) {
            res.status(500).json(err)
        }


    }else {
        res.status(403).json("you cant unfollow yourselft")
    }
})

module.exports = router;
