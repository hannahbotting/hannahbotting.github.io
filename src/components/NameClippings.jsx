import { useEffect, useState } from 'react';
import h from '../assets/letters/h.png';
import a from '../assets/letters/a.png';
import n from '../assets/letters/n.png';
import n1 from '../assets/letters/n1.png';
import a1 from '../assets/letters/a1.png';
import h1 from '../assets/letters/h1.png';
import b from '../assets/letters/b.png';
import o from '../assets/letters/o.png';
import t from '../assets/letters/t.png';
import t1 from '../assets/letters/t1.png';
import i from '../assets/letters/i.png';
import n2 from '../assets/letters/n2.png';
import g from '../assets/letters/g.png';

const hannah = [
  { src: h, alt: 'H', rot: 4 },
  { src: a, alt: 'a', rot: -5 },
  { src: n, alt: 'n', rot: 2 },
  { src: n1, alt: 'n', rot: 6 },
  { src: a1, alt: 'a', rot: -3 },
  { src: h1, alt: 'h', rot: -2 },
];

const botting = [
  { src: b, alt: 'B', rot: -6 },
  { src: o, alt: 'o', rot: 4 },
  { src: t, alt: 't', rot: -2 },
  { src: t1, alt: 't', rot: 6 },
  { src: i, alt: 'i', rot: -4 },
  { src: n2, alt: 'n', rot: 3 },
  { src: g, alt: 'g', rot: 5 },
];

const jitter = () => (letters) => letters.map((letter) => letter.rot + Math.floor(Math.random() * 13) - 6);

function LetterGroup({ letters, current }) {
  return (
    <div className="flex items-center">
      {letters.map((letter, index) => (
        <img
          key={index}
          src={letter.src}
          alt={letter.alt}
          className="h-10 w-auto -ml-1 first:ml-0 select-none transition-transform duration-300"
          style={{ transform: `rotate(${current[index]}deg)` }}
        />
      ))}
    </div>
  );
}

export default function NameClippings() {
  const [hannahJitter, setHannahJitter] = useState(hannah.map((l) => l.rot));
  const [bottingJitter, setBottingJitter] = useState(botting.map((l) => l.rot));

  useEffect(() => {
    const interval = setInterval(() => {
      setHannahJitter(jitter()(hannah));
      setBottingJitter(jitter()(botting));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-y-2" role="img" aria-label="Hannah Botting">
      <LetterGroup letters={hannah} current={hannahJitter} />
      <LetterGroup letters={botting} current={bottingJitter} />
    </div>
  );
}
