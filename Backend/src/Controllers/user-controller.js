import { userService as UserService } from "../Services/user-service.js";
// import { response } from "express";

const userService = new UserService()

const create = async(req, res)=>{
    try {
        const response = await userService.create({
            fullname:req.body.fullname,
            email:req.body.email,
            password:req.body.password,

        })

        return res.status(200).json({
            success: true,
            message: 'Successfully created a new user',
            data: { fullname: response.fullname, email: response.email, password:'***' },
            err: {}
        })
    } catch (error) {
        console.log('something went wrong in the user controller layer');
        return res.status(500).json({
            success: false,
            message: 'Failed to create user',
            data: {},
            err: error
        })
    }
}
export{
    create
}