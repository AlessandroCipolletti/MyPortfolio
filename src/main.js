import './main.css'
import animateElement from 'js-math-and-ui-utils/animationsUtils/animateElement'
import getRandomNumber from 'js-math-and-ui-utils/mathUtils/getRandomNumber'
import roundNumber from 'js-math-and-ui-utils/mathUtils/roundNumber'
import throttle from 'js-math-and-ui-utils/jsUtils/throttle'


let mainDom, scrollingElements
let lastWheelY = 0

const onScroll = (e) => {
  const current = mainDom.scrollTop
  if (lastWheelY === current) {
    return
  }
  lastWheelY = current

  console.log('scroll', mainDom.scrollHeight, mainDom.scrollTop)

  for (const el of scrollingElements) {
    if (current < el.from) {
      el.dom.style.animationDelay = '-0s'
    } else if (current >= el.to) {
      el.dom.style.animationDelay = '-100s'
    } else {
      el.dom.style.animationDelay = `-${roundNumber(100 * ((current - el.from) / (el.to - el.from)), 5)}s`
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
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 0.33 },
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 0.66 },
      { top: `${getRandomNumber(5, 95, 0)}%`, left: `${getRandomNumber(10, 90, 0)}%`, transform: `translate3d(-50%, -50%, 0px) rotate(${getRandomNumber(-30, 30, 0)}deg)`, offset: 1 },
    ], getRandomNumber(90, 130, 0) * 1000, {
      iterations: Infinity,
      direction: 'alternate',
      easing: 'linear',
    })
  }
}

const initScroll = () => {
  scrollingElements = Array.from(
    document.querySelectorAll('.scrolling')
  ).map(el => ({
    dom: el,
    from: parseInt(el.dataset.scrollFrom),
    to: parseInt(el.dataset.scrollTo),
  }))
  const maxScroll = Math.max(...scrollingElements.map(el => el.to))
  const pageHeight = maxScroll + window.innerHeight
  document.querySelector('section').style.height = `${pageHeight}px`
}

const init = () => {
  mainDom = document.querySelector('main')
  mainDom.addEventListener('wheel', throttle(onScroll, 1000 / 60))

  initBlobs()
  initScroll()
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    init()
  }
}
