import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },

}

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === ' ' ? "\u00A0" : char}
    </span>
  ))
}

const setupTextHover = (container, type) => {
  if (!container) return;

  const letters = container.querySelectorAll("span")
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetters = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration, ease: 'power2.out',
      fontVariationSettings: `'wght' ${weight}`,
    });
  }
  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left


    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2))
      const intensity = Math.exp(-(distance ** 2) / 2000);

      animateLetters(letter, min + (max - min) * intensity);
    })
  }
  const handleMouseLeave = () => {
    letters.forEach((letter) => {
      animateLetters(letter, base, 0.3);
    })
  }

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseleave', handleMouseLeave);
  }
}


const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, 'title');
    const subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle');

    return () => {
      if (titleCleanup) titleCleanup();
      if (subtitleCleanup) subtitleCleanup();
    }
  }, [])
  return (
    <section id="welcome">
      <p ref={subtitleRef} className='text-3xl font-georama'>
        {renderText(
          "Hey, I'm Mohsen! Welcome to my",
          'letter',
          100)}</p>
      <h1 ref={titleRef} className='mt-7 text-9xl italic font-georama'>{renderText(
        " macfolio",
        'letter',
        400)}</h1>

      <div className='small-screen'>
        <p>This version is designed for Laptops/Tablets. The mobile version is underconstruction. Try to visit this website until we finishing the mobile version</p>
        <button className='portfolio-btn'>
          <a className="portfolio-btn"href='https://mohssenmbarokha.vercel.app' target='_blank'>Click here</a>
        </button>
      </div>
    </section>
  )
}

export default Welcome
