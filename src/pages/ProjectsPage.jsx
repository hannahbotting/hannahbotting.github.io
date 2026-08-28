import { useEffect } from 'react';
import Scene from '../three/Scene';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Projects';
  }, []);

  return (
    <section className="mx-auto max-w-[720px] p-8">
      <h1 className="mb-2 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">Projects</h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed">
        Projects
      </p>
      <div className="mt-8">
        <Scene />
      </div>
    </section>
  );
}
