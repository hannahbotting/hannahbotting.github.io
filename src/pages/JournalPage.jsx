import { useEffect } from 'react';

export default function JournalPage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Journal';
  }, []);

  return (
    <section className="mx-auto max-w-280">
      <h1 className="m-0 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">Journal</h1>
      <p className="mt-4 text-[1.15rem] leading-relaxed">
        Journal
      </p>
    </section>
  );
}
