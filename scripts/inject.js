(function () {
    var wordsPerMinute = 200;
    var minimumWords = 300;

    var articleData = getArticleData ();
    if (articleData && articleData.element) {

        var readingTime = getReadingTimeForElement (articleData.element);

        var informationBar = document.createElement ('div');
        informationBar.id = 'information-bar';

        var html = [];
        html.push ("<div title='" + articleData.wordCount + " words / " + wordsPerMinute + " per minute'>Reading this article will take " + readingTime + "</div>");
        html.push ("Read it later using <a id='readitlater-instapaper' href='#'>Instapaper</a>, <a id='readitlater-pocket' href='#'>Pocket (coming soon...)</a>");

        informationBar.innerHTML = html.join ('');

        document.body.insertBefore (informationBar , document.body.childNodes[0]);

        bindEvents ();
    }

    /*** Functions **/

    function bindEvents () {
        var rtlInstapaperElement = document.getElementById ('readitlater-instapaper');
        if (rtlInstapaperElement) {
            rtlInstapaperElement.addEventListener ('click' , instapaper_readitlater);
        }

        //var rtlPocketElement = document.getElementById ('readitlater-pocket');
        //if (rtlPocketElement) {
        //    rtlPocketElement.addEventListener ('click' , pocket_readitlater);
        //}

        var infobarElement = document.getElementById ('information-bar');
        if (infobarElement) {
            infobarElement.addEventListener ('mouseover' , function () {
                articleData.element.classList.add ('highlighted');
            });
            infobarElement.addEventListener ('mouseleave' , function () {
                articleData.element.classList.remove ('highlighted');
            });
        }
    }

    function instapaper_readitlater () {
        var d = document, z = d.createElement ('scr' + 'ipt'), b = d.body, l = d.location;
        try {
            if (!b)throw(0);
            d.title = '(Saving...) ' + d.title;
            z.setAttribute ('src' , l.protocol + '//www.instapaper.com/j/BCgw7UpUGtNY?u=' + encodeURIComponent (l.href) + '&t=' + (new Date ().getTime ()));
            b.appendChild (z);
        } catch (e) {
            alert ('Please wait until the page has loaded.');
        }
    }

    function pocket_readitlater () {
        return false;
    }


    function getArticleData () {
        var possibleElements = document.querySelectorAll ('article,div,section,td,li');
        var articleObj = {
            wordCount : 0 ,
            paragraphsCount:0,
            element : null
        };
        var length = possibleElements.length;
        for (var i = 0 ; i < length ; i++) {
            var element = possibleElements[i];
            var paragraphsCount = countParagraphs(element);
            if (paragraphsCount > articleObj.paragraphsCount) {
                articleObj.element = element;
                articleObj.wordCount = countWords (element);
                articleObj.paragraphsCount = paragraphsCount;
            }
        }

        return articleObj;
    }
    
    function countParagraphs(element){
        var count = 0;
        var len = element.childNodes.length;
        for(var i=0;i<len;i++){
            var childNode = element.childNodes[i];
            if(childNode && childNode.nodeType == 1 && childNode.tagName.toLowerCase() == "p"){
                count++;
            }
        }
        return count;
    }

    function countWords (element) {
        var text = element.innerText;
        if (text) {
            var words = text.split (' ');
            if (typeof(words.length) != "undefined") {
                return words.length
            }
        }
    }

    function getReadingTime (words) {
        if (words < wordsPerMinute) {
            return "less than a minute";
        }
        else {
            var minutes = words / wordsPerMinute;
            if (minutes) {
                return "about " + parseInt (minutes) + " minutes";
            }
        }
    }

    function getReadingTimeForElement (element) {
        var wordCount = countWords (element);
        return getReadingTime (wordCount);
    }

} ()    );
