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



function check_pushstate_click(){
	$( document ).on( "click", ".main_menu > li > a", function() {

		var currenturl = window.location.href;
		
		var myhref = $(this).attr("href");


		if(currenturl.indexOf($(this).attr("href"))>0){
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
				History.pushState(obj, document.title, myhref);
			} else {
				document.location.href = myhref;
			}
		}

		$(".dropdown_btn").removeClass("close");
		$("body").removeClass("openmenu");

		return false;
	});
};

function init_event(){
	
	
	$(".dropdown_btn").click(function(){
		if($(".dropdown_btn").hasClass("close")){
			$(".dropdown_btn").removeClass("close");
			$("body").removeClass("openmenu");
			
		}else{
			$(".dropdown_btn").addClass("close");
			$("body").addClass("openmenu");
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

}

function ajax_event(){
	/* event that would bind at the beginning and after ajax load */


	$(".art_popup_close").click(function(){
		if($(".art_popup").hasClass("active")){
			$(".art_popup").removeClass("active");
			$(".art_popup").stop().fadeOut(600,function(){
				$(".art_popup iframe").stop().fadeOut();
			});
		}
		return false;
	})

	$(".art_popup_open").click(function(){
		var mytarget = $(this).attr("data-target");
		if(!$(".art_popup[data-id='"+mytarget+"']").hasClass("active")){
			$(".art_popup[data-id='"+mytarget+"']").addClass("active");
			$(".art_popup[data-id='"+mytarget+"']").stop().fadeIn(600,function(){
				$(".art_popup[data-id='"+mytarget+"'] iframe").stop().fadeIn();
			});
		}
		return false;
	})
}

function init_function(){
	statechange();
	ajax_function()
	ajax_event()
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
