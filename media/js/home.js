/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    "use strict";

    var $window = $(window);
    var $nav = $('#page-nav');
    var $head = $('#masthead');
    var headHeight = $head.height();

    // Sticky navigation
    var fixed = false;
    var didScroll = false;

    $window.scroll(function() {
        didScroll = true;
    });

    $(document).ready(function() {
        var scrollTop = $window.scrollTop();
        if ( scrollTop > 0 ) {
            didScroll = true;
        }
    });

    function adjustScrollbar() {
        if (didScroll) {
            didScroll = false;
            var scrollTop = $window.scrollTop();
            if( scrollTop > 0 ) {
                if(!fixed) {
                    fixed = true;
                    $head.addClass("fixed");
                }
            } else {
                if(fixed) {
                    fixed = false;
                    $head.removeAttr("class");
                }
            }
        }
    }

    // Check for an adjusted scrollbar every 100ms.
    setInterval(adjustScrollbar, 100);

    // Change the navbar color and current item to match the section waypoint
    function waypointCallback(current, previous) {
        return function(event, direction) {
            if (fixed) {
                if (direction === 'down') {
                    $nav.attr('class', 'fixed ' + current);
                    $nav.find("li").removeClass();
                    $("#" + current).addClass("current");
                }
                else {
                    $nav.attr('class', 'fixed ' + previous);
                    $nav.find("li").removeClass();
                    $("#" + previous).addClass("current");
                }
            }
        };
    }

    // Fire the waypoints for each section, passing classes for the current and previous sections
    // Uses jQuery Waypoints http://imakewebthings.com/jquery-waypoints/
    $('#intro').waypoint(waypointCallback('',''), { offset: $head.height() + 10 });
    $('#about').waypoint(waypointCallback('nav-about', ''), { offset: $head.height() + 10 });
    $('#winners2012').waypoint(waypointCallback('nav-winners', 'nav-about'), { offset: $head.height() + 10 });
    $('#judges').waypoint(waypointCallback('nav-judges', 'nav-winners'), { offset: $head.height() + 10 });
    $('#prizes').waypoint(waypointCallback('nav-prizes', 'nav-judges'), { offset: $head.height() + 10 });
    $('#rules').waypoint(waypointCallback('nav-rules', 'nav-prizes'), { offset: $head.height() + 10 });
    

    // Scroll to the linked section
    $window.on('click', '#page-nav a[href*="#"], a.scroll', function(e) {
        e.preventDefault();
        // Extract the target element's ID from the link's href.
        var elem = $(this).attr("href").replace( /.*?(#.*)/g, "$1" );
        $('html, body').animate({
            scrollTop: $(elem).offset().top
        }, 1000, function() {
            $(elem).attr('tabindex','100').focus().removeAttr('tabindex');
        });
    });

    // Load videos in a full-page modal
    $("a.video-play").click( function(e) {
        e.preventDefault();
        var $origin = $(this);
        var video = $origin.data("vimeoId");
        var content = '<iframe id="video" src="https://player.vimeo.com/video/'+ video +'?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff&amp;autoplay=1" width="500" height="375" frameborder="0"></iframe>';        
        createModal($origin, content);
    });

    // Create a full-page overlay and append the content
    function createModal(origin, content) {
        if ($("#fill").length > 0) {
            $("#fill").remove();
        }
        $('body').addClass("noscroll").append('<div id="fill"><div id="inner"></div></div>');
        $("#inner").append(content);
                                              
        // Add the close button
        $("#close").clone().appendTo("#inner");
        $("#fill #close").bind('click', function() {
            $("#fill").remove();
            $("body").removeClass("noscroll");
        });

        // Close on background click
        $("#fill, #inner").bind('click', function(e) {
            $("#fill").remove();
            $("body").removeClass("noscroll");
            origin.focus();
        });

        // Close on escape
        $("#fill").bind('keyup', function(e) {
            if (e.keyCode === 27) { // esc
                $("#fill").remove();
                $("body").removeClass("noscroll");
                origin.focus();
            }
        });
    }

})();

