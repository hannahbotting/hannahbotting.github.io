import { useEffect } from 'react';
import Scene from '../three/Scene';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Projects';
  }, []);

  return (
    <section className="mx-auto max-w-280">
      <h1 className="m-0 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">Projects</h1>
      <p className="mt-4 text-[1.15rem] leading-relaxed">
        Your Space
      </p>
      <div className="mt-8">
        <Scene />
      </div>
    </section>
  );
}
