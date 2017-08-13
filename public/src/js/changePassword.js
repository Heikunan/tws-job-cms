"use strict";
function resetPassword() {
    let email=$('.text_field').val();
    $.post(`/resettingPassword?email=${email}`,function (reply) {
        console.log(reply);
        if(reply){
            $('#resetPassword_frame').hidden();
            $('#login_frame').display();
        }else {
            alert('该邮箱尚未注册，请先注册！');
        }
    })
}

/*
function login() {
    let passwordCode=$('.login_text');
    let password=$('.login_password');
    let passwordConfirmation=$('.login_passwordConfirm');

}
*/
