var selected_tag = null; // 紀錄目前所選擇的 tag
var top_posts = []; // 置頂的作品
var posts = []; // 儲存目前所 query 到的 posts
var no_more_post = false; // render_posts 是否已經到底，但是如果有 query 到新的作品
var render_post_length = 0; // 所有經過 render_posts 判斷的作品
var show_post_length = 0; // 目前頁面上顯示的作品數
var offset = 0; // query api 開始撈作品的順序
var is_query_done = false; // 是否 query 到最後一篇作品
var last_scroll_top = 0;
var is_selector_open = false;

var $alert; // 提示訊息

$(function () {
  get_url_parameters();
  initSelector();
  $("#selector").click(runEffect);
  query_top_posts();
  onScrollEvent();
  // query_tumblr_api(0);
});

/**
 * 綁定使用者上下捲動的事件，用於固定上方的篩選器
 */
function onScrollEvent() {
  $(window).bind('scroll resize', function (event) {
    var $this = $(this);
    var $this_Top = $this.scrollTop();

    // 若靠近最底下 800px 的話
    if (($(document).height() - $this.height() - $this.scrollTop()) <= 800) {
      render_posts();
    }

    // 判斷是往下拉到高度 100 的位置
    if (($(document).height() - $this.height() - $this.scrollTop()) <= 100) {
      console.log("作品列表已經到底了");
      // if ($this_Top > last_scroll_top && is_query_done) showMessage("作品列表已經到底了，不好意思", 'danger');
    }

    // 判斷是往下拉的動作
    if ($this_Top > last_scroll_top) {
      if (is_selector_open) {
        runEffect();
      }
    }
    last_scroll_top = $this_Top;
  });
}

/**
 * 處理帶有 tag 參數的 url
 */
function get_url_parameters() {
  var url_search = location.search.substring(1);
  var parameters = url_search.split('&');
  var param_object = {};
  for (var i = 0; i < parameters.length; i++) {
    var parameter = parameters[i].split("=");
    var key = parameter[0];
    var value = parameter[1];
    param_object[key] = value;
  }
  if (param_object.tag) {
    selected_tag = param_object.tag;
  }
}

/**
 * 取得置頂作品
 */
function query_top_posts() {
  var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
  $.ajax({
    url: "https://api.tumblr.com/v2/blog/woolito.tumblr.com/posts",
    type: "GET",
    dataType: 'jsonp',
    data: {
      api_key: key,
      tag: 'top'
    },
    beforeSend: showMessage('取得作品資料中...', 'info')
  }).done(function (data) {
    var current_length = data.response.posts.length;
    if (current_length == 0) {
      showMessage('發生意外問題，沒有置頂作品', 'danger');
      return;
    }

    data.response.posts = data.response.posts.filter(post => {
      return !(post.tags.indexOf('home_only') > -1);
    });

    posts = $.merge(top_posts, data.response.posts);
    query_posts();
  });
}

/**
 * 取得作品資料
 * 使用 tumblr api
 * 判斷是否已經取得到最後一篇 -> 顯示讀取狀態 -> 取得結束 -> 顯示成功 -> 開始渲染
 * 
 * @returns 
 */
function query_posts() {
  var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
  $.ajax({
    url: "https://api.tumblr.com/v2/blog/woolito.tumblr.com/posts",
    type: "GET",
    dataType: 'jsonp',
    data: {
      api_key: key,
      offset: offset
    }
  }).done(function (data) {
    var current_length = data.response.posts.length;
    data.response.posts = data.response.posts.filter(post => {
      return !(post.tags.indexOf('top') > -1 || post.tags.indexOf('home_only') > -1 || post.tags.indexOf('select') > -1);
    });

    posts = $.merge(posts, data.response.posts);

    if (offset == 0) {
      render_posts();
    }

    if (current_length == 0) {
      is_query_done = true;
    } else {
      if (no_more_post) {
        no_more_post = false;
        if (show_post_length < 6) {
          render_posts();
        }
      }
      offset += current_length;
      query_posts();
    }
  });
}

/**
 * 渲染作品
 * 判斷作品類型 -> 增加到頁面上 -> 設定 imageLoader 和 masonry(佈局)
 * 
 * @param {any} posts 
 * @returns 
 */
function render_posts() {
  // is_masonry_done = false;
  if (no_more_post) return;
  var container = $("#grid");

  var post_element;
  var count = 0;
  while (count < 6) {
    var current_post_num = render_post_length + count;
    if (current_post_num > posts.length - 1) {
      no_more_post = true;
      break;
    }
    var post = posts[current_post_num];
    var tags;
    try {
      tags = post.tags;
    } catch (e) {
      tags = [];
    }
    if (selected_tag && tags.indexOf(selected_tag) < 0) {
      render_post_length++;
      continue;
    }
    post_element = analysis_post(posts[current_post_num]);
    container.append(post_element);
    // $masonry.masonry('appended', post_element);
    count++;
    show_post_length++;
  }
  render_post_length += count;

  // container.imagesLoaded()
  //     .done(function () {
  //         $('[data-toggle="tooltip"]').tooltip();
  //         $(".tmblr-full img").on('click', function (event) {
  //             var id = '';
  //             try {
  //                 id = event.target.parentNode.parentNode.parentNode.id;
  //                 window.open("https://www.woolito.com/post/" + id, '_blank');
  //             } catch (error) {
  //                 console.log(error);
  //             }
  //         })
  //     });
}

function analysis_post(post) {
  var post_type = post.type;
  var post_html = null;
  switch (post_type) {
    case "video":
      post_html = render_video(post);
      break;
    case "text":
      post_html = render_text(post);
      break;
    case "photo":
      post_html = render_photo(post);
      break;
    case "audio":
      post_html = render_audio(post);
    default:
      break;
  }
  return post_html;
}

function render_audio(post) {
  var article = $("<div></div>");
  article.attr("id", post.id);
  article.addClass("type_audio grid-item")
  for (var i = 0; i < post.tags.length; i++) {
    article.addClass(post.tags[i]);
  }
  article.attr("rel", post.post_url);
  var article_content = $('<div class="article-content"></div>');
  var audio_iframe = post.embed;
  // var audio_player = post.player;
  article_content.append(audio_iframe);
  var caption = $('<div></div>');
  caption.addClass("caption");
  caption.html(post.caption);
  article_content.append(caption);
  var icon = render_icon(post);
  article_content.append(icon);
  article.append(article_content);
  return article;
}

function render_photo(post) {
  var article = $("<div></div>");
  article.attr("id", post.id);
  article.addClass("type_photo grid-item");
  article.attr("rel", post.post_url);
  var article_content = $('<div class="article-content"></div>');
  var photo_wrap = $('<div class="photo-wrap post"></div>');
  var photo_post = $('<div class="photo--post"></div>')
  var photo_link = $('<a href="' + post.post_url + '" target="_blank"></a>')
  var photo_img = $('<img src="' + post.photos[0]['alt_sizes'][0].url + '" alt="' + post.slug + '">');
  // var photo_img = $('<img data-original="' + post.photos[0]['alt_sizes'][0].url + '" alt="' + post.slug + '" class="lazy">');
  photo_link.append(photo_img);
  photo_post.append(photo_link);
  photo_wrap.append(photo_post);
  var caption = $('<div class="caption">' + post['caption'] + '</div>');
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
  article.attr("rel", post.post_url);
  var article_content = $('<div class="article-content"></div>');
  var video_stage = $("<div class='video-stage'></div>");
  var video_container = $("<div class='video-container ready video' id='" + post.id + "'></div>");
  var shortcut = $('<div class="video-shortcut"></div>')
  var video_link = $("<a></a>");
  video_link.attr("href", post.post_url);
  video_link.attr("target", "_blank");
  var shortcut_img = $('<img >');
  // shortcut_img.attr("src", post.thumbnail_url);
  shortcut_img.addClass("lazy");
  shortcut_img.attr("data-original", post.thumbnail_url);
  video_link.append(shortcut_img)
  shortcut.append(video_link);
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
  article.attr("rel", post.post_url);
  var article_content = $("<div></div>");
  article_content.addClass("article-content");
  var title = $("<h2></h2>");
  var title_link = $("<a href='" + post.post_url + "' title='" + post.title + "'>" + post.title + "</a>");
  title.append(title_link);
  var body = post.body;
  if (body.indexOf("<!-- more -->") > -1) {
    var start_index = body.indexOf("<!-- more -->");
    body = body.substring(0, start_index);
    body += '<a href="' + post.post_url + '" class="readmore" target="_blank">KEEP READING</a>';
  }
  body = analysis_caption_iframe(body, post.id);
  body = analysis_caption_image(body, post.id);
  body = body.replace(/<br\/>/g, '');
  article_content.append(title).append(body);
  var icon = render_icon(post);
  article_content.append(icon);
  article.append(article_content);
  return article;
}

function analysis_caption_image(caption, post_id) {
  // 為了讓 text post 內的圖片點擊後也可以連到 single post 頁面
  $caption = $(caption);
  var imgs = $caption.find("img");
  var replaced_patt = /<img(.*)\/>/i;
  try {
    var replaced_img = caption.match(replaced_patt)[0];
  } catch (err) {
    // console.log("Post id: " + post_id + "; error: " + err);
  }

  for (var i = 0; i < imgs.length; i++) {
    var url = "https://woolito.tumblr.com/post/" + post_id + "/";
    $img = $(imgs[i]);
    $img.attr("onclick", "openNewTab('" + url + "')");

    var new_img_elemene = $img.prop('outerHTML');
    caption = caption.replace(replaced_img, new_img_elemene);
  }
  return caption;

}

function analysis_caption_iframe(caption, post_id, isDoubleSize) {
  if (!(caption.indexOf("data-provider=\"youtube\"") > -1)) {
    return caption;
  }
  var patt = /<figure .* data-provider=\"youtube\" .* data-url=\"(.*)\"><iframe .*>.*<\/iframe><\/figure>/;
  var matcher = caption.match(patt);

  while (matcher != null) {
    var youtube_url = decodeURIComponent(matcher[1]);
    var youtube_id = youtube_url.substring(youtube_url.lastIndexOf("/") + 1);
    var link_element = $('<a target="_blank"></a>');
    link_element.attr("href", "https://woolito.tumblr.com/post/" + post_id + "/");
    var shortcut_element = $("<img >");
    shortcut_element.addClass("shortcut");
    shortcut_element.addClass("lazy");

    if (youtube_id.indexOf("watch") > -1) {
      var start_index = youtube_id.indexOf("=") + 1;
      var end_index = youtube_id.indexOf("&", start_index);
      if (end_index > -1) {
        youtube_id = youtube_id.substring(start_index, end_index);
      } else {
        youtube_id = youtube_id.substring(start_index);
      }
    }
    if (isDoubleSize) {
      shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/maxresdefault.jpg");
      shortcut_element.addClass("max");
    } else {
      shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/mqdefault.jpg");
      shortcut_element.addClass("hq");
    }

    shortcut_element.attr("youtube_id", youtube_id);
    // shortcut_element.attr("data-toggle", "tooltip");
    // shortcut_element.attr("data-placement", "bottom");
    // shortcut_element.attr("title", "點擊觀看作品介紹");
    link_element.html(shortcut_element);
    link_element = link_element.prop('outerHTML');
    caption = caption.replace(patt, link_element);
    matcher = patt.exec(caption);
  }

  return caption;
}

function render_icon(post) {
  var ul = $("<ul class='icons'></ul>");
  var li_link = $('<li class="link"><a href="' + post.post_url + '" title="View Post" class="social-eye" target="_blank"></a></li>');
  var li_like = $('<li class="like"><div class="like_button" data-post-id="' + post.id + '" data-blog-name="woolito" id="like_button_' + post.id + '"></div></li>');
  var iframe = $('<iframe id="like_iframe_' + post.id + '" src="https://assets.tumblr.com/assets/html/like_iframe.html?_v=c301660e229be2b44e2e912486577f3c#name=woolito&post_id=' + post.id + '&color=black&rk=' + post['reblog-key'] + '&root_id=' + post.id + '" scrolling="no" class="like_toggle" allowtransparency="true" width="16" height="16" frameborder="0" name="like_iframe_' + post.id + '"></iframe>');
  li_like.find(".like_button").append(iframe);
  var li_reblog = $('<li class="reblog"><i class="reblog-icon"><a targer="_blank" href="https://www.tumblr.com/reblog/' + post.id + '/' + post.reblog_key + '" class="reblog_button" style="display:block; width:16px; height:16px;"><svg width="100%" height="100%" viewBox="0 0 21 21" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" fill="#000"><path d="M5.01092527,5.99908429 L16.0088498,5.99908429 L16.136,9.508 L20.836,4.752 L16.136,0.083 L16.1360004,3.01110845 L2.09985349,3.01110845 C1.50585349,3.01110845 0.979248041,3.44726568 0.979248041,4.45007306 L0.979248041,10.9999998 L3.98376463,8.30993634 L3.98376463,6.89801007 C3.98376463,6.20867902 4.71892527,5.99908429 5.01092527,5.99908429 Z"></path><path d="M17.1420002,13.2800293 C17.1420002,13.5720293 17.022957,14.0490723 16.730957,14.0490723 L4.92919922,14.0490723 L4.92919922,11 L0.5,15.806 L4.92919922,20.5103758 L5.00469971,16.9990234 L18.9700928,16.9990234 C19.5640928,16.9990234 19.9453125,16.4010001 19.9453125,15.8060001 L19.9453125,9.5324707 L17.142,12.203"></path></svg></a></i></li>');
  var li_share = $('<li class="sharer"><a class="social-export"></a><div class="sharer-wrap"><ul><li class="facebook"><a href="https://www.facebook.com/sharer.php?u=' + post.post_url + '" title="Share on Facebook" class="social-facebook" target="_blank" ></a></li><li class="gplus"><a href="https://plus.google.com/share?url=' + post.post_url + '" title="Share on Google +" class ="social-gplus" target="_blank"></a></li><li class="pinterest" ><a href="https://pinterest.com/pin/create/button/?url=' + post.post_url + '&amp;media=https://67.media.tumblr.com/avatar_fbc2eabcb706_128.png" title="Share on Pinterest" class="social-pinterest" target="_blank"></a></li></ul></div></li>');
  ul.append(li_link).append(li_like).append(li_reblog).append(li_share);
  return ul;
}

function initSelector() {
  $.ajax({
    dataType: "json",
    url: 'https://spreadsheets.google.com/feeds/list/1HjUlFgljXvK76g2wEGAAlBpGTZKkHUZBIdBTM4BVmZs/od6/public/values?alt=json'
  }).done(function (data) {
    for (var i = 0; i < data.feed.entry.length; i++) {
      var post = data.feed.entry[i];
      var type = post.gsx$type.$t;
      var chinese = post.gsx$chinese.$t;
      var english = post.gsx$english.$t;
      var tag = post.gsx$tag.$t;

      var category_element = $("td[select-category='" + type + "']");
      var option_element = $('<div class="select-option" data-type="' + tag + '"></div>');
      var chinese_element = $('<div class="option-chinese">' + chinese + '</div>');
      var english_element = $('<div class="option-english">' + english + '</div>');
      option_element.append(chinese_element).append(english_element);
      category_element.append(option_element);

      if (tag == selected_tag) {
        var select_works = $(".select-works");
        var div_element = $('<div class="selected" onclick="disable_radio(this)"></div>');
        var chinese_element2 = $('<div class="selected-chinese">' + chinese + '</div>');
        var english_element2 = $('<div class="selected-english">' + english + '</div>');
        var img_element = $("<img>");
        img_element.attr("src", "https://static.tumblr.com/sirdwhf/yRso8llbo/radio_checkd.png");

        div_element.append(img_element).append(chinese_element2).append(english_element2);
        select_works.html("<span>作品篩選 Filter</span>");
        select_works.append(div_element);
      }
    }

    $(".select-option").click(function (event) {
      enable_radio(this);
    });
  });
}

function enable_radio(element) {
  clear_choices();
  var currentTarget = $(element);
  var currentBg = currentTarget.css("background-color");
  var select_works = $(".select-works");
  if (currentBg == "rgb(230, 230, 230)") { // selected
    currentTarget.css("background-color", "#3B3B3B");
    currentTarget.css("color", "#FFFFFF");
    var chinese = currentTarget.find(".option-chinese").text();
    var english = currentTarget.find(".option-english").text();

    var div_element = $('<div class="selected" onclick="disable_radio(this)"></div>');
    var chinese_element = $('<div class="selected-chinese">' + chinese + '</div>');
    var english_element = $('<div class="selected-english">' + english + '</div>');
    var img_element = $("<img>");
    img_element.attr("src", "https://static.tumblr.com/sirdwhf/yRso8llbo/radio_checkd.png");

    div_element.append(img_element).append(chinese_element).append(english_element);
    select_works.html("<span>作品篩選 Filter</span>");
    select_works.append(div_element);
    // select_works.append("<span>&nbsp/&nbsp</span>");

    selected_tag = currentTarget.attr("data-type");
    // query_posts();
  } else { // unselected
    currentTarget.css("background-color", "#E6E6E6");
    currentTarget.css("color", "#000000");
    selected_tag = "";
    // query_posts();
  }
  history.replaceState({}, 0, window.location.pathname + "?tag=" + selected_tag);
  init_posts();
  render_posts();
  runEffect();
}

function clear_choices() {
  var choices = $(".select-option");
  for (var i = 0; i < choices.length; i++) {
    $(choices[i]).css("background-color", "#E6E6E6");
    $(choices[i]).css("color", "#000000");
  }
}

function disable_radio(tag) {
  $(".select-works").html("<span>作品篩選 Filter</span><span>&nbsp/&nbsp&nbsp點此展開選單</span>");
  history.replaceState({}, 0, window.location.pathname + "?tag=" + selected_tag);
  selected_tag = "";
  init_posts();
  render_posts();
  clear_choices();
}

function runEffect() {
  if ($("#selector-table-div").css("display") == "none") {
    $(".arrow img").css("transform", "rotate(180deg)");
    is_selector_open = true;
  } else {
    $(".arrow img").css("transform", "rotate(0deg)");
    is_selector_open = false;
  }
  $("#selector-table-div").slideToggle("slow");
}

function init_posts() {
  window.scrollTo(0, 0);
  // posts = [];
  no_more_post = false;
  render_post_length = 0;
  // is_query_done = false;
  $("#grid").html('<div class="grid-sizer"></div>');
}

/**
 * 顯示目前狀態的提示
 * 
 * @param {any} msg 
 * @param {string} [type='success'] 
 */
function showMessage(msg, type = 'success') {
  if (!$alert) {
    $alert = $("#alert-message");
  }
  var className = $alert.attr('class');
  className = className.replace(/alert-(\w+)/g, "alert-" + type);
  $alert.attr('class', className);
  $alert.text(msg);
  $alert.css('visibility', 'visible')
  $alert.css('opacity', '1');
  setTimeout(function () {
    $alert.css('visibility', 'hidden');
    $alert.css('opacity', '0');
  }, 2000);
}