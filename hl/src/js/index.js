$(function(){
    // 首页知识竞答、学习园地暂未开发
    $(".correct a,.learn a").on("click",function(e){
        e.preventDefault();
        toastNew("暂未开放,尽情期待")
    })
    // 活动帖子列表页
    $(".activity-banner .btn").on("click",function(){
        $(".pop").fadeIn()
        $("html,body").css({
            "height": "100%",
            "overflow": "hidden"
        })
    })
    $(".pop .close,.pop .pop-btn").on("click",function(){
        $(".pop").fadeOut()
        $("html,body").css({
            "height": "auto",
            "overflow": "auto"
        })
    })

    $(".user-handle  .comment").on("click",function(){
        $(".comment-textarea").focus()
    })

    $(".btn-show").on("click",function(){
        $(".btns-list").toggle()
    })
    // 评论框字数提示
    $(".comment-textarea").on("input",function(){
        var $this = $(this)
        wordRemain($this,120)
    })
    //评论字数超限
    $(".comment-textarea").on("blur",function(){
        if($(this).val().length > 120){
            toastNew("评论字数超限")
            $(this).focus()
        }    
    })
    // 
    $(".comment-btn").on("click",function(){
        if($(".comment-textarea").val().length > 120){
            toastNew("评论字数超限")
            $(".comment-textarea").focus()
            return false
        }    
    })
    // 标题字数提示
    //文字限制,中文输入时会先将字母 放入输入框内，导致剩下最后一个可输入的字符时,无法输入中文汉字，所以改成bulr事件
    $(".title input").on("input",function(){
        var $this = $(this)
        wordRemain($this,16)
    })
    //标题字数超限
    $(".title input").on("blur",function(){
        if($(this).val().length > 16){
            toastNew("标题字数超限")
            $(this).focus()
            return false
        }    
    })
    // 内容字数提示
    $(".content textarea").on("input",function(){
        var $this = $(this)
        wordRemain($this,50)
    })
    // 内容超限
    $(".content input").on("blur",function(){
        if($(this).val().length > 50){
            toastNew("内容字数超限")
            $(this).focus()
        } 
    })
})
  // 敬请期待
function toastNew(text){
    $(".toast").text(text).show()
    setTimeout(function(){
        $(".toast").hide()
    },1000)
} 
// function toast(){
//     $(".toast").show()
//     setTimeout(function(){
//         $(".toast").hide()
//     },1000)
// }
// 字数限制
function wordRemain(ele,num){
    var len = ele.val().length;
    ele.siblings(".txt-tip").find("em").text(num - len )
}
// 返回
function backShow(){
    if($(window).height()  <= $(".date-div").height()){
        $(".static-back").hide()
        $(".fix-back").show()
        $(".my").css("padding-bottom",$(".fix-back").css("height"))
    }else{
        $(".static-back").show()
        $(".fix-back").hide()
        $(".my").css("padding-bottom",0)
    }
}