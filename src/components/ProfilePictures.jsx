import { useRef, useState } from 'react';
import './ProfilePictures.css';

const GRAVATAR_URL = 'https://gravatar.com/avatar/f3b3d719305fd56253fd657958d7c90e?s=512';
const LINKEDIN_URL = '/favicon.png'; // TODO: change this

export default function ProfilePictures() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [gravatarFront, setGravatarFront] = useState(true);
  const aRef = useRef(null);
  const bRef = useRef(null);

  const toggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const toFront = gravatarFront ? bRef.current : aRef.current;
    const toBack = gravatarFront ? aRef.current : bRef.current;

    toFront.classList.remove('is-front', 'is-back');
    toBack.classList.remove('is-front', 'is-back');
    toFront.classList.add('anim-to-front');
    toBack.classList.add('anim-to-back');

    let doneCount = 0;
    const onDone = (el, finalClass) => {
      el.classList.remove('anim-to-front', 'anim-to-back');
      el.classList.add(finalClass);
      doneCount += 1;
      if (doneCount === 2) {
        setGravatarFront(!gravatarFront);
        setIsAnimating(false);
      }
    };

    toFront.addEventListener('animationend', () => onDone(toFront, 'is-front'), { once: true });
    toBack.addEventListener('animationend', () => onDone(toBack, 'is-back'), { once: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className="relative h-[420px] w-[560px] cursor-pointer select-none"
      role="button"
      tabIndex="0"
      aria-label="Toggle which profile photo is in front"
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={aRef}
        id="photoA"
        className={`photo overflow-hidden rounded-full border-4 border-brand bg-brand shadow-[0_14px_30px_rgba(0,0,0,0.4)] ${
          gravatarFront ? 'is-front' : 'is-back'
        }`}
      >
        <img src={GRAVATAR_URL} alt="Gravatar profile" />
      </div>
      <div
        ref={bRef}
        id="photoB"
        className={`photo overflow-hidden rounded-full border-4 border-brand bg-brand shadow-[0_14px_30px_rgba(0,0,0,0.4)] ${
          gravatarFront ? 'is-back' : 'is-front'
        }`}
      >
        <img src={LINKEDIN_URL} alt="LinkedIn profile" />
      </div>
    </div>
  );
}
