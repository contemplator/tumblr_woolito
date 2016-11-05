var Article = {
    initArticleElement: function(post) {
        var article = document.createElement("div");
        article.setAttribute("id", post.id);
        article.className = "type_audio grid-item ";
        for (var i = 0; i < post.tags.length; i++) {
            article.className += post.tags[i];
        }
        article.setAttribute("rel", post.post_url);
        return article;
    },
    renderText: function(post) {
        var article = Article.initArticleElement(post);
        var articleContent = document.createElement("div");
        articleContent.className = "article_content";
        var title = document.createElement("h2");
        var titleLink = document.createElement("a");
        titleLink.setAttribute("href", post.post_url);
        titleLink.setAttribute("target", "_blank");
        titleLink.setAttribute("title", "點擊觀看作品介紹");
        titleLink.setAttribute("data-toggle", "tooltip");
        titleLink.setAttribute("data-placement", "right");
        titleLink.innerTEXT = post.title;
        title.appendChild(titleLink);
        var body = post.body;
        if (body.indexOf("<!-- more -->") > -1) {
            var start_index = body.indexOf("<!-- more -->");
            body = body.substring(0, start_index);
            var readmore = document.createElement("a");
            readmore.className = "readmore";
            readmore.setAttribute("href", post.post_url);
            readmore.setAttribute("target", "_blank");
            readmore.innerTEXT = "KEEP READING";
            body += readmore.outerHTML;
        }
        // body 改完
        body = Article.analysisTextIframeImage(body, post.id, (post.tags.indexOf("double_size") > -1));
        articleContent.innerHTML = body;
        articleContent.insertBefore(titleLink, articleContent.childNodes[0]);
        // var icon = render_icon(post);
        // article_content.append(icon);
        article.appendChild(articleContent);
        return article;
    },
    renderImage: function(post) {

    },
    renderQuote: function(post) {

    },
    renderLink: function(post) {

    },
    renaderChat: function(post) {

    },
    renderAudio: function(post) {
        var article = Article.initArticleElement(post);

        var articleContent = document.createElement("div");
        var audioEmbed = document.createElement("div");
        audioEmbed.className += "audio-embed"
        audioEmbed.innerHTML = post.embed;
        var caption = document.createElement("div");
        caption.className = "caption";
        caption.innerHTML = post.caption;
        var icons = document.createElement("div");
        icons.className = "icons";

        article.appendChild(audioEmbed).appendChild(caption).appendChild(icons);
        return article;
    },
    renderVideo: function(post) {

    },
    analysisTextIframeImage: function(body, postId, isDoubleSize) {
        if (!(body.indexOf("youtube_iframe") > -1) && !(body.indexOf("<img") > -1)) {
            console.log("out");
            return body;
        }

        // replace youtube figure and iframe with photo
        var youtubeIdPattern = /https:\/\/www.youtube.com\/embed\/([A-Za-z0-9_\-]*)\?/i;
        var figurePattern = /<figure(.*)>(.*)<\/figure>/i;
        var youtubeId;
        try {
            youtubeId = body.match(youtubeIdPattern)[1];
        } catch (error) {
            console.log("can't match youtube id: " + error);
        }
        var linkElement = document.createElement("a");
        linkElement.setAttribute("target", "_blank");
        linkElement.setAttribute("href", "http://woolito.tumblr.com/post/" + postId + "/");

        var shortcutElement = document.createElement("img");
        shortcutElement.className = "shortcut lazy";
        if(youtubeId){
            if (isDoubleSize) {
                shortcutElement.setAttribute("src", "resources/Loading_icon.gif");
                shortcutElement.setAttribute("data-original", "https://i.ytimg.com/vi/" + youtubeId + "/maxresdefault.jpg");
            } else {
                shortcutElement.setAttribute("src", "resources/Loading_icon.gif");
                shortcutElement.setAttribute("data-original", "https://i.ytimg.com/vi/" + youtubeId + "/hqdefault.jpg");
            }
            shortcutElement.setAttribute("youtube_id", youtubeId);
        }else{
            shortcutElement = body.match(figurePattern)[0];
            console.log(shortcutElement);
            var temp = document.createElement("div");
            temp.innerHTML = shortcutElement;
            shortcutElement = temp.childNodes[0];
        }
        
        shortcutElement.setAttribute("data-toggle", "tooltip");
        shortcutElement.setAttribute("data-placement", "bottom");
        shortcutElement.setAttribute("title", "點擊觀看作品介紹");
        linkElement.appendChild(shortcutElement);
        linkElement = linkElement.outerHTML;
        body = body.replace(figurePattern, linkElement);
        return body;
    },
    renderIcons: function(post) {
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
    },
};
