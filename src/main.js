import './main.css'
import { isTablet, isMobile, isBrowser } from 'mobile-device-detect'
import animateElement from 'js-math-and-ui-utils/animationsUtils/animateElement'
import getRandomNumber from 'js-math-and-ui-utils/mathUtils/getRandomNumber'
import roundNumber from 'js-math-and-ui-utils/mathUtils/roundNumber'
import throttle from 'js-math-and-ui-utils/jsUtils/throttle'


const MAX_DELAY = 100 // seconds
const FPS = 45

let mainDom, parallaxElements
let lastWheelY = 0

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

const onScroll = (e) => {
  mainDom.scrollLeft = 0
  const current = mainDom.scrollTop
  if (lastWheelY === current) {
    return
  }
  lastWheelY = current
  // console.log('scroll', mainDom.scrollHeight, mainDom.scrollTop, mainDom.scrollWidth, mainDom.scrollLeft)
  // console.log(e.deltaX, e.deltaY)

  for (const el of parallaxElements) {
    if (current < el.from) {
      el.dom.style.animationDelay = '-0s'
      el.dom.classList.remove('ongoing')
    } else if (current >= el.to) {
      el.dom.style.animationDelay = '-100s'
      el.dom.classList.remove('ongoing')
    } else {
      const delay = roundNumber(MAX_DELAY * ((current - el.from) / (el.to - el.from)), 5)
      el.dom.style.animationDelay = `-${delay}s`
      el.dom.classList.add('ongoing')
    }
  }
}

const initBlobs = () => {
  const blobs = Array.from(document.querySelectorAll('.blob'))
  const maxSize = window.innerWidth / 3
  for (const blob of blobs) {
    blob.style.width = `${getRandomNumber(maxSize / 2, maxSize, 0)}px`
    blob.classList.remove('displayNone')
    animateElement(blob, 'move', [
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 0 },
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 0.25 },
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 0.50 },
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 0.75 },
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 1 },
    ], getRandomNumber(100, 150, 0) * 1000, {
      iterations: Infinity,
      direction: 'alternate',
      easing: 'linear',
      commitResult: true,
    })
  }
}

const initScroll = () => {
  // document.querySelector('section.card1').animate(
  //   [
  //     { top: '0px', offset: 0 },
  //     { top: '-1000px', offset: 1 },
  //   ],
  //   { duration: 10000, // Totally arbitrary!
  //     fill: 'both',
  //     timeline: new ScrollTimeline({
  //       scrollOffsets: [
  //         CSS.px(0),
  //         CSS.px(window.innerHeight),
  //       ],
  //     })
  //   }
  // )

  parallaxElements = Array.from(
    document.querySelectorAll('.parallax')
  ).map(el => ({
    dom: el,
    from: parseFloat(el.dataset.scrollFrom) * window.innerHeight,
    to: parseFloat(el.dataset.scrollTo) * window.innerHeight,
  }))
  const maxScroll = Math.max(...parallaxElements.map(el => el.to))
  const pageHeight = maxScroll + window.innerHeight
  document.querySelector('#scroller').style.height = `${pageHeight}px`
}

const init = async() => {
  mainDom = document.querySelector('main')
  if (!isTablet && !isMobile && isBrowser) {
    window.addEventListener('wheel', throttle(onScroll, 1000 / FPS))
  } else {
    mainDom.addEventListener('scroll', throttle(onScroll, 1000 / FPS))
  }

  document.documentElement.style.setProperty('--maxDelay', `${MAX_DELAY}s`)

  initBlobs()
  initScroll()

  await delay(500)
  document.querySelector('.card1').classList.remove('transparent')
  document.querySelector('.socials').classList.remove('transparent')
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    init()
  }
}
