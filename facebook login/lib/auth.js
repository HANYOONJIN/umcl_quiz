module.exports ={
    IsOwner:function(request, response){
        if(request.session.passport){
            return true;
        }
        else{
            return false;
        }
    },
    StatusUI:function(request,response){
        var authStatusUI = '<a href="/auth/facebook">Facebook login</a>';
        if(this.IsOwner(request, response)){
            authStatusUI = `${request.session.passport.user} | <a href="/logout">logout</a>`;
        }
        return authStatusUI;
    }
}