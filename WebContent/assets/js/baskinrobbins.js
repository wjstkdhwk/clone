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
        menu_fom: function() {
            var that = this,
                wrap = $('.view_insta'),
                dot = wrap.find('> .dslide'),
                dots;

            // 플러그인 사용으로 인해 사용 안함
            // that.p_instagram({
            //  dataLen:20,
            //  pageLen:10
            // });
        },
        menu_list: function() {
            var that = this;

            // MONTHLY BEST ICECREAM
            var bestSlider = $('#slider'),
                bestWrap = bestSlider.find('.list_wrap'),
                bestList = bestWrap.find('li'),
                currentWidth = bestSlider.width(),
                bestSliderWidth,
                bestWrapWidth,
                posXMax;

            /*! monthly best icecream

                bestSlider: 마우스 움직이는 영역
                bestWrap: 리스트 전체 영역
                bestList: 리스트 각각

                bestSliderWidth: bestSlider 가로값
                bestWrapWidth: bestWrap 가로값

                posXMax: bestWrap가 움직일 수 있는 최대치

                1. init
                    > bestWrapWidth width 설정 = bestList 가로값 * bestList 개수
                    > bestWrap width 설정 = bestWrapWidth

                    > bestSlider width 지정
                    > posXMax 설정 = 리스트 전체 영역 - 마우스 움직이는 영역 (bestWrapWidth - bestSliderWidth);

                2. reset
                    > bestSlider width 재설정

                3. mousemove
                    > posXMax가 0 이상일때만 이벤트 발생
                    > 마우스 좌표 구하기 = e.pageX
                    > 마우스 좌표에 따른 x값 = (마우스 좌표 / bestSliderWidth) * posXMax
            */

            var MBI = {
                reset: function() {
                    bestSliderWidth = bestSlider.width();
                    posXMax = (bestWrapWidth - bestSliderWidth) > 0 ? (bestWrapWidth - bestSliderWidth) : 0;

                    bestWrap['css']('position', (!posXMax ? 'static' : 'absolute'));
                },

                getMoveX: function(posX) {
                    return -1 * posXMax * (posX / bestSliderWidth);
                },

                move: function(e) {
                    if (posXMax) bestWrap.css('left', MBI.getMoveX(e.pageX) + 'px');
                    return false;
                },

                init: function() {
                    bestWrapWidth = bestList.width() * bestList.length;
                    bestWrap.css('width', bestWrapWidth + 'px');

                    this.reset();
                }
            };

            MBI.init();
            $window.on('resize', MBI.reset);
            bestSlider.on('mousemove', MBI.move);
        },
        menu_view: function() {
            var that = this,
                wrap = $('.main_insta'),
                $this = $('[data-instagram]'),
                dot = wrap.find('> .dslide'),
                dots;

            var dataInsta = $this.length && $this.data().instagram;

            that.instagram({
                dataLen: 20,
                pageLen: 5
            });

            that.slide({
                continuous: false,
                autoRestart: false
            }, $('[data-api="slide"]'));

            // 이전다음 실행
            this.prevnext();

            ////////////////////////////

            var ice = $('#modal_consist'),
                iceInfo = ice.find('.modal_content'),
                iceLink = ice.find('.link .buy'),
                ice_search = function(opts) {
                    $.ajax({
                        async: false,
                        type: 'get',
                        url: '/menu/icecream_ajax.php',
                        data: opts,
                        success: function(res) {
                            var data = $.parseJSON($.trim(res)),
                                html = '',
                                htmllink = '',
                                t = data;

                            if (data) {
                                if (data.solddiv == 'Y') {
                                    html += '<div class="prd">';
                                } else {
                                    html += '<div class="prd sold">';
                                }
                                html += '<div class="photo">';
                                html += '   <img src="' + t.img + '" alt="' + t.title + '">';
                                html += '</div>';
                                html += '<h2 class="name">';
                                html += '   <small>' + t.etitle + '</small>';
                                html += '   ' + t.title + '';
                                html += '</h2>';
                                html += '<p class="content">' + t.explain + '</p>';
                                if (data.solddiv == 'Y') {
                                    html += '<p class="linkview">';
                                    html += '   <a href="/menu/view.php?seq=' + t.seq + '"><img   src="/assets/images/menu/btn_goview.gif" alt="제품상세페이지"></a>';
                                    html += '</p>';
                                }
                                html += '</div>';
                                if (data.solddiv == 'Y') {
                                    html += '<div class="link">';
                                    html += '   <nav class="sns">';
                                    html += '       <ul>';
                                    html += '           <li class="favorite">';
                                    html += '               <a href="#none" data-api="favorite" data-seq=' + t.seq;
                                    if (t.flavor == 'add') {
                                        html += ' class="on"';
                                    }
                                    html += '>';
                                    html += '                   <span>좋아하는 플레이버 등록</span>';
                                    html += '               </a>';
                                    html += '           </li>';
                                    html += '           <li>';
                                    html += '               <a href="#none" role="button" data-sns="facebook" data-snsdata="{' + "'title':'[BASKINROBBINS]','description':'[" + t.title.replace("<br>", "") + "] " + t.explain + "','url':'http://2016testbaskin.baskinrobbins.co.kr/menu/view.php?seq=" + t.seq + "'}" + '">';
                                    html += '                   <img src="/assets/images/common/icon_facebook.png" alt="FACEBOOK">';
                                    html += '               </a>';
                                    html += '           </li>';
                                    html += '           <li>';
                                    html += '               <a href="#none"  role="button" data-sns="twitter" data-snsdata="{' + "'title':'[BASKINROBBINS]','description':'[" + t.title.replace("<br>", "") + "] " + t.explain + "','url':'http://2016testbaskin.baskinrobbins.co.kr/menu/view.php?seq=" + t.seq + "'}" + '">';
                                    html += '                   <img src="/assets/images/common/icon_twitter.png" alt="TWITTER">';
                                    html += '               </a>';
                                    html += '           </li>';
                                    html += '           <li>';
                                    html += '               <a href="#none" role="button" data-sns="copyurl" data-snsdata="{' + "'title':'[BASKINROBBINS]','description':'[" + t.title.replace("<br>", "") + "] " + t.explain + "','url':'http://2016testbaskin.baskinrobbins.co.kr/menu/view.php?seq=" + t.seq + "'}" + '">';
                                    html += '                   <img src="/assets/images/common/icon_copy.png" alt="copy">';
                                    html += '               </a>';
                                    html += '           </li>';
                                    html += '       </ul>';
                                    html += '   </nav>';
                                    html += '<p class="buy">';
                                    html += '<a href="' + t.buy + '" target="_blank">해피콘 구매하기</a>';
                                    html += '</p>';
                                    html += '</div>';
                                }
                            }

                            (ice.find('.favorite a').attr('data-seq', t.seq))[t.flavor + 'Class']('on');

                            iceInfo.html(html);
                            iceLink.html(htmllink);
                            that.modal.toggle(ice);
                        }
                    })
                };

            $document
                .on('click', '.view_flavor a', function() {
                    ice_search({ seq: $(this).data().seq });
                })
        },
        event: function() {
            var that = this;

            var winner = $('#modal_winner'),
                winner_list = winner.find('.list ul'),
                winner_content = winner.find('.cont'),
                list_search = winner.find('.search'),

                winner_search = function(opts) {
                    $.ajax({
                        async: false,
                        type: 'get',
                        url: '/event/winner_ajax.php',
                        data: opts,
                        success: function(res) {
                            var data = $.parseJSON($.trim(res)),
                                html = '';

                            winner_list.empty().show();
                            winner_content.empty().show();
                            list_search.show()
                                .find('input').val('')
                                .next().data('seq', data.seq);

                            if (data.content) {
                                winner_content.html(data.content);
                                winner_list.hide();
                                list_search.hide();
                            } else {
                                $.each(data.data, function() {
                                    html += '<li>' + this + '</li>';
                                });
                                winner_list.html(html);
                                winner_content.hide();
                            }

                            that.modal.toggle(winner);
                        }
                    })
                };

            $document
                // 당첨자 발표
                .on('click', '.winner a', function() {
                    winner_search({ seq: $(this).data().seq });
                })

                // 당첨자 아이디 찾기
                .on('keypress', '#search_winner', function(e) {
                    if (e.keyCode == 13) return false;
                })

                // 당첨자 아이디 찾기
                .on('click', '#modal_winner .search button', function() {
                    var $this = $(this),
                        value = $.trim($this.prev().val());

                    winner_search({ seq: $(this).data().seq, search: value });

                    return false;
                })
        },
        prevnext: function() {
            var wrap = $('.page_prevnext'),
                maxTop = 0,
                offsetTop = wrap.offset().top;

            var timer = setInterval(function() {
                var t = $('#footer').offset().top - parseInt($('#content').css('padding-bottom'), 10);
                if (maxTop == t) {
                    clearInterval(timer);
                    timer = null;
                    return;
                }

                maxTop = t;
            }, 500);

            $window
                .on('scroll', function() {
                    var t = offsetTop + $window.scrollTop();

                    t = maxTop < t ? maxTop : t;

                    wrap.stop().animate({ top: t + 'px' }, 800);
                })
        },
        event_view: function() {
            var that = this;
            var storeout = $('#modal_storeout'),
                store_list = storeout.find('.list ul'),
                storeout_search = function(opts) {
                    $.ajax({
                        async: false,
                        type: 'get',
                        url: '/event/exceptstore_ajax.php',
                        data: opts,
                        success: function(res) {
                            var data = $.parseJSON($.trim(res)),
                                html = '';

                            $.each(data.data, function() {
                                html += '<li>' + this + '</li>';
                            });

                            store_list.html(html);

                            that.modal.toggle(storeout);
                        }
                    })

                };

            // 이전다음 실행
            this.prevnext();

            $document
                // 행사제외매장
                .on('click', '.event_view_service .out', function() {
                    //storeout_search({seq: $(this).data().seq});
                    storeout_search({ seq: $(this).data().seq, eType: $(this).data().etype });
                    that.modal.toggle(storeout);
                })

                // 행사제외매장 매장찾기
                .on('keypress', '#search_storeout', function(e) {
                    if (e.keyCode == 13) return false;
                })

                // 행사제외매장 매장찾기
                .on('click', '#modal_storeout .search button', function() {
                    var $this = $(this),
                        value = $.trim($this.prev().val());

                    storeout_search({ seq: $(this).data().seq, search: value, eType: $(this).data().etype });


                    return false;
                });
            that.slide({
                continuous: false,
                autoRestart: false
            }, $('[data-api="slide"]'));

        },
        store_map: function(param) {
            var that = this,
                event = $('.promotion'),
                dot = event.find('> .dslide'),
                dots;


            var form = $('#nform'),
                gugun = $('.store_search .location_2'),
                list = $('.store_search .list ul'),
                getGugun = function(data) {
                    $.ajax({
                        async: false,
                        type: 'post',
                        url: 'addr_gugun_ajax.php',
                        data: data,
                        success: function(res) {
                            gugun.html($.trim(res));
                        }
                    });
                };

            $document
                // 구/군 선택
                .on('change', '.location_1', function() {
                    getGugun({ sido: $(this).val() });
                })

                // 옵션 (매장별 서비스)
                .on('click', '.options a', function() {
                    var $this = $(this);

                    if ($this.is('.on')) {
                        $this.removeClass('on').attr('aria-expanded', 'false');
                    } else {
                        $this.addClass('on').attr('aria-expanded', 'true');
                    }
                    return false;
                })

            this.map(param);

            that.slide({
                continuous: false,
                autoRestart: false
            }, $('[data-api="slide"]'));

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

            var Marker = {
                data: [],
                set: function(idx, pos) {
                    var image = {
                            // 주소
                            src: '/assets/images/store/icon_map_marker_' + (idx + 1) + '.png',
                            // 사이즈
                            size: new daum.maps.Size(44, 65),
                            // 초기좌표
                            option: { offset: new daum.maps.Point(22, 65) }
                        },
                        markerImage = new daum.maps.MarkerImage(image.src, image.size, image.option);

                    var marker = new daum.maps.Marker({
                        position: pos,
                        image: markerImage
                    });

                    this.data.push(marker);

                    marker.setMap(map);

                    return marker;
                },
                clear: function() {
                    this.data = [];
                }
            };

            var Infowindow = {
                data: [],
                set: function(data, pos) {
                    var template = $('#template_store_info1').html();
                    Mustache.parse(template);
                    var content = Mustache.render(template, data);

                    var infowindow = new daum.maps.InfoWindow({
                        position: pos,
                        content: content,
                        removable: true
                    });

                    this.data.push(infowindow);

                    return infowindow;
                },
                clear: function() {
                    this.data = [];
                },
                hide: function() {
                    $.each(this.data, function() {
                        this.close();
                    });
                },
                show: function(idx, map, marker) {
                    this.data[idx].open(map, marker);
                },
                toggle: function(idx, map, marker) {
                    this.hide();
                    this.show(idx, map, marker);
                }
            };

            var List = {
                getData: function(opts) {
                    var result;

                    $.ajax({
                        async: false,
                        url: '/store/list_ajax.php',
                        data: (opts ? opts : $('#nform').serialize()),
                        success: function(res) {
                            result = $.parseJSON(res);
                        }
                    });
                    return result;
                },
                setData: function(data) {
                    this.list = [];

                    for (var key in data) {
                        this[key] = data[key];
                    }
                },
                setList: function() {
                    var template = $('#template_store_list').html(),
                        html = '',
                        pos;

                    Marker.clear();
                    Infowindow.clear();
                    elem.map.empty();

                    if (this.list.length) {
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

            var FavoriteList = {
                getData: function(opts) {
                    var result;

                    $.ajax({
                        async: false,
                        url: '/store/favortie_list_ajax.php',
                        success: function(res) {
                            result = $.parseJSON(res);
                        }
                    });
                    return result;
                },
                setData: function(data) {
                    this.list = [];

                    for (var key in data) {
                        this[key] = data[key];
                    }
                },
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
                // 내 위치
                /*.on('click', '.store_search .search a', function () {
                    searchCurrentLocation();

                    elem.total.addClass('show');
                    return false;
                })*/
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
        about_notice_view: function() {
            var that = this;
            var storeout = $('#modal_storeout'),
                store_list = storeout.find('.list ul'),
                storeout_search = function(opts) {
                    $.ajax({
                        async: false,
                        type: 'get',
                        url: '/about/exceptstore_ajax.php',
                        data: opts,
                        success: function(res) {
                            var data = $.parseJSON($.trim(res)),
                                html = '';

                            $.each(data.data, function() {
                                html += '<li>' + this + '</li>';
                            });

                            store_list.html(html);

                            that.modal.toggle(storeout);
                        }
                    })

                };

            $document
                // 행사제외매장
                .on('click', '.board_view_content .out', function() {
                    storeout_search({ seq: $(this).data().seq });
                    that.modal.toggle(storeout);
                })

                // 행사제외매장 매장찾기
                .on('keypress', '#search_storeout', function(e) {
                    if (e.keyCode == 13) return false;
                })

                // 행사제외매장 매장찾기
                .on('click', '#modal_storeout .search button', function() {
                    var $this = $(this),
                        value = $.trim($this.prev().val());

                    storeout_search({ seq: $(this).data().seq, search: value });

                    return false;
                });

        },
        about_f_faq: function() {
            var faqBox = $('#f_faq'),
                writeBox = $('#inquiry_write');

            // 폼리셋
            function clearFields(id) {
                var frm = document.getElementById(id);
                var em = frm.elements;
                frm.reset();
                for (var i = 0; i < em.length; i++) {
                    switch (em[i].type) {
                        case 'checkbox':
                            //case 'radio':
                            em[i].checked = false;
                            break;
                        default:
                            em[i].value = '';
                            break;
                    }
                }
                return;
            }

            $document
                // 온라인 창업 문의하기
                .on('click', '.btn_inquiry a', function() {
                    if (!$.trim($('#is_login').val())) {
                        if (confirm('로그인 후 이용해주세요.')) {
                            location.href = '/sso/login.php';
                        } else {
                            return false;
                        }
                    } else {
                        faqBox.hide();
                        writeBox.show();
                        clearFields('storeInquiry');
                        $(".selectbox").selectmenu("refresh");
                    }
                    return false;
                })

            // 창업faq list
            $('.br_about_f_faq').on('click', '.list_wrap a', function() {
                var $this = $(this);
                $('.list_wrap a').next('.answer').slideUp();
                $('.list_wrap li').removeClass('on');
                $this.parent('li').toggleClass('on');
                if ($this.parent('li').is('.on')) {
                    $this.next('.answer').slideDown();
                } else {
                    $this.next('.answer').slideUp();
                }
                return false;
            });

            // 온라인 창업 문의하기
            var sido = $('#sidogun'),
                gudong = $('#gudong'),
                userName = $('#userName'),
                storeHave = $('input[name = storeHave]'),
                userPhone = $('#userPhone'),
                email = $('#email'),
                urlSelect = $('#urlSelect'),
                textUrl = $('#textUrl'),
                inquiryTit = $('#inquiryTit'),
                inquiryCont = $('#inquiryCont'),
                agreeBtn = $('.agree_chk a'),
                agreeChk = $('#agreeChk'),
                noagreeChk = $('#noagreeChk'),
                emailUrl = false;

            // 시도 선택하면 구군 불러오기
            sido.on('change', function() {
                //  alert(this.value);
                var $this = $(this)
                $.ajax({
                    async: false,
                    type: 'post',
                    url: '/store/addr_gugun_ajax.php',
                    data: { sido: this.value },
                    success: function(res) {
                        $('#gudong').html($.trim(res));
                    }
                });
            });

            // 이메일 직접입력
            urlSelect.on('change', function() {
                var $this = $(this)
                if ($this.val() == 'enter') {
                    emailUrl = true;
                    textUrl.show();
                } else {
                    textUrl.hide();
                }
            });

            // 개인정보 수집 및 이용 체크
            agreeBtn.removeClass('on');
            agreeBtn.on('click', function() {
                var $this = $(this);
                agreeBtn.removeClass('on');
                $this.addClass('on');
                return false;
            });

            function formChk() {
                if (!$.trim(sido.val())) {
                    alert('시,군,도를 선택해주세요');
                    sido.focus();
                    return false;
                }
                if (!$.trim(gudong.val()) && $.trim(sido.val()) != "세종") {
                    alert('상세 지역을 선택해주세요');
                    gudong.focus();
                    return false;
                }
                if (!$.trim(userName.val())) {
                    alert('이름을 입력해주세요');
                    userName.focus();
                    return false;
                }
                if (!$.trim($('input[name = storeHave]:checked'))) {
                    storeHave.focus();
                    alert('점포소유를 선택해주세요');
                    return false;
                }
                if (!$.trim(userPhone.val())) {
                    userPhone.focus();
                    alert('긴급 연락처를 입력해주세요');
                    return false;
                }
                if (!$.trim(email.val())) {
                    email.focus();
                    alert('이메일을 입력해주세요');
                    return false;
                }
                if (!$.trim(urlSelect.val())) {
                    alert('이메일 url을 선택해주세요.');
                    urlSelect.focus();
                    return false;
                }
                if (emailUrl) {
                    if (!$.trim(textUrl.val())) {
                        alert('이메일 url을 직접 입력해주세요.');
                        textUrl.focus();
                        return false;
                    }
                }
                if (!$.trim(inquiryTit.val())) {
                    alert('제목을 입력해주세요');
                    inquiryTit.focus();
                    return false;
                }
                if (!$.trim(inquiryCont.val())) {
                    alert('내용을 입력해주세요');
                    inquiryCont.focus();
                    return false;
                }
                if (noagreeChk.is('.on')) {
                    alert('개인정보 수집 및 이용에 동의해주셔야 등록이 가능합니다.');
                    agreeChk.focus();
                    return false;
                }
                if (!agreeChk.is('.on')) {
                    alert('개인정보 수집 및 이용에 동의해주세요');
                    agreeChk.focus();
                    return false;
                }
                return true
            }

            $document
                // 등록
                .on('click', '.submit', function() {
                    sido.val()
                    if (formChk()) {
                        $("#storeInquiry").submit();
                        //var storeHaveVal = $('input:radio[name=storeHave]:checked').val();
                        //alert('등록이 완료되었습니다');
                        //writeBox.hide(); // 온라인 창업 문의 작성
                        //faqBox.show(); // 창업faq list
                        return false;
                    }
                    return false;
                })
                // 취소
                .on('click', '.cancel', function() {
                    if (window.confirm('작성을 취소하시겠습니까?')) {
                        writeBox.hide();
                        faqBox.show();
                    }
                    return false;
                })
        },
        about_loan_info: function() {

            $document.on('click', '.common_tap li', function() {
                var $this = $(this);
                var $tap = $('.common_tap');
                var $area = $('.tap_area');
                var idx = $this.index();

                $tap.find('a').removeClass('on');
                $this.find('a').addClass('on');
                $area.removeClass('on');
                $area.eq(idx).addClass('on');

                return false;
            });
            $document
                // 고객센터 faq
                .on('click', '.list_wrap a', function() {
                    var $this = $(this);

                    $('.list_wrap a').next('.answer').slideUp();
                    $('.list_wrap li').removeClass('on');
                    $this.parent('li').toggleClass('on');
                    if ($this.parent('li').is('.on')) {
                        $this.next('.answer').slideDown();
                    } else {
                        $this.next('.answer').slideUp();
                    }
                    return false;
                });
        },
        customer_ccm: function() {

            var $tap = $('.common_tap a');
            var $area = $('.tap_area');

            $document.on('click', '.common_tap li a', function() {
                var idx = $(this).closest('li').index();

                $tap
                    .removeClass('on')
                    .eq(idx).addClass('on');

                $area
                    .removeClass('on')
                    .eq(idx).addClass('on');

                return false;
            });
        },
        // > 개인정보취급방침
        customer_faq: function() {
            $document
                // 고객센터 faq
                .on('click', '.list_wrap a', function() {
                    var $this = $(this);

                    $this.parent('li').siblings().find('.answer').slideUp();
                    $this.parent('li').siblings().removeClass('on');

                    if ($this.parent('li').hasClass('on')) {
                        $this.parent('li').removeClass('on');
                        $this.next('.answer').slideUp();
                    } else {
                        $this.parent('li').addClass('on');
                        $this.next('.answer').slideDown();
                    }
                    return false;
                });
        },
        customer_praise: function() {
            var that = this;

            var historySelect = $('#praise_history'),
                currentHistory;
            // select
            (function() {
                var options = '';



                for (var key in BR_PRAISE_DATA) {
                    options += '<option value="' + key + '">' + key.replace('-', '년 ') + '분기</option>'
                }
                historySelect.html(options);
            })();

            var customData,
                target = {
                    thanks: $('#praise_thanks'),
                    title: $('#praise_title'),
                    list: $('#praise_list')
                },
                template = {
                    thanks: $('#template_praise_thanks').html(),
                    title: $('#template_praise_title').html(),
                    list: $('#template_praise_list').html(),
                    modal: $('#template_praise_modal').html()
                },
                setContent = function() {
                    var d = BR_PRAISE_DATA[currentHistory],
                        data = {},
                        quarter = currentHistory.replace('-', '년 ') + '분기',
                        i = 1;
                    for (var key in target) {
                        if (key == 'list') {
                            data[key] = [];

                            $.each(d, function(idx) {
                                data[key][idx] = d[idx];
                                data[key][idx]['idx'] = idx + 1;
                            });

                            customData = data[key];
                        } else {
                            data[key] = { quarter: quarter };
                        }

                        target[key].html(Mustache.render(template[key], data[key]));
                    }

                };

            currentHistory = historySelect.val();
            setContent(currentHistory);

            $(document)
                .on('change', '#praise_history', function() {
                    currentHistory = this.value;
                    setContent(currentHistory);
                })
                .on('click', '#praise_list a', function() {
                    var $this = $(this),
                        target = $($this.attr('href'));

                    target.find('.modal_container').html(Mustache.render(template['modal'], customData[$this.data().idx - 1]));

                    that.modal.toggle(target);
                    return false;
                });
        },
        customer_policy: function() {
            $document
                // 지난 개인정보취급방침 보기
                .on('change', '.history select', function() {
                    $(this).closest('form').submit();
                });
        },
        mybr_happypoint: function() {
            var that = this,
                event = $('.promotion'),
                dot = event.find('> .dslide'),
                dots;

            that.slide({
                continuous: false,
                autoRestart: false
            }, $('[data-api="slide"]'));
        },
        mybr_store: function() {
            var that = this;

        },
        mybr_flavor: function() {
            var that = this,
                event = $('.favor_slide'),
                dot = event.find('> .dslide'),
                dots;
            that.slide({
                continuous: false,
                autoRestart: false
            }, $('[data-api="slide"]'));

        },
        search: function() {
            var hashTag = $('.hash dd a'),
                inp = $('.searchform .my-placeholder');
            hashTag.on('click', function() {
                var txt = $(this).text();

                inp.val(txt);
            });
        },
        search_result: function() {
            var box = $('.search_product_total');
            $document
                .on('click', '.result_total a', function() {
                    box.toggleClass('on');
                    return false;
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
        /*      event_view : function(){
                    var that = this
                    that.slide({
                        continuous: false,
                        autoRestart: false
                    },$('[data-api="slide"]'));


                },*/
        // 좋아하는 플레이버
        favorite: function() {
            $document
                .on('click', '[data-api="favorite"]', function(e) {
                    var $this = $(this),
                        d = $this.data(),
                        seq = d.seq,
                        fdiv = d.fdiv || 'menu';

                    e.preventDefault();

                    if ($.trim($('#is_login').val())) {
                        $.ajax({
                            type: 'post',
                            url: '/mybr/favorite_proc_ajax.php',
                            data: {
                                fdiv: fdiv,
                                seq: seq
                            },
                            success: function(response) {
                                response = $.trim(response);

                                if (response == 'add') {
                                    alert((fdiv == 'menu' ? '좋아하는 플레이버에 등록되었습니다.\n좋아하는 플레이버는 MY BR에서 확인가능합니다.' : '자주가는 매장에 등록되었습니다.\n자주가는 매장은 MY BR에서 확인 가능합니다.'));
                                } else if (response == 'remove') {
                                    alert((fdiv == 'menu' ? '좋아하는 플레이버가 등록 해지 되었습니다.' : '자주가는 매장이 등록 해지 되었습니다.'));
                                } else if (response == 'login') {
                                    alert('로그인 후 이용해주세요.');
                                    location.href = '/sso/login.jsp';
                                    return false;
                                }

                                $('[data-api="favorite"][data-seq="' + seq + '"]')[response + 'Class']('on');
                            },
                            error: function() {}
                        });
                    } else {
                        if (confirm('로그인 페이지로 이동합니다')) {
                            location.href = '/sso/login.php';
                        }
                    }
                });
        },

        instagram: function(options) {
            return false;
            var that = this;
            $.each($('[data-instagram]'), function() {
                var $this = $(this);

                var opts = {
                    dataLen: 20,
                    pageLen: 5
                };
                // 옵션 추가
                if (options) {
                    for (var key in options) {
                        opts[key] = options[key];
                    }
                };
                var viewInsta = function(opts) {
                    $.ajax({
                        async: false,
                        type: 'GET',
                        dataType: 'jsonp',
                        url: 'https://api.instagram.com/v1/tags/' + $this.data().instagram + '/media/recent?client_id=a3ed757d31434da8bcb696752cc736eb&count=' + opts.dataLen,
                        success: function(res) {
                            var data = res.data,
                                html = '',
                                t;

                            if (opts.dataLen) {
                                for (var i = 0; i < opts.dataLen; i++) {
                                    if (i % opts.pageLen == 0) {
                                        html += '<div class="list_product">';
                                        html += '<ul class="list">';
                                    }
                                    t = data[i];

                                    html += '<li>';
                                    html += '   <figure>';
                                    html += '       <a href="' + t.link + '" target="_blank">';
                                    html += '           <img src="' + t.images.low_resolution.url + '" alt="">';
                                    html += '       </a>';
                                    html += '   </figure>';
                                    html += '</li>';
                                    if (i % opts.pageLen == (opts.pageLen - 1)) {
                                        html += '</ul>';
                                        html += '</div>';
                                    }

                                }

                                $this.find('.swipe_wrap').html(html);

                                that.slide({
                                    continuous: false,
                                    autoRestart: false
                                }, $this);

                            } else {
                                $this.closest('.view_instagram').hide();
                            }


                        },
                        error: function(res, status, err) {
                            alert("인스타그램 API 연동중 예기치 못한 오류가 발생되었습니다.\n관리자에게 문의해주세요. Type-1");
                        }
                    });
                };
                viewInsta(opts);
            });
        },
        p_instagram: function(options) {
            var that = this;
            $.each($('[data-pinstagram]'), function() {
                var $this = $(this);

                var opts = {
                    dataLen: 24,
                    pageLen: 12
                };
                // 옵션 추가
                if (options) {
                    for (var key in options) {
                        opts[key] = options[key];
                    }
                };
                var viewInsta = function(opts) {
                    $.ajax({
                        //async: false,
                        type: 'GET',
                        dataType: 'jsonp',
                        timeout: 3000,
                        url: 'https://api.instagram.com/v1/users/1535227389/media/recent?access_token=1535227389.a3ed757.4ce3f2aec0a7445ebe5e93407042595e&count=' + opts.dataLen,
                        success: function(res) {
                            var data = res.data,
                                html = '',
                                t;
                            if (opts.dataLen) {
                                for (var i = 0; i < opts.dataLen; i++) {
                                    if (i % opts.pageLen == 0) {
                                        html += '<div class="list_product">';
                                        html += '<ul class="list">';
                                    }
                                    t = data[i];
                                    html += '<li>';
                                    html += '   <figure>';
                                    html += '       <a href="' + t.link + '" target="_blank">';
                                    html += '           <img src="' + t.images.low_resolution.url + '" alt="">';
                                    html += '       </a>';
                                    html += '   </figure>';
                                    html += '</li>';
                                    if (i % opts.pageLen == (opts.pageLen - 1)) {
                                        html += '</ul>';
                                        html += '</div>';
                                    }

                                }

                                $this.find('.swipe_wrap').html(html);

                                that.slide({
                                    continuous: false,
                                    autoRestart: false
                                }, $this);

                            } else {
                                $this.closest('.view_instagram').hide();
                            }

                        },
                        error: function(res, status, err) {
                            //alert ("인스타그램 API 연동중 예기치 못한 오류가 발생되었습니다.\n관리자에게 문의해주세요. Type-1");
                            if ($this.find('li').length) {
                                that.slide({}, $this);
                            }
                        }
                    });
                };
                viewInsta(opts);
            });
        },
        hashtag: function() {
            $.each($('[data-api="hashtag"]'), function() {
                var $this = $(this),
                    prevnext = $this.find('> .btns');

                var swipe = new Swipe($this.find('> .swipe')[0], {
                    continuous: false
                });

                prevnext.on('click', 'a', function() {
                    $(this).is('.prev') ? swipe.prev() : swipe.next();
                    return false;
                });
            });
        },
        sns_init: function() {
            var that = this,
                og = {};

            var setOg = function(ogData, isProperty) {
                if (isProperty) {
                    $.each(ogData, function() {
                        var $this = $(this);

                        og[$this.attr('property').replace('og:', '')] = $this.attr('content');
                    });
                } else {
                    for (var key in ogData) {
                        og[key] = ogData[key];
                    }
                }
            };

            setOg($('[property^="og:"]'), true);

            $document
                .on('click', '[data-sns]', function() {
                    var data = $(this).data();

                    if ('snsdata' in data) {
                        setOg($.parseJSON(data.snsdata.replace(/'/g, '"')));
                    }

                    that.sns(og, data);
                    return false;
                });
        },
        sns: function(og, data) {
            var url;

            switch (data.sns) {
                case 'facebook':
                    url = 'http://facebook.com/sharer.php?u=' + og.url;
                    url = url.split('#').join('%23');
                    url = encodeURI(url);

                    window.open(url, 'snsfacebook', 'width=600,height=250,scrollbars=yes');
                    break;

                case 'twitter':
                    url = 'http://twitter.com/share';
                    url += '?text=' + encodeURIComponent(og.title + '\n' + og.description + '\n');
                    url += '&url=' + encodeURIComponent(og.url);
                    window.open(url, 'snstwitter', 'width=700,height=400,scrollbars=yes');
                    break;

                case 'copyurl':
                    prompt('주소를 복사해서 사용해주세요.', og.url);
                    break;
            };
        },
        param: function() {
            var search = location.search.substr(1),
                pairs,
                query = {};

            if (search) {
                search = search.replace(/(&amp;)/g, '&');
                pairs = search.split('&');

                $.each(pairs, function() {
                    var t = this.split('=');
                    query[t[0]] = t[1];
                });

                return query;
            }

            return false;
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