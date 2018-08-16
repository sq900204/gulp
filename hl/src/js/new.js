$(function(){
    // 上传文件
    var img_list = [],video_list = []
    $(".file").on("change",function(){
        var file = document.getElementById("file").files[0]
        if(!file) return false
        var url = URL.createObjectURL(file)
        // 解决删除文件无法二次上传
        $(this).val('')
        // 图片
        if(file.type.indexOf("image") != -1){
            // 图片不可超过9张
            if(img_list.length == 8){
                $(".add-li").hide()
            }
            var html =  '<li class="fl">'+
                        '<div class="img-div"><img src="'+url+'" alt=""></div>'+
                        '<span class="delete"></span>'+
                    '</li>'
            $(".upload-div .add-li").before(html)
            img_list.push(file)
        }else if(file.type.indexOf("video") != -1){

            // 视频
            // 如果上传了视频不让再上传图片
            if(img_list.length >= 1){
                toastNew("已上传了图片，不可再上传视频")
                return false
            }
            var html =  '<li class="fl video">'+
                        '<video src="'+url+'"  style="width:100%;height:auto" x5-playsinline="true" webkit-playsinline="true" playsinline></video>'+
                        '<span class="play"></span>'+
                        '<span class="delete"></span>'+
                    '</li>'
            $(".upload-div .add-li").before(html)
            $(".add-li").hide()
            video_list.push(file)
        }else{
            toastNew("文件格式不对")
           
        }
    })

    // 删除图片
    $(".upload-div").on("click",".delete",function(e){
        e.preventDefault()
        var index =  $(this).parents("li").index()
        var $this = $(this)
        $(".pop").fadeIn()
        $(".pop .confirm").on("click",function(e){
            $(".pop").fadeOut()
            img_list.splice(index,1)
            $this.parents("li").remove()
            $(".add-li").show()
        })
        
        
    })
    // 关闭视频播放窗口
    $(".video-pop .close").on("click",function(){
        $(".video-pop").hide()
        document.getElementById("pop-video").pause()
    })

    // // 视频预览
    $(".upload-div").on("click",".play",function(){ 
        var url = $(this).siblings("video").attr("src")
        $(".video-pop").fadeIn()
        $(".video-pop video").attr("src",url)  
        setTimeout(function(){
            document.getElementById("pop-video").play()
        },100)
    })
    // 图片预览
    $(".upload-div").on("click","img",function(){
        var index =  $(this).parents("li").index()
        var len = img_list.length
        $(".swiper-pop").fadeIn()
        for(var i = 0;i<img_list.length;i++){
        
            var html  = ' <div class="swiper-slide">'+
                        '<img src="'+URL.createObjectURL(img_list[i]) +'" alt="">'+
                    '</div>'
            $(".swiper-wrapper").append(html)      
        }
        $(".page .total").text('/'+len)
         //   轮播图
        var mySwiper = new Swiper ('.swiper-container', {
            observer: true,
            observerParent: true,
            on: {
                slideChangeTransitionEnd: function(swiper){
                var index = mySwiper.activeIndex +1
                  $(".page .index").text(index)
                },
              }
        }) 
        mySwiper.slideTo(index, 1000, false)
        $(".page .index").text(index+1)
        
    })
    // 关闭图片预览  
    $(".swiper-pop .close").on("click",function(){
        $(this).parents(".swiper-pop").hide()
        $(".swiper-container").remove()
        var html  = '   <div class="swiper-container"> <div class="swiper-wrapper"></div> </div>'
        $(".swiper-pop").append(html)
    })

    // 发布
    $(".btn").on("click",function(){
       if($(".new-wrapper .title input").val().length > 16 ){
            toastNew("标题字数超限")
            $(".new-wrapper .title input").focus()
            return false
       }
       if($(".new-wrapper .content textarea").val().length > 50 ){
            toastNew("内容字数超限")
            $(".new-wrapper .content textarea").focus()
            return false
        }
        $(".loading").fadeIn()
    })
  })
//   totast
function toastNew(text){
    $(".toast").text(text).show()
    setTimeout(function(){
        $(".toast").hide()
    },1000)
} 