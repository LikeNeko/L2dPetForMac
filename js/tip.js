window.$ = window.jQuery = require("./js/jq");
(function ($) {
    $.fn.initTips = function (option) {
        var defaults = {
            title: "toastrTips",
            message:"<p>mmm</p><p>mmm</p>",
            duration:5000,
            space:8,
            firstSpace:8,
            limit:4,
            margin:15,
            direction:'right bottom',
            timingFun:'ease',
            width:'auto',
            toastType:'info',
            type:'click',
            action: function () {},
        }
        var options = $.extend(defaults,option);
        var firstDirection = direction(options.direction)[0].trim().toString();
        var lastDirection = direction(options.direction)[1].trim().toString();
        var minus = "";
        if (firstDirection == 'left') {
            minus = "-";
        } else {
            minus = "";
        }
        if ($('.ez_tips').size() == 0 || $('.ez_tips').size() < options.limit) {

            var container = "<div class='ez_tips "+options.toastType+"' style="+firstDirection+":"+options.margin+"px;transform:translateX("+minus+"110%)></div>"

            var head = "<div class='title clearfix'><i class='tips_icon_l fl'></i><i class='tips_icon_r close'></i></div>";

            var content = "<div class='tips-message'></div>"

            var newHead = $(head).append(options.title);

            var newContent = $(content).append(options.message)

            var newContainer = $(container).append(newHead,newContent);

            setTimeout(function () {
                var timer;
                function timeOut () {
                    $(newContainer).removeClass('active');
                    setTimeout(function () {
                        $(newContainer).remove();
                    }, 700)
                };
                timer = setTimeout(timeOut, options.duration);
                var newTimes;
                var times = Date.now();
                $(newContainer).css({
                    'transition-timing-function':options.timingFun,
                    'width':options.width,
                });
                var height = $(newContainer).outerHeight(true);
                var len = $('.ez_tips').size();
                if (len >= 2) {
                    for (var i = 1; i < len; i++) {
                        if (!$('.ez_tips').hasClass('length1')) {
                            $(newContainer).css(lastDirection,options.firstSpace + 'px');
                            $(newContainer).addClass('active length1');
                            break;
                        } else if (!$('.ez_tips').hasClass('length'+ (i+1))) {
                            $(newContainer).css(lastDirection,i * height + options.space * i + options.firstSpace + 'px');
                            $(newContainer).addClass('active length'+(i+1));
                            break; // break涓€瀹氳鍔�,鍚﹀垯姣忔鐐瑰嚮閮戒細寰幆鍒扮粨鏉�,瀵艰嚧涓€涓洰鏍嘾iv鍙兘鍚屾椂鏈塴ength1 length2.....绛夊涓被鍚�
                        }
                    }
                } else {
                    $(newContainer).css(lastDirection,options.firstSpace + 'px');
                    $(newContainer).addClass('active length1');
                }
                $(newContainer).on('mouseenter', function (event) {
                    event.stopPropagation();
                    $(newHead).find('.close').addClass('active');
                    clearTimeout(timer);
                    newTimes = Date.now() - times;
                });
                $(newContainer).on('mouseleave', function (event) {
                    event.stopPropagation();
                    $(newHead).find('.close').removeClass('active');
                    timer = setTimeout(timeOut, options.duration - newTimes);
                });
                $(newHead).find('.close').click(function () {
                    $(newContainer).removeClass('active');
                    setTimeout(function () {
                        $(newContainer).remove();
                    },700)
                });
                if (options.action) {
                    $(newContent).css('cursor','pointer').on(options.type,options.action);
                }
            },1);

            $(this).append(newContainer);
        } else {
            return;
        }

        function direction (params) {
            var index = params.indexOf(" ");
            var result = [];
            var firstDirection = params.substring(0,index);
            var lastDirection = params.substring(index);
            result.push(firstDirection,lastDirection);
            return result;
        }
    }
})(jQuery);