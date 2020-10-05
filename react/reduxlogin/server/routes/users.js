import express from 'express';
import isEmpty from 'lodash/isEmpty';
import validator from 'validator';

let router = express.Router();

const validateInput =(data) =>{
    let errors = {};
    if(validator.isEmpty(data.username)){
        errors.username= "用户名不为空";
    }
    if(validator.isEmpty(data.email)){
        errors.email= "邮箱不为空";
    }
    if(!validator.isEmail(data.email)){
        errors.email="邮箱错误"
    }
    if(validator.isEmpty(data.password)){
        errors.password= "密码不为空";
    }
    if(validator.isEmpty(data.passwordConfirmation)){
        errors.passwordConfirmation= "验证密码不为空";
    }
    if(!validator.equals(data.password,data.passwordConfirmation)){
        errors.passwordConfirmation ="密码必须匹配"
    }
    return {
        errors,
        isvalid:isEmpty(errors)
    }
}
router.post('/',(req,res) =>{
    console.log(req.body);
    const{errors,isvalid} =validateInput(req.body);

    if(isvalid){
        res.json({success:true});
    }
    else{
        res.status(400).json(errors);
    }
});

export default router;