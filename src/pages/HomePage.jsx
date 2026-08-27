import { useEffect } from 'react';
import Scene from '../three/Scene';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Home';
  }, []);

  return (
    <section className="mx-auto grid max-w-[1120px] grid-cols-[1fr_minmax(320px,560px)] items-center gap-8 max-md:grid-cols-1">
      <div className="max-w-[34rem]">
        <h1 className="m-0 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">My Website!</h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed">
          WIP
        </p>
      </div>
      <Scene />
    </section>
  );
}
