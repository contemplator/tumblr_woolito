var posts = [];
var current_posts_number = 0;
var modalHidden;
var selected_tag;
var preview_timer;

$(function () {
  console.log("width: " + $(window).width());
  console.log("user agent: " + navigator.userAgent);
  if (ismobile()) {
    location.href = "index-mobile";
  } else {
    if (ismobile_size()) {
      location.href = "index-mobile";
    }
  }

  $(window).resize(function () {
    if (ismobile_size()) {
      location.href = "index-mobile";
    }
  });

  query_all_posts();
  // query_posts("");

  $("#cboxPrevious").click(function () {
    prePost($(this).attr('data-post-id'));
  });

  $("#cboxNext").click(function () {
    nextPost($(this).attr('data-post-id'));
  });

  $(window).bind('scroll resize', function () {
    var $this = $(this);
    var $this_Top = $this.scrollTop();
    if ($this_Top > 120) {
      $("#effect").addClass("fixed-menu");
      $(".grid").css("margin-top", ($("#effect").height()) + "px");
    } else {
      $("#effect").removeClass("fixed-menu");
      $(".grid").css("margin-top", "0px");
    }
  });
});

function iframeChange() {
  console.log("iframeChange");
  $("#preview_youtube").attr("class", "preview_hide");
  $("#preview_youtube figure iframe").attr("src", "");
}

function ismobile() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  } else {
    return false;
  }
}

function ismobile_size() {
  var width = $(window).width();
  var href = location.href;
  var index = href.lastIndexOf("/") + 1;
  href = href.substring(index);
  // console.log(width + ", " + href);
  if (width <= 768) {
    return true;
    // location.href = "works-mobile.html";
  } else {
    return false;
    // location.href = "works.html";
  }
}

function prePost(id) {
  var post = query_post(id);
  initModal();
  setPhoto(post);
};

function nextPost(id) {
  initModal();
  var post = query_post(id);
  setPhoto(post);
}

function showModal(id) {
  var post = query_post(id);
  var type = post.type;
  switch (type) {
    case "photo":
      initModal();
      setPhoto(post);
      break;
    default:
      break;
  }
  $('#myModal').modal('show');
  if (modalHidden != null) {
    modalHidden = null;
  }

  modalHidden = $('#myModal').on('hidden.bs.modal', function () {
    document.location.href = "#" + id;
    // var thisPosition = $('#'+id).offset().top;
    // $("body").animate({ scrollTop: thisPosition }, 1000);
  });
}

function initModal() {
  var title = $(".modal-title")[0];
  var body = $(".modal-body")[0];
  var footer = $(".modal-footer")[0];
  $(title).html("");
  $(body).html("");
  $(footer).html("");
}

function query_post(id) {
  for (var i = 0; i < posts.length; i++) {
    post = posts[i];
    if (post.id == id) {
      return post;
    }
  }
}

function setPhoto(post) {
  var title = $(".modal-title")[0];
  var body = $(".modal-body")[0];
  var footer = $(".modal-footer")[0];
  $(title).text("");
  var photos = post.photos;
  for (var i = 0; i < photos.length; i++) {
    var imgae_url = photos[i].original_size.url;
    var img_element = $("<img>");
    img_element.attr("src", imgae_url);
    $(body).append(img_element);
  }
  // $(body).html("<img src=\"" + post["photo-url-500"] + " \">");
  var footer_html = post["caption"] + '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + '<a href="/post/' + post.id + ' target=\"_blank\""><button type="button" class="btn btn-primary">觀看全文</button></a>';

  $(footer).html(footer_html);

  var current_post_index = 0;
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].id == post.id) {
      current_post_index = i;
    }
  }
  var previous_post_index = current_post_index - 1;
  var next_post_index = current_post_index + 1;
  $("#cboxPrevious").attr("data-post-id", posts[previous_post_index].id);
  $("#cboxNext").attr("data-post-id", posts[next_post_index].id);

  // $(modal .modal-header .modal title).text("Post Photo");
}

function setVideo(post) {

}

function readmore(posts) {
  showLoading();
  var new_posts_number = current_posts_number + 6;
  if (posts.length - new_posts_number <= 0) {
    new_posts_number = posts.length;
  }
  render_posts(new_posts_number, posts);
}

function query_all_posts() {
  var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
  $(".grid").html('<div class="grid-sizer"></div>');

  $.ajax({
    url: "https://api.tumblr.com/v2/blog/woolito.tumblr.com/posts",
    type: "GET",
    dataType: 'jsonp',
    data: {
      api_key: key
    }
  }).done(function (data) {
    var data_json = data.response.posts;
    for (var i = 0; i < data_json.length; i++) {
      try {
        tags = data_json[i].tags;
        if (tags == undefined) {
          tags = [];
        };
        if (tags.indexOf("home") > -1 || tags.indexOf("onlyhome") > -1) {
          posts.push(data_json[i]);
        }
      } catch (err) {
        console.log(err);
        continue;
      }
    }

    if (!posts) {
      $("#total_post").text("0");
    } else {
      $("#total_post").text(posts.length);
    }

    query_posts("");
  });
}

function query_posts(tag) {
  var selected_posts = [];
  var tags = [];

  for (var i = 0; i < posts.length; i++) {
    if (tag == "") {
      selected_posts = posts;
      continue;
    }
    try {
      tags = posts[i].tags;
      if (tags == undefined) {
        tags = [];
      };
      if (tags.indexOf(tag) > -1) {
        selected_posts.push(posts[i]);
      }
    } catch (err) {
      console.log(err);
      continue;
    }
  }

  if (!posts) {
    $("#total_post").text("0");
  } else {
    $("#total_post").text(selected_posts.length);
  }
  current_posts_number = 0;
  readmore(selected_posts);
}

function render_posts(number_post, posts) {
  $(".grid").html('<div class="grid-sizer"></div>');

  if (posts.length > 0) {
    for (var i = current_posts_number; i < number_post; i++) {
      var post_type = posts[i].type;
      var post_html = null;
      switch (post_type) {
        case "video":
          post_html = render_video(posts[i]);
          break;
        case "text":
          post_html = render_text(posts[i]);
          break;
        case "photo":
          post_html = render_photo(posts[i]);
          break;
        default:
          break;
      }

      $(".grid").append(post_html);
      $(".grid").imagesLoaded(function () {
        $(".grid").masonry({
          columnWidth: '.grid-sizer',
          itemSelector: '.grid-item',
          percentPosition: true
        });
      });
    }
    current_posts_number = number_post;
  }

  setTimeout(function () {
    $(".grid").masonry();
    $(".photo-wrap").click(function (event) {
      event.preventDefault();
      var id = $(this).parent().parent().attr("id");
      showModal(id);
    });
  }, 1500);

  $(".grid").imagesLoaded().progress(function () {
    $(".grid").masonry('reloadItems');
  });

  if (current_posts_number == posts.length) {
    showLoadEnd();
  } else {
    showLoadMore();
  }

  $(".shortcut").mouseenter(function () {
    clearTimeout(preview_timer);
    if ($("#preview_youtube figure iframe").attr("src") == "") {
      showPreview(this);
    }
  });

  // $("#preview_youtube").mouseenter(function(e){
  //     clearTimeout(preview_timer);
  // });

  // $("#preview_youtube").mouseleave(function(e){
  //     preview_timer = setTimeout(hidePreview, 60);
  // });

  $(".shortcut").mouseleave(function (e) {
    preview_timer = setTimeout(hidePreview, 60);
  });

  $('[data-toggle="tooltip"]').tooltip();
}

function hidePreview() {
  $("#preview_youtube").attr("class", "preview_hide");
  $("#preview_youtube figure iframe").attr("src", "");
}

function showPreview(element) {
  element = $(element);
  preview = $("#preview_youtube");
  var e_top = element.offset().top;
  var e_left = element.offset().left;
  var e_height = element.height();
  var e_width = element.width();
  var p_height = preview.height();
  var p_width = preview.width();
  var w_width = $(window).width();
  $("#preview_youtube").attr("class", "preview_show");
  $("#preview_youtube").css("top", (e_top - (p_height - e_height) - 10) + "px");
  $("#preview_youtube").css("left", (e_left + e_width) + "px");

  if ((e_left + e_width + p_width) > w_width) {
    $("#preview_youtube").css("left", (e_left - p_width) + "px");
  }

  if ($("#preview_youtube").offset().top < $(window).scrollTop()) {
    $("#preview_youtube").css("top", $(window).scrollTop() + "px");
  }

  // var figure_element = $('<figure></figure>');
  // var iframe_element = $('<iframe class="youtube_iframe" frameborder="0" allowfullscreen=""></iframe>');
  var iframe_element = $("#preview_youtube figure iframe");
  iframe_element.attr("src", "https://www.youtube.com/embed/" + element.attr("youtube_id") + "?feature=oembed&amp;enablejsapi=1&amp&autoplay=1&loop=0;controls=0;origin=https://safe.txmblr.com&amp;wmode=opaque&showinfo=0");
  // figure_element.html(iframe_element);
  // preview.html(figure_element);
}

function render_photo(post) {
  var article = $("<div></div>");
  article.attr("id", post.id);
  article.addClass("type_photo grid-item");
  article.attr("rel", post['post_url']);
  var article_content = $('<div class="article-content"></div>');
  var photo_wrap = $('<div class="photo-wrap post"></div>');
  var photo_post = $('<div class="photo--post"></div>')
  for (var i = 0; i < post.photos.length; i++) {
    var photo_link = $('<a href="' + post['post_url'] + ' target=\"_blank\""></a>');
    var photo_img = $('<img src="' + post.photos[i].original_size.url + '" alt="' + post.slug + '">');
  }

  photo_link.append(photo_img);
  photo_post.append(photo_link);
  photo_wrap.append(photo_post);
  var caption = $('<div class="caption">' + post['summary'] + '</div>');
  article_content.append(photo_wrap).append(caption);
  var icon = render_icon(post);
  article_content.append(icon);
  article.append(article_content);
  return article;
}

function render_video(post) {
  var article = $("<div></div>");
  article.attr("id", post.id);
  article.addClass("type_video grid-item");
  article.attr("rel", post['post_url']);
  var article_content = $('<div class="article-content"></div>');
  var video_stage = $("<div class='video-stage'></div>");
  var video_container = $("<div class='video-container ready video' id='" + post.id + "'></div>");
  // var iframe = render_iframe(post);
  var shortcut = $('<div class="video-shortcut"></div>')
  var shortcut_img = $('<img >');
  shortcut_img.attr("src", post.thumbnail_url);
  shortcut.append(shortcut_img);
  // var shortcut = video_shortcut(post);
  // video_container.append(shortcut);
  video_container.append(shortcut);
  video_stage.append(video_container);
  var caption = $('<div class="caption">' + post['caption'] + '</div>');
  article_content.append(video_stage).append(caption);
  var icon = render_icon(post);
  article_content.append(icon);
  article.append(article_content);
  return article;
}

function render_text(post) {
  var article = $("<div></div>");
  article.attr("id", post.id);
  article.addClass("type_text grid-item");
  article.attr("rel", post['post_url']);
  var article_content = $("<div></div>");
  article_content.addClass("article_content");
  var title = $("<h2></h2>");
  var title_link = $("<a href='" + post['post_url'] + "' target=\"_blank\" title='點擊觀看作品介紹' data-toggle='tooltip' data-placement='right' >" + post.slug + "</a>");
  title.append(title_link);
  var body = post['body'];
  body = analysis_caption_iframe(post.body, post.id);
  if (body.indexOf("<!-- more -->") > -1) {
    var start_index = body.indexOf("<!-- more -->");
    body = body.substring(0, start_index);
    body += '<a href="' + post['post_url'] + '" target=\"_blank\" class="readmore">KEEP READING</a>';
  }
  article_content.append(title).append(body);
  var icon = render_icon(post);
  article_content.append(icon);
  article.append(article_content);
  return article;
}

function analysis_caption_iframe(caption, post_id) {
  if (!(caption.indexOf("youtube_iframe") > -1)) {
    return caption;
  }
  var patt = /https:\/\/www.youtube.com\/embed\/(\w+)\?/i;
  var patt2 = /<figure(.*)>(.*)<\/figure>/i;
  var youtube_id = caption.match(patt)[1];
  var link_element = $('<a target="_blank"></a>');
  link_element.attr("href", "https://woolito.tumblr.com/post/" + post_id + "/");
  var shortcut_element = $("<img >");
  shortcut_element.addClass("shortcut");
  shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/hqdefault.jpg");
  shortcut_element.attr("youtube_id", youtube_id);
  shortcut_element.attr("data-toggle", "tooltip");
  shortcut_element.attr("data-placement", "bottom");
  shortcut_element.attr("title", "點擊觀看作品介紹");
  link_element.html(shortcut_element);
  link_element = link_element.prop('outerHTML');

  caption = caption.replace(patt2, link_element);
  return caption;
}

function render_icon(post) {
  var ul = $("<ul class='icons'></ul>");
  var li_link = $('<li class="link"><a href="' + post['post_url'] + '" target=\"_blank\" title="View Post" class="social-eye"></a></li>');
  var li_like = $('<li class="like"><div class="like_button" data-post-id="' + post.id + '" data-blog-name="woolito" id="like_button_' + post.id + '"></div></li>');
  var iframe = $('<iframe id="like_iframe_' + post.id + '" src="https://assets.tumblr.com/assets/html/like_iframe.html?_v=c301660e229be2b44e2e912486577f3c#name=woolito&post_id=' + post.id + '&color=black&rk=' + post['reblog_key'] + '&root_id=' + post.id + '" scrolling="no" class="like_toggle" allowtransparency="true" width="16" height="16" frameborder="0" name="like_iframe_' + post.id + '"></iframe>');
  li_like.find(".like_button").append(iframe);
  var li_reblog = $('<li class="reblog"><i class="reblog-icon"><a targer="_blank" href="https://www.tumblr.com/reblog/' + post.id + '/' + post['reblog_key'] + '" class="reblog_button" style="display:block; width:16px; height:16px;"><svg width="100%" height="100%" viewBox="0 0 21 21" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" fill="#000"><path d="M5.01092527,5.99908429 L16.0088498,5.99908429 L16.136,9.508 L20.836,4.752 L16.136,0.083 L16.1360004,3.01110845 L2.09985349,3.01110845 C1.50585349,3.01110845 0.979248041,3.44726568 0.979248041,4.45007306 L0.979248041,10.9999998 L3.98376463,8.30993634 L3.98376463,6.89801007 C3.98376463,6.20867902 4.71892527,5.99908429 5.01092527,5.99908429 Z"></path><path d="M17.1420002,13.2800293 C17.1420002,13.5720293 17.022957,14.0490723 16.730957,14.0490723 L4.92919922,14.0490723 L4.92919922,11 L0.5,15.806 L4.92919922,20.5103758 L5.00469971,16.9990234 L18.9700928,16.9990234 C19.5640928,16.9990234 19.9453125,16.4010001 19.9453125,15.8060001 L19.9453125,9.5324707 L17.142,12.203"></path></svg></a></i></li>');
  var li_share = $('<li class="sharer"><a class="social-export"></a><div class="sharer-wrap"><ul><li class="facebook"><a href="https://www.facebook.com/sharer.php?u=' + post['post_url'] + '" title="Share on Facebook" class="social-facebook" target="_blank" ></a></li><li class="gplus"><a href="https://plus.google.com/share?url=' + post['post_url'] + '" title="Share on Google +" class ="social-gplus" target="_blank"></a></li><li class="pinterest" ><a href="https://pinterest.com/pin/create/button/?url=' + post['post_url'] + '&amp;media=https://67.media.tumblr.com/avatar_fbc2eabcb706_128.png" title="Share on Pinterest" class="social-pinterest" target="_blank"></a></li></ul></div></li>');
  ul.append(li_link).append(li_like).append(li_reblog).append(li_share);
  return ul;
}

function video_shortcut(post) {}

function render_iframe(post) {
  var video_source = (post.player[0].embed_code);

  // if (video_source.indexOf("youtube") > -1) {
  //     video_source = post['video-source'];
  //     var div_element = $('<div id="iframe_'+post.id+'" class="post_iframe">');
  //     var start_index = video_source.lastIndexOf("/")+1;
  //     var youtube_id = video_source.substring(start_index);
  //     var img_element = $('<img class="labnolIframe" src="https://i.ytimg.com/vi/'+youtube_id+'/hqdefault.jpg">');
  //     var click_element = $('<div class="play-button" onclick="labnolIframe_order(\'iframe_'+post.id+'\', \''+youtube_id+'\')"></div>');
  //     div_element.append(img_element).append(click_element);
  //     return div_element;
  // }

  var url = post.video_url;
  var html = $('<iframe src="' + url + '" class="embed_iframe tumblr_video_iframe" scrolling="no" frameborder="0" data-can-gutter data-can-resize allowfullscreen mozallowfunscreen webkitallowfullscreen></iframe>')
  return html;
}

function showLoading() {
  $(".load-more-loading").css("display", "inline");
  $(".load-more-end").css("display", "none");
  $(".load-more-text").css("display", "none");
}

function showLoadEnd(argument) {
  $(".load-more-loading").css("display", "none");
  $(".load-more-end").css("display", "inline");
  $(".load-more-text").css("display", "none");
}

function showLoadMore() {
  $(".load-more-loading").css("display", "none");
  $(".load-more-end").css("display", "none");
  $(".load-more-text").css("display", "inline");
}