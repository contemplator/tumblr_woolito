// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var product_youtube_video;

function onYouTubeIframeAPIReady() {
	console.log("Youtube API is ready");
	// window.onload = function () {
	// 	hospital = new YT.Player('hospital', {
	// 		videoId: 'S2kSogoVzu4',
	// 		events: {
	// 			'onReady': onPlayerReady,
	// 			'onStateChange': onPlayerStateChange
	// 		}
	// 	});
	// 	hospital_m = new YT.Player('hospital_m', {
	// 		videoId: 'S2kSogoVzu4',
	// 		events: {
	// 			'onReady': onPlayerReady,
	// 			'onStateChange': onPlayerStateChange
	// 		}
	// 	});
	// 	jazz = new YT.Player('jazz', {
	// 		videoId: 'v5OtBb8mo_U',
	// 		events: {
	// 			'onReady': onPlayerReady,
	// 			'onStateChange': onPlayerStateChange
	// 		}
	// 	});
	// 	jazz_m = new YT.Player('jazz_m', {
	// 		videoId: 'v5OtBb8mo_U',
	// 		events: {
	// 			'onReady': onPlayerReady,
	// 			'onStateChange': onPlayerStateChange
	// 		}
	// 	});	
	// }
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	console.log("video player is ready");
// event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
	console.log("player's state changes");
// if (event.data == YT.PlayerState.PLAYING && !done) {
//   setTimeout(stopVideo, 6000);
//   done = true;
// }
}
function stopVideo() {
	player.stopVideo();
}

function labnolIframe(){
	var video_id = this.id;
	console.log(video_id);
	product_youtube_video = new YT.Player(video_id, {
		videoId: video_id,
		autoplay: true,
		playerVars : {
			'autoplay' : 1,
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function labnolIframe_order(element_id, video_id){
	console.log("ads");
	product_youtube_video = new YT.Player(element_id, {
		videoId: video_id,
		autoplay: true,
		playerVars : {
			'autoplay' : 1,
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}