$(function() {
	var returnPageTop = $(".returnPageTop");

	//下にスクロールしたらヘッダの高さを縮小させる
	var startPos = 0;
	$(window).scroll(function(){
		var currentPos = $(this).scrollTop();
		//ページトップへスクロールして戻る
		if (currentPos > 400) {
			returnPageTop.fadeIn();
		} else {
			returnPageTop.fadeOut();
		}
	});

	//ページトップへスクロールして戻る
	returnPageTop.click(function () {
		$('body, html').animate({ scrollTop: 0 }, 1000, "swing");
		return false;
	});
});