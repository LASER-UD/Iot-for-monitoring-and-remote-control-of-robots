var polyEl = document.querySelector('.svg-attributes-demo polygon');
var feTurbulenceEl = document.querySelector('feTurbulence');
var feDisplacementMap = document.querySelector('feDisplacementMap');
polyEl.setAttribute('points', '64 46.36 40 35 8.574 15 63.446 47.32 64 111 64.554 47.32 88 35 119.426 15','fill','red');
feTurbulenceEl.setAttribute('baseFrequency', '.05');
feDisplacementMap.setAttribute('scale', '15'); /*DEMO*/
var animation = anime({
    targets: ['.svg-attributes-demo polygon', 'feTurbulence', 'feDisplacementMap',],
    points: '64 19 36.4 0 8.574 19 20.574 83 64 115 105.426 83 119.426 19 91.713 0',
    baseFrequency: 0,
    scale: 1,
    loop: true,
    autoplay: false,
    direction: 'alternate',
    easing: 'easeInOutExpo'
});