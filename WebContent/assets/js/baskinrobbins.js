// 콘솔
!window.console && (window.console = { log: function() {} });

(function(window) {
    'use strict';

    var $window = $(window),
        $document = $(document),
        $body = $('body');

    var BR = {
        modal: {
            timer: null,
            show: function(target) {
                this.body.addClass('open_modal');

                target.addClass('in');
                clearTimeout(this.timer);
                this.timer = setTimeout(function() {
                    target.addClass('on');
                }, 50);
            },
            hide: function(target) {
                this.body.removeClass('open_modal');

                target = target ? target : this.elem;

                target.removeClass('in on');
            },
            toggle: function(target, notClose) {
                var that = this;

                this.hide();
                this.show(target);
                target.off();

                if (notClose) return false;

                target.on('click', '.modal_bg, .modal_close a', function(e) {
                    e.preventDefault();
                    that.hide(target);
                });
            },
            init: function() {
                var that = this;

                this.elem = $('.modal');
                this.body = $('body');

                window.BR.Modal = {};
                $.each(['show', 'hide', 'toggle'], function() {
                    var _this = this;

                    window.BR.Modal[this] = function(target, notClose) {
                        that[_this](target, notClose);
                    };
                });

                $(document)
                    .on('click', '[data-api="modal"]', function(e) {
                        e.preventDefault();
                        that.toggle($($(this).attr('href')));
                    });
            }
        },
        sliderList: function() {
            function Slider(container, options) {
                this.defaultOptions = {
                    container: false
                };
                this.container = container;
                this.options = $.extend({}, this.defaultOptions, options);
                this.slideWrap = this.container.find('.list_wrap');
                this.slideList = this.container.find('.wrap_li');
                this.reset();
            }

            Slider.prototype = {
                constructor: Slider,
                reset: function() {
                    this.slideWidth = this.container.width();
                    this.slideWrapWidth = this.slideList.outerWidth() * this.slideList.length;
                    this.posXMax = (this.slideWrapWidth - this.slideWidth) > 0 ? (this.slideWrapWidth - this.slideWidth) : 0;
                    this.containerOffsetLeft = this.container.offset().left;
                    this.slideWrap.css({
                        'width': this.slideWrapWidth + 'px',
                        'position': (!this.posXMax ? 'static' : 'absolute')
                    });
                },
                move: function(e) {
                    /*
                        - this.slideWidth = 컨테이너의 가로값
                        - this.poXMax = 컨테이너 가로 - 윈도우 왼쪽기준 컨테이너의 왼쪽 위치값
                        - e.pageX = 윈도우 기준 마우스의 가로 좌표값
                        - movePosition = 컨테이너 움직이는 보정 값
                     */
                    var movePosition = -1 * this.posXMax * ((e.pageX - this.containerOffsetLeft) / this.slideWidth);
                    if (this.posXMax) this.slideWrap.css('left', (movePosition) + 'px');
                }
            };

            $.each(['slider-coffee-hot', 'slider-coffee-ice'], function() {
                var target = $('#' + this),
                    options,
                    slider;
                //if (this == 'slider-coffee-hot') {options = {container: true}};

                if (target.length) {
                    slider = new Slider(target, options);

                    $(window)
                        .on('load resize', slider.reset.bind(slider));
                    target
                        .on('mousemove', slider.move.bind(slider));
                }
            });
        },
        header: function() {
            var that = this;
            var search = $('#modal_search');

            $document
                // 해쉬태그 입력
                .on('click', '[name="searchform"] .hashtag a', function() {
                    var $this = $(this);
                    $('[name="ScHashtag"]').val($this.text());
                    return false;
                })
                // SEARCH 닫기
                .on('click', '#modal_search .modal_bg, #modal_search .modal_close a', function() {
                    // 검색 초기화
                    (function() {

                        $.each(search.find('input'), function() {
                            if (this.type == 'text') {
                                this.value = '';
                            } else {
                                this.checked = false;
                            }
                        });

                        $.each(search.find('.search_category_1 option'), function(idx) {
                            this.selected = (idx !== 0 ? false : true);
                        });
                    })();

                    that.modal.hide(search);
                    return false;
                });
        },
        // 하단 메뉴
        footer: function() {
            var that = this;

            var unsubscribe = $('#modal_unsubscribe');

            $document
                // 패밀리 사이트
                .on('click', '.familysite button, .familysite a', function() {
                    $(this).toggleClass('on');
                })

                // 이메일무단수집거부
                .on('click', '[data-api="unsubscribe"]', function() {
                    that.modal.toggle(unsubscribe);
                    return false;
                })

                // 고객센터
                .on('click', '[data-api="voc"]', function() {
                    var $this = $(this);

                    window.open($this.attr('href') + '?DIV=' + $this.data().div, 'voc', 'width=920,height=900,resizable=yes,scrollbars=yes');
                    return false;
                })

        },
        main: function() {
            var that = this,
                wrap = $('.view_insta'),
                $this = $('[data-pinstagram]'),
                dot = wrap.find('> .dslide'),
                dots,
                isScorll;

            $window.on('scroll.main.scroll', function() {
                if ($(this).scrollTop() > 186) {
                    $('.flavor_banner a').addClass('on');
                    $window.off('scroll.main.scroll');
                    rollBn();
                }
            });

            function rollBn() {
                that.slide({
                    speed: 400,
                    auto: 3000,
                    continuous: true,
                    autoRestart: true
                }, $('.main_banner [data-api="slide"]'));
            }
            that.slide({
                continuous: false,
                autoRestart: false
            }, $('[data-api="slide"]').not('.main_banner [data-api="slide"]'));
            // that.p_instagram({
            //  dataLen:12,
            //  pageLen:12
            // });
        },
        map: function(param) {
            var that = this;
            var map, defaultPos;

            var elem = {
                map: $('#store_map'),
                total: $('.store_search .total'),
                list: $('.store_search .scroll ul'),
                favoriteBox: $('.favorite_box')
            };

            this.slide({
                continuous: false,
                autoRestart: false
            }, $('.event_ongoing[data-api="slide"]'));
            var List = {
                reset: function(opts) {
                    var d = this.getData(opts);
                    this.setData(d);
                    this.setList();
                }
            };
            var FavoriteList = {
                setList: function() {
                    var template = $('#template_favorite_list').html(),
                        template2 = $('#template_favorit_login').html(),
                        html = '',
                        pos;

                    Marker.clear();
                    Infowindow.clear();
                    elem.map.empty();
                    elem.list.empty();

                    elem.favoriteBox.html(Mustache.render(template2, this));

                    if (this.login && this.list.length) {
                        $.each(this.list, function(idx) {
                            var that = this;
                            pos = new daum.maps.LatLng(this.pointX, this.pointY);

                            this.idx = idx;
                            this.num = idx + 1;
                            this.info = JSON.stringify(this);

                            if (idx == 0) {
                                map = new daum.maps.Map(elem.map[0], {
                                    center: pos,
                                    level: 3
                                });
                                map.panTo(pos);
                            }

                            var marker = Marker.set(idx, pos);

                            Infowindow.set(this, pos);

                            daum.maps.event.addListener(marker, 'click', function() {
                                Infowindow.toggle(idx, map, this);
                            });


                            html += Mustache.render(template, this);

                        });
                    } else {
                        pos = new daum.maps.LatLng(this['default'].pointX, this['default'].pointY);
                        map = new daum.maps.Map(elem.map[0], {
                            center: pos,
                            level: 3
                        });
                        map.panTo(pos);
                    }

                    elem.total.find('strong').text(this.cnt);
                    elem.list.html(html);

                },
                reset: function(opts) {
                    var d = this.getData(opts);
                    this.setData(d);
                    this.setList();
                }
            };
            var searchCurrentLocation = function() {
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            var opts = {
                                px: position.coords.latitude,
                                py: position.coords.longitude
                            }

                            param = param || {};

                            List.reset(('S' in param ? '' : opts));
                        },
                        function(error) {
                            switch (error.code) {
                                case error.PERMISSION_DENIED:
                                    console.log(error.code);
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    console.log(error.code);
                                    break;
                                case error.TIMEOUT:
                                    console.log(error.code);
                                    break;
                                case error.UNKNOWN_ERROR:
                                    console.log(error.code);
                                    break;
                            }

                            List.reset();
                        }, {
                            enableHighAccuracy: true,
                            maximumAge: 60000,
                            timeout: 5000
                        }
                    );
                } else {
                    List.reset();
                }
            };

            map = new daum.maps.Map(elem.map[0], {
                // 지도의 중심좌표
                //center: new daum.maps.LatLng(37.4979864023722, 127.02767228700851),
                center: new daum.maps.LatLng(33.450701, 126.570667),
                // 지도의 확대 레벨
                level: 3
            });

            searchCurrentLocation();

            var tab = $('.store_search .tab a'),
                tabBox = $('.tabbox');


            $(document)
                // 탭
                .on('click', '.store_search .tab a', function() {
                    var $this = $(this),
                        box = $this.attr('href');

                    tab.removeClass('on');
                    $this.addClass('on');
                    tabBox.hide();
                    $(box).show();

                    if (box == '#find_box') {
                        List.reset();
                    } else {
                        FavoriteList.reset();
                    }
                    return false;
                })
                // 매장찾기
                .on('click', '.store_search .search button', function() {
                    List.reset($(this).closest('form').serialize());

                    elem.total.addClass('show');
                    return false;
                })

                // 리스트 클릭
                .on('click', '.store_search .list [data-info]', function() {
                    var d = $(this).data().info,
                        pos = new daum.maps.LatLng(d.pointX, d.pointY);

                    Infowindow.toggle(d.idx, map, Marker.data[d.idx]);
                    map.panTo(pos);
                    return false;
                })
                // 자세히 보기
                .on('click', '.store_info .detail', function() {
                    var template = $('#template_modal_store').html(),
                        modal = $('#store_details');

                    $.ajax({
                        async: false,
                        url: '/store/store_info_ajax.php',
                        data: { S: $(this).data().seq },
                        success: function(res) {
                            var data = $.parseJSON($.trim(res));
                            modal.find('.modal_content').html(Mustache.render(template, data));
                            that.modal.toggle(modal);

                            if (data.event) {
                                that.slide({
                                    continuous: false,
                                    autoRestart: false
                                }, $('#store_details [data-api="slide"]'));
                            }
                        }

                    });
                    return false;
                })
            var wrap = $('.store_hashtag'),
                event = $('.event_ongoing'),
                dot = event.find('> .dslide'),
                dots;

        },
        search: function() {
            var hashTag = $('.hash dd a'),
                inp = $('.searchform .my-placeholder');
            hashTag.on('click', function() {
                var txt = $(this).text();

                inp.val(txt);
            });
        },

        slide: function(options, target) {
            $.each(target, function() {
                var $this = $(this),
                    dot = $this.find('> .dslide'),
                    dots,
                    prevnext = $this.find('> .btns'),
                    current = 0,
                    len

                var opts = {
                    continuous: false,
                    transitionEnd: function(index, elem) {
                        current = index;
                        toggleDot();
                    }
                };

                var toggleDot = function() {
                    if (dots) dots.removeClass().eq(current).addClass('active');
                };

                // 옵션 추가
                if (options) {
                    for (var key in options) {
                        opts[key] = options[key];
                    }
                }

                // 스와이프 생성
                var swipe = new Swipe($this.find('> .swipe')[0], opts);

                // 도트
                (function() {
                    len = swipe.getNumSlides();

                    if (len < 2) {
                        prevnext.hide();
                        return;
                    }

                    for (var i = 0; i < len; i++) {
                        dot.append('<a href="#none"' + (i == 0 ? ' class="active"' : '') + '>' + (i + 1) + '<span></span></a>');
                    }

                    dots = dot.find('a');
                })();

                // 이전 다음
                prevnext.on('click', 'a', function() {
                    $(this).is('.prev') ? swipe.prev() : swipe.next();
                    return false;
                });

                // 도트 클릭
                dot.on('click', 'a', function() {
                    current = $(this).text() - 1;
                    swipe.slide(current);

                    return false;
                });

                if (opts.auto) {
                    $this.on({
                        'mouseenter': function() {
                            swipe.stop();
                        },
                        'mouseleave': function() {
                            swipe.restart();
                        }
                    });
                }
            });
        },

        init: function() {
            var id = $body.attr('id').replace('br_', ''),
                sub = $('#wrap').attr('class').replace('br_', ''),
                that = this;
            $(function() {
                that.modal.init();
                that.search();
            });
            $document.on('ready', function() {
                (id in that) && that[id]();
                (sub in that) && that[sub](that.param());
                // 상단
                that.header();
                // 하단
                that.footer();
                // sns
                that.sns_init();
                // 좋아하는 플레이버 등록
                that.favorite();
                // menu/view
                that.sliderList();
            });
        }
    };

    window.BR = window.BR || {};

    BR.init();
})(this);