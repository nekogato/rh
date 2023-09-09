if (!("ontouchstart" in document.documentElement)) {
	document.documentElement.className += " no-touch";
	}

function doscroll(){
	
	var scrolltop = $(window).scrollTop();
	var hh = $(window).height();
	
	if(scrolltop>0){
		$("body").addClass("nottop")
	}else{
		$("body").removeClass("nottop")
	}
	
	$(".scrollin").not($(".scrollin_p .scrollin")).each(function(i){
		var $this = $(this);
		var mytop = $this.offset().top;
		var myh = $this.height();
		
		var dis = (scrolltop+hh)-mytop;
		
		if(dis>0 ){
			$this.removeClass("leavescreen");
			$this.addClass("onscreen");
		}else{
			$this.removeClass("onscreen");
			$this.addClass("leavescreen");
		}
	});
	
	$(".scrollin_p").each(function(i){
		var $this = $(this);
		var mytop = $this.offset().top;
		var myh = $this.height();
		
		var dis = (scrolltop+hh)-mytop;
		
		if(dis>0){
			
			$this.find(".scrollin").removeClass("leavescreen");
			$this.find(".scrollin").addClass("onscreen");
		}else{
			$this.find(".scrollin").removeClass("onscreen");
			$this.find(".scrollin").addClass("leavescreen");
		}
	});
	
	$(".scrollin.onscreen").not($(".scrollin_p .scrollin")).not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
		$(this).css({
			"-webkit-transition-delay": i*100+100+"ms",
			"transition-delay": i*100+100+"ms",
		})

		
		if($(this).hasClass("lessdelay")){
			$(this).css({
				"-webkit-transition-delay": i*100+30+"ms",
				"transition-delay": i*100+30+"ms",
			})
		}
		
		if($(this).hasClass("moredelay")){
			$(this).css({
				"-webkit-transition-delay": i*100+600+"ms",
				"transition-delay": i*100+600+"ms",
			})
		}
		
		if($(this).hasClass("nodelay")){
			$(this).css({
			"-webkit-transition-delay": (i-1)*100+100+"ms",
			"transition-delay": (i-1)*100+100+"ms",
			})
		}



		
		$(this).addClass("startani");
	});

	$(".scrollin_p").each(function(){
		$(this).find(".scrollin.onscreen").not($(".scrollin.onscreen.stop")).not($(".startani")).each(function(i){
			$(this).css({
				"-webkit-transition-delay": i*100+100+"ms",
				"transition-delay": i*100+100+"ms",
			})
				
			if($(this).hasClass("lessdelay")){
				$(this).css({
					"-webkit-transition-delay": i*20+30+"ms",
					"transition-delay": i*20+30+"ms",
				})
			}

			if($(this).hasClass("moredelay")){
				$(this).css({
					"-webkit-transition-delay": i*100+600+"ms",
					"transition-delay": i*100+600+"ms",
				})
			}
			
			if($(this).hasClass("nodelay")){
				$(this).css({
				"-webkit-transition-delay": (i-1)*100+100+"ms",
				"transition-delay": (i-1)*100+100+"ms",
				})
			}
			
			if($(this).hasClass("random")){
				$(this).css({
				"-webkit-transition-delay": Math.random()*1000+100+"ms",
				"transition-delay": Math.random()*1000+100+"ms",
				})
			}
			
			if($(this).hasClass("random2")){
				$(this).css({
				"-webkit-transition-delay": Math.random()*500+100+"ms",
				"transition-delay": Math.random()*500+100+"ms",
				})
			}
			
			$(this).addClass("startani");


			if($(this).is($(".home_about_section a .scrollin"))){
				if($(this).parents(".char").is(':last-child')){
					var $a = $(this).parents("a")
					setTimeout(function(){
						$a.addClass("active")
					},i*20+900)
				}
			}
		});
	})
	
	
	$(".scrollin.leavescreen").each(function(i){
		$(this).css({
			"-webkit-transition-delay": 0+"ms",
    		"transition-delay": 0+"ms",
		})
		$(this).removeClass("startani");
	});
	
	$(".scrollin.stop").each(function(i){
		$(this).css({
			"-webkit-transition-delay": 0+"ms",
    		"transition-delay": 0+"ms",
		})
		$(this).addClass("startani");
	});
	
}


var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
	  if (!uniqueId) {
		uniqueId = "Don't call this twice without a uniqueId";
	  }
	  if (timers[uniqueId]) {
		clearTimeout (timers[uniqueId]);
	  }
	  timers[uniqueId] = setTimeout(callback, ms);
	};
})();


function dolayout(){

}

function dosize(){


}

function do_pushstate(link){
	var currenturl = window.location.href;

	if(currenturl.indexOf(link)>0){
	}else{
		changeworld();
	}

	function changeworld(){

		ajaxloading_start = true;
		$("body").addClass("ajaxloading_start");

		var obj={
			target:"world"
		}
		
		if (history.pushState) {
			History.pushState(obj, document.title, link);
		} else {
			document.location.link = link;
		}
	}

	$(".dropdown_btn").removeClass("close");
	$("body").removeClass("openmenu");
}


function check_pushstate_click(){
	$( document ).on( "click", ".main_menu > li > a, .header_logo, .home_col_4 a", function() {
		
		var myhref = $(this).attr("href");
		do_pushstate(myhref)

		return false;
	});
};

function init_event(){

	$(".dropdown_btn").mouseenter(function(){
		customCursor.disable = true;
		$(".custom-cursor").addClass("disable")
		$(".custom-cursor").addClass("hide")
	})

	$(".dropdown_btn").mouseleave(function(){
		if($(".home_content").length && !$("body").hasClass("openmenu")){
			customCursor.disable = false;
			$(".custom-cursor").removeClass("disable")
			$(".custom-cursor").removeClass("hide")
		}
	})


	
	
	$(".dropdown_btn").click(function(){
		if($(".dropdown_btn").hasClass("close")){
			$(".dropdown_btn").removeClass("close");
			$("body").removeClass("openmenu");
			customCursor.disable = false;
			$(".custom-cursor").removeClass("disable")
			$(".custom-cursor").removeClass("hide")
		}else{
			$(".dropdown_btn").addClass("close");
			$("body").addClass("openmenu");
			customCursor.disable = true;
			$(".custom-cursor").addClass("disable")
			$(".custom-cursor").addClass("hide")
		}
		return false;
	})
	
}

function statechange(){
	
		
	History.Adapter.bind(window,'statechange',function(){
		var body = $("html, body");
		var mystate = History.getState();
		var target = mystate.target;
		var fullUrl=mystate.url;
		var shortUrl=fullUrl.substring(fullUrl.lastIndexOf("/")+1,fullUrl.length);

		setTimeout(function(){

			$( ".load_content" ).load( fullUrl+" .load_content > *", function() {
				console.log("ajax loaded")

				var body = $("html, body");
				body.stop().animate({scrollTop:0}, 300, 'swing', function() { });

				if($(".black_content").length){
					$("body").addClass("black_body")
				}else{
					$("body").removeClass("black_body")
				}

				if($(".home_content").length){
					$("body").addClass("home_body")
					$("canvas").stop().animate({opacity:1}, 1200, 'swing', function() { });

					resumeUpdate();
					// isUpdateDisabled=false;
					// customCursor.disable = false;
					// $(".custom-cursor").removeClass("disable")
					// $(".custom-cursor").removeClass("hide")
					// $(".custom-cursor").removeClass("show-transition")
					
				}else{
					$("body").removeClass("home_body")
					$("canvas").stop().animate({opacity:0}, 1200, 'swing', function() { });

					haltUpdate()
					// isUpdateDisabled=true;
					// customCursor.disable = true;
					// $(".custom-cursor").addClass("disable")
					// $(".custom-cursor").addClass("hide")
				}
				
				
				
				setTimeout(function(){
					doscroll();
					ajaxloading_start= false;
					$("body").addClass("ajaxloading_end");
					$("body").removeClass("ajaxloading_start");
					
					dosize();
					dolayout();
				
				},600)
				
				setTimeout(function(){
					ajax_function();
					ajax_event();
				},1200)

				return false;
			});

		},600)
	});
}

function ajax_function(){
	/* function that would call at the beginning and after ajax load */

	var currenturl = window.location.href;

	$(".main_menu > li > a").each(function(){
		$(".main_menu > li > a.active").removeClass("active")
		if(currenturl.indexOf($(this).attr("href"))){
			$(this).addClass("active")
		}
	})

	if($(".home_content").length){
		customCursor.disable = false;
		$(".custom-cursor").removeClass("disable")
		$(".custom-cursor").removeClass("hide")
	}else{
		customCursor.disable = true;
		$(".custom-cursor").addClass("disable")
		$(".custom-cursor").addClass("hide")
	}



}

function ajax_event(){
	/* event that would bind at the beginning and after ajax load */


	$(".art_popup_close").unbind("click").click(function(){
		if($(".art_popup").hasClass("active")){
			$(".art_popup").removeClass("active");
			$(".art_popup").stop().fadeOut(600,function(){
				$(".art_popup iframe").stop().fadeOut();
			});
		}
		return false;
	})

	$(".art_popup_open").unbind("click").click(function(){
		var mytarget = $(this).attr("data-target");
		if(!$(".art_popup[data-id='"+mytarget+"']").hasClass("active")){
			$(".art_popup[data-id='"+mytarget+"']").addClass("active");
			$(".art_popup[data-id='"+mytarget+"']").stop().fadeIn(600,function(){
				$(".art_popup[data-id='"+mytarget+"'] iframe").stop().fadeIn();
			});
		}
		return false;
	})

	$(".view_icon_wrapper ul").mouseenter(function(){
		customCursor.disable = true;
		$(".custom-cursor").addClass("disable")
		$(".custom-cursor").addClass("hide")
	})

	$(".view_icon_wrapper ul").mouseleave(function(){
		if($(".home_content").length && !$("body").hasClass("openmenu") && $(".view_icon_wrapper li[data-view='tunnel']").hasClass("active")){
			customCursor.disable = false;
			$(".custom-cursor").removeClass("disable")
			$(".custom-cursor").removeClass("hide")
		}
	})
	
	$(".view_icon_wrapper li").unbind("click").click(function(){
		$(".view_icon_wrapper li").removeClass("active")
		$(this).addClass("active");
		if($(".view_icon_wrapper li[data-view='tunnel']").hasClass("active")){
			$(".home_col_4").stop().fadeOut(function(){
				customCursor.disable = false;
				$(".custom-cursor").removeClass("disable")
				$(".custom-cursor").removeClass("hide")
			});
		}else{
			$(".home_col_4").stop().fadeIn(function(){
				customCursor.disable = true;
				$(".custom-cursor").addClass("disable")
				$(".custom-cursor").addClass("hide")
				$(".home_col_4").addClass("finish")
			});
		}
	})
}

function init_function(){
	statechange();
	doscroll();
}

$(function(){
	dolayout();
	dosize();
	init_event();
	init_function();
	check_pushstate_click();
});

$(window).on("load", function () {
	dosize();
	doscroll();
	ajax_function()
	ajax_event()
	$("body").addClass("loadfinish")
});

$(window).on('resize', function() {
	dosize();
	waitForFinalEvent(function(){
		dosize();
		doscroll();
	}, 300, "some unique string");
});

$(window).on('scroll', function() {
	doscroll();
});
