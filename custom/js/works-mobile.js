var posts = [];
var selected_posts = [];
var current_posts_number = 6;
var standard_height = 0;
// var selector_animation_switch;
$(function() {

    initSelector();
    $("#selector").click(runEffect);
    query_all_posts();
});

function initSelector() {
    $.ajax({
        dataType: "json",
        url: 'https://spreadsheets.google.com/feeds/list/1HjUlFgljXvK76g2wEGAAlBpGTZKkHUZBIdBTM4BVmZs/od6/public/values?alt=json'
    }).done(function(data) {
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
        }

        $(".select-option").click(function(event) {
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
        console.log(chinese + "," + english);

        var div_element = $('<div class="selected" onclick="disable_radio(this)"></div>');
        var chinese_element = $('<div class="selected-chinese">' + chinese + '</div>');
        var english_element = $('<div class="selected-english">' + english + '</div>');
        var img_element = $("<img>");
        img_element.attr("src", "http://static.tumblr.com/sirdwhf/yRso8llbo/radio_checkd.png");

        div_element.append(img_element).append(chinese_element).append(english_element);
        select_works.html("<span>作品篩選 Filter</span>");
        select_works.append(div_element);
        select_works.append("<span>&nbsp/&nbsp</span>");
        query_posts(currentTarget.attr("data-type"));
    } else { // unselected
        currentTarget.css("background-color", "#E6E6E6");
        currentTarget.css("color", "#000000");
        query_posts("");
    }
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
    query_posts("");
    $(".select-works").html("<span>作品篩選 Filter</span><span>&nbsp/&nbsp&nbsp點此展開選單</span>");
    clear_choices();
}

function runEffect() {
    if($("#selector-table-div").css("display") == "none"){
        $(".arrow img").css("transform", "rotate(180deg)");
    }else{
        $(".arrow img").css("transform", "rotate(0deg)");
    }
    $("#selector-table-div").slideToggle("slow");
}

function query_all_posts() {
    var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
    $(".grid").html('<div class="grid-sizer"></div>');

    $.ajax({
        url: "http://api.tumblr.com/v2/blog/woolito.tumblr.com/posts",
        type: "GET",
        dataType: 'jsonp',
        data: {
            api_key: key,
            limit: 50
        }
    }).done(function(data) {
        var data_json = data.response.posts;
        var top_posts = [];
        var normal_posts = [];
        for (var i = 0; i < data_json.length; i++) {
            try {
                tags = data_json[i].tags;
                if (tags == undefined) {
                    tags = [];
                };
                if (tags.indexOf("home_only") > -1 || tags.indexOf("select") > -1) {
                    console.log("home_only");
                }else{
                    if(tags.indexOf("top") > -1){
                        top_posts.push(data_json[i]);
                    }else{
                        normal_posts.push(data_json[i]);
                    }
                }
            } catch (err) {
                console.log(err);
                continue;
            }
        }
        for(var i=0; i<top_posts.length; i++){
            posts.push(top_posts[i]);
        }
        for(var i=0; i<normal_posts.length; i++){
            posts.push(normal_posts[i]);
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
        // console.log(selected_posts);
    }

    render_posts(selected_posts);
}

function render_posts(posts) {
    var grid_holder = $(".grid");
    grid_holder.html('<div class="grid-sizer"></div>');

    if (posts.length > 0) {
        for (var i = 0; i < posts.length; i++) {
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
                case "audio":
                    post_html = render_audio(posts[i]);
                    break;
                default:
                    break;
            }

            $(".grid").append(post_html);
            $("img.lazy").lazyload({
                threshold : 200,
                effect : "fadeIn",
                load: lazyloadHandler
            });

            // $("img.lazy").on("load", function(){
            //     console.log("load");
            // });
        }
    }

    $(".shortcut")
        .bind("beforeShow", function() {
            alert("beforeShow");
        })
        .bind("afterShow", function() {
            alert("afterShow");
        })
        .bind("show", function() {
            alert('in show callback');
        });
}

function lazyloadHandler(){
    // console.log("Load");
}

function render_audio(post){
    var article = $("<div></div>");
    article.attr("id", post.id);
    article.addClass("type_audio grid-item")
    console.log()
    for(var i=0; i<post.tags.length; i++){
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
    var photo_link = $('<a href="' + post.post_url + '"></a>')
    // var photo_img = $('<img src="' + post.photos[0]['alt_sizes'][0].url + '" alt="' + post.slug + '">');
    var photo_img = $('<img data-original="' + post.photos[0]['alt_sizes'][0].url + '" alt="' + post.slug + '" class="lazy">');
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
    console.log(post);
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
    body = analysis_caption_image(body, post.id);
    body = analysis_caption_iframe(body, post.id);
    article_content.append(title).append(body);
    var icon = render_icon(post);
    article_content.append(icon);
    article.append(article_content);
    return article;
}

function analysis_caption_image(caption, post_id){
    // 為了讓 text post 內的圖片點擊後也可以連到 single post 頁面

    // if(post_id == "147680371079"){
        $caption = $(caption);
        var imgs = $caption.find("img");
        var replaced_patt = /<img(.*)\/>/i;
        try{
            var replaced_img = caption.match(replaced_patt)[0];
        } catch (err){
            console.log("Post id: " + post_id + "; error: " + err);
        }
        
        // console.log(imgs);
        for(var i=0; i<imgs.length; i++){
            var url = "http://woolito.tumblr.com/post/" + post_id + "/";
            $img = $(imgs[i]);
            $img.attr("onclick", "openNewTab('"+url+"')");

            var new_img_elemene = $img.prop('outerHTML');
            caption = caption.replace(replaced_img, new_img_elemene);
        }
    // }
    return caption;

}

function analysis_caption_iframe(caption, post_id) {
    if (!(caption.indexOf("youtube_iframe") > -1)) {
        return caption;
    }
    var patt = /https:\/\/www.youtube.com\/embed\/([A-Za-z0-9_\-]*)\?/i;
    var patt2 = /<figure(.*)>(.*)<\/figure>/i;
    var youtube_id = caption.match(patt)[1];
    var link_element = $('<a target="_blank"></a>');
    link_element.attr("href", "http://woolito.tumblr.com/post/" + post_id + "/");
    var shortcut_element = $("<img />");
    shortcut_element.addClass("shortcut");
    shortcut_element.addClass("lazy");
    // shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/hqdefault.jpg");
    shortcut_element.attr("data-original", "https://i.ytimg.com/vi/" + youtube_id + "/hqdefault.jpg");
    shortcut_element.attr("youtube_id", youtube_id);
    link_element.html(shortcut_element);
    link_element = link_element.prop('outerHTML');

    caption = caption.replace(patt2, link_element);
    return caption;
}

function render_icon(post) {
    var ul = $("<ul class='icons'></ul>");
    var li_link = $('<li class="link"><a href="' + post.post_url + '" title="View Post" class="social-eye" target="_blank"></a></li>');
    var li_like = $('<li class="like"><div class="like_button" data-post-id="' + post.id + '" data-blog-name="woolito" id="like_button_' + post.id + '"></div></li>');
    var iframe = $('<iframe id="like_iframe_' + post.id + '" src="http://assets.tumblr.com/assets/html/like_iframe.html?_v=c301660e229be2b44e2e912486577f3c#name=woolito&post_id=' + post.id + '&color=black&rk=' + post['reblog-key'] + '&root_id=' + post.id + '" scrolling="no" class="like_toggle" allowtransparency="true" width="16" height="16" frameborder="0" name="like_iframe_' + post.id + '"></iframe>');
    li_like.find(".like_button").append(iframe);
    var li_reblog = $('<li class="reblog"><i class="reblog-icon"><a targer="_blank" href="https://www.tumblr.com/reblog/' + post.id + '/' + post.reblog_key + '" class="reblog_button" style="display:block; width:16px; height:16px;"><svg width="100%" height="100%" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000"><path d="M5.01092527,5.99908429 L16.0088498,5.99908429 L16.136,9.508 L20.836,4.752 L16.136,0.083 L16.1360004,3.01110845 L2.09985349,3.01110845 C1.50585349,3.01110845 0.979248041,3.44726568 0.979248041,4.45007306 L0.979248041,10.9999998 L3.98376463,8.30993634 L3.98376463,6.89801007 C3.98376463,6.20867902 4.71892527,5.99908429 5.01092527,5.99908429 Z"></path><path d="M17.1420002,13.2800293 C17.1420002,13.5720293 17.022957,14.0490723 16.730957,14.0490723 L4.92919922,14.0490723 L4.92919922,11 L0.5,15.806 L4.92919922,20.5103758 L5.00469971,16.9990234 L18.9700928,16.9990234 C19.5640928,16.9990234 19.9453125,16.4010001 19.9453125,15.8060001 L19.9453125,9.5324707 L17.142,12.203"></path></svg></a></i></li>');
    var li_share = $('<li class="sharer"><a class="social-export"></a><div class="sharer-wrap"><ul><li class="facebook"><a href="http://www.facebook.com/sharer.php?u=' + post.post_url + '" title="Share on Facebook" class="social-facebook" target="_blank" ></a></li><li class="gplus"><a href="https://plus.google.com/share?url=' + post.post_url + '" title="Share on Google +" class ="social-gplus" target="_blank"></a></li><li class="pinterest" ><a href="https://pinterest.com/pin/create/button/?url=' + post.post_url + '&amp;media=http://67.media.tumblr.com/avatar_fbc2eabcb706_128.png" title="Share on Pinterest" class="social-pinterest" target="_blank"></a></li></ul></div></li>');
    ul.append(li_link).append(li_like).append(li_reblog).append(li_share);
    return ul;
}

function openNewTab(url){
    window.open(url, "_blank");
}
