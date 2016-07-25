var posts = [];
var current_posts_number = 6;
$(function() {
    console.log("width: " + $(window).width());
    console.log("user agent: " + navigator.userAgent);

    if (!ismobile_browser()) {
        location.href = "works";
    }

    initSelector();
    query_all_posts();
});

function ismobile_browser() {
    var href = location.href;
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

function readmore() {}

function initSelector() {
    $.ajax({
        dataType: "json",
        url: 'https://spreadsheets.google.com/feeds/list/1HjUlFgljXvK76g2wEGAAlBpGTZKkHUZBIdBTM4BVmZs/od6/public/values?alt=json'
    }).done(function(data) {
        var current_type = "";
        var accordion_element = $("<div id='accordion'></div>");
        var div_element = null;
        for (var i = 0; i < data.feed.entry.length; i++) {
            var post = data.feed.entry[i];
            var type = post.gsx$type.$t;
            var chinese = post.gsx$chinese.$t;
            var english = post.gsx$english.$t;
            var tag = post.gsx$tag.$t;
            if (current_type == type) {
                var choice_element = $("<div class='choice'></div>");
                var label_element = $("<label></label>");
                label_element.attr("for", tag);
                label_element.text(chinese + " " + english);
                var img_element = $('<img src="http://static.tumblr.com/sirdwhf/6fHo90gzy/unchecked.png">');
                label_element.append(img_element);
                var input_element = $('<input type="radio">');
                input_element.attr("onclick", "enable_radio(this)");
                input_element.attr("name", "selection");
                input_element.val(tag);
                input_element.attr("id", tag);
                choice_element.append(label_element);
                choice_element.append(input_element);
                div_element.append(choice_element);
            } else {
                if (div_element) {
                    accordion_element.append(div_element);
                    div_element = null;
                }
                var h3_element = $("<h3>" + type + "</h3>");
                current_type = type;
                accordion_element.append(h3_element);
                if (!div_element) {
                    div_element = $("<div></div>");
                }
            }

            if (i == (data.feed.entry.length - 1)) {
                accordion_element.append(div_element);
                div_element = null;
            }
        }
        $(accordion_element).insertAfter($("#selector"));
        $("#accordion").accordion({
            collapsible: true,
            heightStyle: "content"
        });
    });
}

function enable_radio(element) {
    var currentTarget = $(element);
    if (currentTarget.is(":checked")) {
        var label_text = currentTarget.parent().find("label").text();
        currentTarget.parent().find("img").attr("src", "http://static.tumblr.com/sirdwhf/yRso8llbo/radio_checkd.png");
        currentTarget.parent().css("background-color", "#84C2AF");
        var choices = currentTarget.parent().parent().parent().parent().parent().find(".choice");
        for (var i = 0; i < choices.length; i++) {
            console.log()
            if (!$(choices[i]).find("input").is(":checked")) {
                $(choices[i]).css("background-color", "#fff");
                $(choices[i]).find("img").attr("src", "http://static.tumblr.com/sirdwhf/0Iso8llbp/radio_uncheckd.png");
            }
        }

        var end_index = label_text.indexOf(" ");
        label_text = label_text.substring(0, end_index);
        var selected_tag = currentTarget.val();

        var selected_element = $('<div class="selected" onclick="disable_radio(\'' + selected_tag + '\')">');
        var selected_label = $('<label for="selected_tag">' + label_text + '</label>');
        var selected_check = $('<input type="checkbox" name="selected" val="' + selected_tag + '" id="selected_tag">');
        var selected_img = $('<img src="http://static.tumblr.com/sirdwhf/Ifwo90gyt/checked.png">');
        selected_element.append(selected_label).append(selected_check).append(selected_img);
        $("#chosen").html(selected_element);
        // runEffect();
        $("#accordion").css("display", "none");
        query_posts(selected_tag);
    }
}

function disable_radio(tag) {
    $("#chosen").html("全部");
    query_posts("");
    var input_element = $('input[value="' + tag + '"]');
    var choice = input_element.parent();
    choice.css("background-color", "#FFF");
    choice.find("img").attr("src", "http://static.tumblr.com/sirdwhf/6fHo90gzy/unchecked.png");
}

function runEffect() {
    if ($("#accordion").css("display") == "block") {
        $("#accordion").css("display", "none");
        $(".arrow img").css("transform", "rotate(0deg)");
    } else {
        $("#accordion").css("display", "block");
        $(".arrow img").css("transform", "rotate(180deg)");
    }

}

function query_all_posts() {
    var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
    $(".grid").html('<div class="grid-sizer"></div>');

    $.ajax({
        url: "http://api.tumblr.com/v2/blog/woolito.tumblr.com/posts",
        type: "GET",
        dataType: 'jsonp',
        data: {
            api_key: key
        }
    }).done(function(data) {
        var data_json = data.response.posts;
        for (var i = 0; i < data_json.length; i++) {
            try {
                tags = data_json[i].tags;
                if (tags == undefined) {
                    tags = [];
                };
                if (tags.indexOf("work") > -1) {
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

    if (!selected_posts) {
        $("#total_post").text("0");
    } else {
        $("#total_post").text(selected_posts.length);
    }

    render_posts(selected_posts);
}

function render_posts(posts) {
    var grid_holder = $(".grid");
    console.log(posts);

    if (posts.length > 0) {
        for (var i = 0; i < posts.length; i++) {
            var post_type = posts[i].type;
            var post_html = null;
            console.log(post_type);
            switch (post_type) {
                // case "video":
                //     post_html = render_video(posts[i]);
                //     break;
                case "text":
                    post_html = render_text(posts[i]);
                    break;
                    // case "photo":
                    //     post_html = render_photo(posts[i]);
                    //     break;
                default:
                    break;
            }

            $(".grid").append(post_html);
        }
    }

    $(".shortcut")
        .bind("beforeShow", function() {
            alert("beforeShow");
        })
        .bind("afterShow", function(){
            alert("afterShow");
        })
        .bind("show", function(){
            alert('in show callback');
        });
}

function render_photo(post) {
    var article = $("<div></div>");
    article.attr("id", post.id);
    article.addClass("type_photo grid-item");
    article.attr("rel", post.post_url);
    var article_content = $('<div class="article-content"></div>');
    var photo_wrap = $('<div class="photo-wrap post"></div>');
    var photo_post = $('<div class="photo--post"></div>')
    var photo_link = $('<a href="' + post.post_url + '"></a>')
    var photo_img = $('<img src="' + post['photo-url-400'] + '" data-highres="' + post['photo-url-1280'] + '" alt="' + post.slug + '">')
    photo_link.append(photo_img);
    photo_post.append(photo_link);
    photo_wrap.append(photo_post);
    var caption = $('<div class="caption">' + post['photo-caption'] + '</div>');
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
    var shortcut = $('<div class="video-shortcut"></div>')
    var shortcut_img = $('<img >');
    shortcut_img.attr("src", post.thumbnail_url);
    shortcut.append(shortcut_img);
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
    article_content.addClass("article_content");
    var title = $("<h2></h2>");
    var title_link = $("<a href='" + post.post_url + "' title='" + post.title + "'>" + post.slug + "</a>");
    title.append(title_link);
    var body = post.body;
    body = analysis_caption_iframe(body, post.id);
    if (body.indexOf("<!-- more -->") > -1) {
        var start_index = body.indexOf("<!-- more -->");
        body = body.substring(0, start_index);
        body += '<a href="' + post.post_url + '" class="readmore">KEEP READING</a>';
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
    link_element.attr("href", "http://woolito.tumblr.com/post/" + post_id + "/");
    var shortcut_element = $("<img >");
    shortcut_element.addClass("shortcut");
    shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/hqdefault.jpg");
    shortcut_element.attr("youtube_id", youtube_id);
    link_element.html(shortcut_element);
    link_element = link_element.prop('outerHTML');

    caption = caption.replace(patt2, link_element);
    return caption;
}

function render_icon(post) {
    var ul = $("<ul class='icons'></ul>");
    var li_link = $('<li class="link"><a href="' + post.post_url + '" title="View Post" class="social-eye"></a></li>');
    var li_like = $('<li class="like"><div class="like_button" data-post-id="' + post.id + '" data-blog-name="woolito" id="like_button_' + post.id + '"></div></li>');
    var iframe = $('<iframe id="like_iframe_' + post.id + '" src="http://assets.tumblr.com/assets/html/like_iframe.html?_v=c301660e229be2b44e2e912486577f3c#name=woolito&post_id=' + post.id + '&color=black&rk=' + post['reblog-key'] + '&root_id=' + post.id + '" scrolling="no" class="like_toggle" allowtransparency="true" width="16" height="16" frameborder="0" name="like_iframe_' + post.id + '"></iframe>');
    li_like.find(".like_button").append(iframe);
    var li_reblog = $('<li class="reblog"><i class="reblog-icon"><a targer="_blank" href="https://www.tumblr.com/reblog/' + post.id + '/' + post['reblog-key'] + '" class="reblog_button" style="display:block;"><svg width="100%" height="100%" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000"><path d="M5.01092527,5.99908429 L16.0088498,5.99908429 L16.136,9.508 L20.836,4.752 L16.136,0.083 L16.1360004,3.01110845 L2.09985349,3.01110845 C1.50585349,3.01110845 0.979248041,3.44726568 0.979248041,4.45007306 L0.979248041,10.9999998 L3.98376463,8.30993634 L3.98376463,6.89801007 C3.98376463,6.20867902 4.71892527,5.99908429 5.01092527,5.99908429 Z"></path><path d="M17.1420002,13.2800293 C17.1420002,13.5720293 17.022957,14.0490723 16.730957,14.0490723 L4.92919922,14.0490723 L4.92919922,11 L0.5,15.806 L4.92919922,20.5103758 L5.00469971,16.9990234 L18.9700928,16.9990234 C19.5640928,16.9990234 19.9453125,16.4010001 19.9453125,15.8060001 L19.9453125,9.5324707 L17.142,12.203"></path></svg></a></i></li>');
    var li_share = $('<li class="sharer"><a class="social-export"></a><div class="sharer-wrap"><ul><li class="facebook"><a href="http://www.facebook.com/sharer.php?u=' + post.post_url + '" title="Share on Facebook" class="social-facebook" target="_blank" ></a></li><li class="gplus"><a href="https://plus.google.com/share?url=' + post.post_url + '" title="Share on Google +" class ="social-gplus" target="_blank"></a></li><li class="pinterest" ><a href="https://pinterest.com/pin/create/button/?url=' + post.post_url + '&amp;media=http://67.media.tumblr.com/avatar_fbc2eabcb706_128.png" title="Share on Pinterest" class="social-pinterest" target="_blank"></a></li></ul></div></li>');
    ul.append(li_link).append(li_like).append(li_reblog).append(li_share);
    return ul;
}

function video_shortcut(post) {
    // <img class="labnolIframe" src="https://i.ytimg.com/vi/S2kSogoVzu4/hqdefault.jpg">

    // <div id="hospital_m" class="hospital">

    //     <div id="youtube_S2kSogoVzu4" class="play-button" onclick="labnolIframe_order('hospital_m', 'S2kSogoVzu4')"></div>
    // </div>
}

function render_iframe(post) {
    var video_source = (post['video-player-250']);

    if (video_source.indexOf("youtube") > -1) {
        video_source = post['video-source'];
        var div_element = $('<div id="iframe_' + post.id + '" class="post_iframe">');
        var start_index = video_source.lastIndexOf("/") + 1;
        var youtube_id = video_source.substring(start_index);
        var img_element = $('<img class="labnolIframe" src="https://i.ytimg.com/vi/' + youtube_id + '/hqdefault.jpg">');
        var click_element = $('<div class="play-button" onclick="labnolIframe_order(\'iframe_' + post.id + '\', \'' + youtube_id + '\')"></div>');
        div_element.append(img_element).append(click_element);
        return div_element;
    }

    var url = 'https://www.tumblr.com/video/woolito/' + post.id + '/700/'
    var html = $('<iframe src="' + url + '" class="embed_iframe tumblr_video_iframe" scrolling="no" frameborder="0" data-can-gutter data-can-resize allowfullscreen mozallowfunscreen webkitallowfullscreen></iframe>');
    return html;
}
