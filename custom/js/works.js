var posts = [];
var selected_posts = [];
var modalHidden;
var selected_tag;
var preview_timer;

$(function() {
    showLoading();
    $('#selector').toggle('blind', function() {
        $(".arrow_down").css("transform", "rotate(0deg)");
    });
    initSelector();
    query_all_posts();

    $(".effect_field").click(function() {
        runEffect();
        $(".tip-open").css("visibility", "hidden");
    });

    $(window).bind('scroll resize', function() {
        var $this = $(this);
        var $this_Top = $this.scrollTop();
        if ($this_Top > 120) {
            $("#effect").addClass("fixed-menu");
            $("#grid").css("margin-top", ($("#effect").height()) + "px");
        } else {
            $("#effect").removeClass("fixed-menu");
            $("#grid").css("margin-top", "0px");
        }
    });
});

function query_post(id) {
    for (var i = 0; i < posts.length; i++) {
        post = posts[i];
        if (post.id == id) {
            return post;
        }
    }
}

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

            type = "#" + type;
            var element = $(type);

            var html = "";
            var choice_element = $('<div class="choice unselected_choice"></div>');
            choice_element.attr("onclick", "enable_radio(this)");
            choice_element.attr("data-tag", tag);
            choice_element.attr("data-label", chinese + " " + english);
            var ch_element = $('<div class="choice-ch"></div>');
            ch_element.text(chinese);
            var hr_element = $("<hr>");
            var en_element = $('<div class="choice-en"></div>');
            en_element.text(english);
            choice_element.append(ch_element).append(hr_element).append(en_element);

            element.append(choice_element);
        }
    });
}

function clear_selected() {
    var choices = $(".choice");
    for (var i = 0; i < choices.length; i++) {
        var choice = $(choices[i]);
        choice.attr("class", "choice unselected_choice");
        choice.find("hr").removeClass("selected_hr");
        choice.attr("onclick", "enable_radio(this)");
    }
}

function enable_radio(element) {
    var currentTarget = $(element);

    var current_css = currentTarget.attr("class");
    if (current_css.indexOf("choice selected_choice") > -1) {
        currentTarget.attr("class", "choice unselected_choice");
        currentTarget.find("hr").removeClass("selected_hr");
    } else {
        clear_selected();
        currentTarget.attr("class", "choice selected_choice");
        currentTarget.find("hr").addClass("selected_hr");
        currentTarget.attr("onclick", "disable_radio(event, \"" + currentTarget.attr("data-tag") + "\")");
        selected_tag = currentTarget.attr("data-tag");
    }

    var selected_element = $('<div class="selected" onclick="disable_radio(event, \'' + selected_tag + '\')">');
    var selected_label = $('<label for="selected_tag">' + currentTarget.attr("data-label") + '</label>');
    var selected_img = $('<img src="http://static.tumblr.com/sirdwhf/nsioaip0w/checked.png">');
    selected_element.append(selected_label).append(selected_img);
    $("#chosen").html(selected_element);

    query_posts(selected_tag);
}

function disable_radio(event, tag) {
    event.stopPropagation();
    $("#chosen").html("所有作品");
    var choice = $(".choice[data-tag='" + tag + "']");
    choice.attr("class", "choice unselected_choice");
    choice.attr("onclick", "enable_radio(this)");
    choice.find("hr").removeClass("selected_hr");

    query_posts("");
}

function runEffect(todo) {
    // depend on current status, decide to open or close
    if ($('#selector').is(':hidden')) {
        $('#selector').show('blind', function() {}, 300);
        $("#select_section hr").css("display", "none");
        $(".arrow_down").css("transform", "rotate(180deg)");
    } else {
        $('#selector').hide('blind', function() {}, 300);
        $("#select_section hr").css("display", "inherit");
        $(".arrow_down").css("transform", "rotate(0deg)");
    }
}

function query_all_posts() {
    // query all posts from tumblr api, avoid still grab posts from tumblr everytimes when users change tag type
    var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
    $("#grid").html('<div class="grid-sizer"></div>');

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
                if (tags.indexOf("onlyhome") > -1 ) {
                    console.log("onlyhome");
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
    showLoading();

    var tags = [];
    selected_posts = [];
    $("#grid").html('<div class="grid-sizer"></div>');
    
    for (var i = 0; i < posts.length; i++) {
        if (tag == "") {
            selected_posts = posts;
            break;
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

    if (selected_posts.length == 0) {
        $("#total_post").text("0");
    } else {
        $("#total_post").text(selected_posts.length);
    }
    render_posts(selected_posts.length, selected_posts);
}

function render_posts(number_post, posts) {
    var $grid = $("#grid")
    if (posts.length > 0) {
        for (var i=0; i < number_post; i++) {
            var post_type = posts[i].type;
            var post_html = null;
            switch (post_type) {
                case "video":
                    post_html = render_video(posts[i]);
                    break;
                case "text":
                    post_html = Article.renderText(posts[i]);
                    // console.log(post_html);
                    // post_html = render_text(posts[i]);
                    break;
                case "photo":
                    post_html = render_photo(posts[i]);
                    break;
                case "audio":
                    // post_html = render_audio(posts[i]);
                    post_html = Article.renderAudio(posts[i]);
                    // console.log(Article);
                default:
                    break;
            }

            $grid.append(post_html);
        }
        $grid.imagesLoaded().progress(function() {
            $grid.masonry({
                columnWidth: '.grid-sizer',
                itemSelector: '.grid-item',
                percentPosition: true
            });
            $grid.masonry('reloadItems');
            
            setTimeout(function(){
                hideLoading();    
            }, 1000);
        });

        $("img.lazy").lazyload({
            threshold : 400,
            effect : "fadeIn",
            load: lazyloadHandler
        });
        $('img.lazy').trigger('scroll');
    }else{
        hideLoading();
        showAlert();
    }

    $(".photo-wrap").click(function(event) {
        event.preventDefault();
        var id = $(this).parent().parent().attr("id");
        showImagePreview(id);
    });

    $(".middle-table").on("click", function(){
        hideImagePreview();
    });

    // avoid image preview disappear
    $(".table-field img, .arrow-left, .arrow-right").on("click", function(event){
        event.stopPropagation();
    });

    $(".preview-close").on("click", function(){
        hideImagePreview();
    });

    // $(".shortcut").mouseenter(function() {
    //     clearTimeout(preview_timer);
    //     if($("#preview_youtube figure iframe").attr("src") == ""){
    //         showPreview(this);    
    //     }
    // });

    // $("#preview_youtube").mouseenter(function(e){
    //     clearTimeout(preview_timer);
    // });

    // $("#preview_youtube").mouseleave(function(e){
    //     preview_timer = setTimeout(hidePreview, 60);
    // });

    // $(".shortcut").mouseleave(function(e) {
    //     hidePreview();
    //     // preview_timer = setTimeout(hidePreview, 60);
    // });

    $('[data-toggle="tooltip"]').tooltip();

    function lazyloadHandler(){
        $grid.imagesLoaded().progress(function() {
            $grid.masonry();
        });
    }
}

function showImagePreview(id){
    var $preview = $("#image-preview");
    var key = "zcBf3tONWu9lQTSzrewHYU3WRdgbv1VtPGHXXMaZlZgN6Sz0lc";
    $.ajax({
        url: "http://api.tumblr.com/v2/blog/woolito.tumblr.com/posts",
        type: "POST",
        dataType: 'jsonp',
        data: {
            api_key: key,
            id: id
        }
    }).done(function(response){
        var post = response.response.posts[0];
        var photos = post.photos;
        $preview.find("img").attr("src", photos[0].original_size.url);
    });

    $preview.css("display", "block");
    $preview.animate({opacity:  1}, 200);
}

function hideImagePreview(){
    var $preview = $("#image-preview");
    $preview.animate({opacity: 0}, 200);
    setTimeout(function(){
        $preview.css("display", "none");
    }, 500);
    $preview.find("img").attr("src", "");
}

function hidePreview(){
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
    $("#preview_youtube").css("top", (e_top - (p_height - e_height) - 10 ) + "px");
    $("#preview_youtube").css("left", (e_left + e_width) + "px");

    if ((e_left + e_width + p_width) > w_width) {
        $("#preview_youtube").css("left", (e_left - p_width - 10) + "px");
    }

    if ($("#preview_youtube").offset().top < $(window).scrollTop()) {
        $("#preview_youtube").css("top", $(window).scrollTop() + "px");
    }

    if (($("#preview_youtube").offset().top + p_height) > ($(window).scrollTop() + $(window).height())) {
        $("#preview_youtube").css("top", ($(window).scrollTop() + $(window).height() - p_height) + "px");
    }

    var iframe_element = $("#preview_youtube figure iframe");
    iframe_element.attr("src", "https://www.youtube.com/embed/" + element.attr("youtube_id") + "?feature=oembed&amp;enablejsapi=1&amp&autoplay=1&loop=0;controls=0;origin=https://safe.txmblr.com&amp;wmode=opaque&showinfo=0");
}

function render_photo(post) {
    var article = $("<div></div>");
    article.attr("id", post.id);
    article.addClass("type_photo grid-item");
    var tags = post.tags;
    for(var i=0; i<tags.length; i++){
        article.addClass(tags[i]);
    }
    article.attr("rel", post.post_url);
    var article_content = $('<div class="article-content"></div>');
    var photo_wrap = $('<div class="photo-wrap post"></div>');
    var photo_post = $('<div class="photo--post"></div>')
    for (var i = 0; i < post.photos.length; i++) {
        var photo_link = $('<a href="' + post['post_url'] + ' target=\"_blank\""></a>');
        var photo_img = $('<img class="lazy" data-original="' + post.photos[i].original_size.url + '" alt="' + post.slug + '">');
        // var photo_img = $('<img src="' + post.photos[i].original_size.url + '" alt="' + post.slug + '">');

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
    var tags = post.tags;
    for(var i=0; i<tags.length; i++){
        article.addClass(tags[i]);
    }
    article.attr("rel", post['post_url']);
    var article_content = $('<div class="article-content"></div>');
    var video_stage = $("<div class='video-stage'></div>");
    var video_container = $("<div class='video-container ready video' id='" + post.id + "'></div>");
    var shortcut = $('<div class="video-shortcut"></div>')
    var shortcut_img = $('<img >');
    // shortcut_img.attr("src", post.thumbnail_url);
    shortcut_img.addClass("lazy");
    shortcut_img.attr("data-original", post.thumbnail_url);
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
    
    var tags = post.tags;
    for(var i=0; i<tags.length; i++){
        article.addClass(tags[i]);
    }
    var isDoubleSize = false;
    if(tags.indexOf("double_size") > -1){
        isDoubleSize = true;
    }
    article.attr("rel", post['post_url']);
    var article_content = $("<div></div>");
    article_content.addClass("article_content");
    var title = $("<h2></h2>");
    var title_link = $("<a href='" + post['post_url'] + "' target=\"_blank\" title='點擊觀看作品介紹' data-toggle='tooltip' data-placement='right' >" + post.title + "</a>");
    title.append(title_link);
    var body = post['body'];
    if (body.indexOf("<!-- more -->") > -1) {
        var start_index = body.indexOf("<!-- more -->");
        body = body.substring(0, start_index);
        body += '<a href="' + post['post_url'] + '" target=\"_blank\" class="readmore">KEEP READING</a>';
    }
    body = analysis_caption_iframe(body, post.id, isDoubleSize);
    article_content.append(title).append(body);
    var icon = render_icon(post);
    article_content.append(icon);
    article.append(article_content);
    return article;
}

function analysis_caption_iframe(caption, post_id, isDoubleSize) {
    if (!(caption.indexOf("youtube_iframe") > -1)) {
        return caption;
    }
    var patt = /https:\/\/www.youtube.com\/embed\/([A-Za-z0-9_\-]*)\?/i;
    var patt2 = /<figure(.*)>(.*)<\/figure>/i;
    var youtube_id;
    try{
        youtube_id = caption.match(patt)[1];
    }catch(error){
        console.log(caption);
        console.log(post_id);
        console.log(error);
    }
    var link_element = $('<a target="_blank"></a>');

    link_element.attr("href", "http://woolito.tumblr.com/post/" + post_id + "/");
    var shortcut_element = $("<img >");
    shortcut_element.addClass("shortcut");
    shortcut_element.addClass("lazy");
    if(isDoubleSize){
        // shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/maxresdefault.jpg");
        shortcut_element.attr("data-original", "https://i.ytimg.com/vi/" + youtube_id + "/maxresdefault.jpg");
    }else{
        // shortcut_element.attr("src", "https://i.ytimg.com/vi/" + youtube_id + "/hqdefault.jpg");
        shortcut_element.attr("data-original", "https://i.ytimg.com/vi/" + youtube_id + "/hqdefault.jpg");
    }
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
    // var li_like = $('<li class="like"><div class="like_button" data-post-id="' + post.id + '" data-blog-name="woolito" id="like_button_' + post.id + '"></div></li>');
    // var iframe = $('<iframe id="like_iframe_' + post.id + '" src="http://assets.tumblr.com/assets/html/like_iframe.html?_v=c301660e229be2b44e2e912486577f3c#name=woolito&post_id=' + post.id + '&color=black&rk=' + post['reblog_key'] + '&root_id=' + post.id + '" scrolling="no" class="like_toggle" allowtransparency="true" width="16" height="16" frameborder="0" name="like_iframe_' + post.id + '"></iframe>');
    // li_like.find(".like_button").append(iframe);
    var li_reblog = $('<li class="reblog"><i class="reblog-icon"><a targer="_blank" href="https://www.tumblr.com/reblog/' + post.id + '/' + post['reblog_key'] + '" class="reblog_button" style="display:block; width:16px; height:16px;"><svg width="100%" height="100%" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000"><path d="M5.01092527,5.99908429 L16.0088498,5.99908429 L16.136,9.508 L20.836,4.752 L16.136,0.083 L16.1360004,3.01110845 L2.09985349,3.01110845 C1.50585349,3.01110845 0.979248041,3.44726568 0.979248041,4.45007306 L0.979248041,10.9999998 L3.98376463,8.30993634 L3.98376463,6.89801007 C3.98376463,6.20867902 4.71892527,5.99908429 5.01092527,5.99908429 Z"></path><path d="M17.1420002,13.2800293 C17.1420002,13.5720293 17.022957,14.0490723 16.730957,14.0490723 L4.92919922,14.0490723 L4.92919922,11 L0.5,15.806 L4.92919922,20.5103758 L5.00469971,16.9990234 L18.9700928,16.9990234 C19.5640928,16.9990234 19.9453125,16.4010001 19.9453125,15.8060001 L19.9453125,9.5324707 L17.142,12.203"></path></svg></a></i></li>');
    var li_share = $('<li class="sharer"><a class="social-export"></a><div class="sharer-wrap"><ul><li class="facebook"><a href="http://www.facebook.com/sharer.php?u=' + post['post_url'] + '" title="Share on Facebook" class="social-facebook" target="_blank" ></a></li><li class="gplus"><a href="https://plus.google.com/share?url=' + post['post_url'] + '" title="Share on Google +" class ="social-gplus" target="_blank"></a></li><li class="pinterest" ><a href="https://pinterest.com/pin/create/button/?url=' + post['post_url'] + '&amp;media=http://67.media.tumblr.com/avatar_fbc2eabcb706_128.png" title="Share on Pinterest" class="social-pinterest" target="_blank"></a></li></ul></div></li>');
    ul.append(li_link).append(li_reblog).append(li_share);
    // ul.append(li_link).append(li_like).append(li_reblog).append(li_share);
    return ul;
}

function showLoading() {
    $(".mask").css("display", "inherit");
    $("#loading").css("display", "inherit");
}

function hideLoading() {
    $(".mask").css("display", "none");
    $("#loading").css("display", "none");
}

function showAlert(){
    var $alert = $("#alert-noposts")
    $alert.css({
        display: "block",
        opacity: 0
    }).animate({ opacity: 1 }, 500);

    $alert.delay(1000).animate({opacity: 0}, 500);
    setTimeout(function(){
        $alert.css("display", "none");
    }, 2000);
}