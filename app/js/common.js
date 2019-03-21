'use strict';

document.addEventListener( 'DOMContentLoaded', function( event ) {

    //*********************************************************//
    //Lazy load for images
    //*********************************************************//
    ( function() {

        const lazyLoadImg = new IntersectionObserver(

            function( entries ) {

                for ( let i = 0; i < entries.length; i++  ) {

                    const entry = entries[ i ];
                    const target = entry.target;

                    if ( entry.isIntersecting && target.hasAttribute( 'data-lazy-load' ) ) {

                        if ( target.nodeName === 'IMG' ) {
                            target.setAttribute( 'src', target.getAttribute( 'data-lazy-load' ) );
                        } else if ( target.nodeName === 'SOURCE' ) {
                            target.setAttribute( 'srcset', target.getAttribute( 'data-lazy-load' ) );
                        } else {
                            target.style.backgroundImage = 'url(' + target.getAttribute( 'data-lazy-load' ) + ')';
                        }

                        target.removeAttribute( 'data-lazy-load' )

                        lazyLoadImg.unobserve( target );

                        target.style.opacity = 1;
                    }
                }
            },
            {
                root: null,
                rootMargin: ( window.innerHeight / 2 ) + 'px ' + ( window.innerWidth / 2 ) + 'px',
                threshold: [ 0 ],
            }
        );

        // Start observing an element
        const lazyLoadImgElems = document.querySelectorAll( '[ data-lazy-load ]' );

        for ( let i = 0; i < lazyLoadImgElems.length; i++  ) {

            lazyLoadImg.observe( lazyLoadImgElems[ i ] );

            lazyLoadImgElems[ i ].style.opacity = 0;
            lazyLoadImgElems[ i ].style.transition = '1s';
        }

    } () );


    //*********************************************************//
    //YANDEX MAP
    //*********************************************************//
    ( function() {

        const mapElem = document.querySelector( '#map' );

        if ( mapElem ) {

            const lazyLoadMap = new IntersectionObserver(

                function( entries ) {

                    for ( let i = 0; i < entries.length; i++  ) {

                        const entry = entries[ i ];
                        const target = entry.target;

                        if ( entry.isIntersecting ) {

                            const script = document.createElement( 'script' );

                            script.src = '//api-maps.yandex.ru/2.1/?lang=ru_RU';

                            document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

                            script.onload = function() {

                                ymaps.ready( function() {

                                const myMap = new ymaps.Map( 'map', {
                                    center: [ 55.564830, 88.096385 ],
                                    zoom: 3,
                                    controls: [],
                                    behaviors: [ 'drag', 'dblClickZoom', 'rightMouseButtonMagnifier', 'multiTouch' ]
                                }, {
                                    searchControlProvider: 'yandex#search'
                                });

                                //Элементы управления
                                myMap.controls.add( 'zoomControl', {
                                    size: 'small',
                                    position: {
                                        top: 'auto',
                                        right: 10,
                                        bottom: 50
                                    }
                                } );

                                myMap.geoObjects.add( new ymaps.Placemark(
                                    [ 55.769833, 37.426492 ],
                                    {
                                        hintContent: 'Адрес: г. Москва, ул. Крылатская, д.15',
                                        balloonContent: 'Адрес: г. Москва, ул. Крылатская, д.15',
                                    },
                                    {
                                        iconLayout: 'default#image',
                                        iconImageHref: 'img/icon-mark.svg',
                                        iconImageSize: [ 39, 30 ],
                                        iconImageOffset: [ 0, -30 ],
                                    }
                                ) ).add( new ymaps.Placemark(
                                    [ 43.357888, 133.445069 ],
                                    {
                                        hintContent: 'Адрес: г. Москва, ул. Крылатская, д.15',
                                        balloonContent: 'Адрес: г. Москва, ул. Крылатская, д.15',
                                    },
                                    {
                                        iconLayout: 'default#image',
                                        iconImageHref: 'img/icon-mark.svg',
                                        iconImageSize: [ 39, 30 ],
                                        iconImageOffset: [ 0, -30 ],
                                    }
                                ) );

                                //Вкл/Выкл драг карты при адаптиве
                                const manageDrag = function() {
                                    window.innerWidth <= 992 ? myMap.behaviors.disable( 'drag' ) : myMap.behaviors.enable( 'drag' )
                                };
                                window.onload = manageDrag
                                window.onresize = manageDrag

                                //перерисуем карту по ресайзу
                                typeof ResizeObserver === 'object' && new ResizeObserver( function( entries ) {
                                    myMap.container.fitToViewport()
                                } ).observe( mapElem );

                                //перерисуем карту после инициализации
                                myMap.container.fitToViewport();

                            } );

                            }

                            lazyLoadMap.unobserve( target );
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: ( window.innerHeight / 2 ) + 'px ' + ( window.innerWidth / 2 ) + 'px',
                    threshold: [ 0 ],
                }
            );

            // Start observing an element
            lazyLoadMap.observe( mapElem );

        }

    } () );

});
