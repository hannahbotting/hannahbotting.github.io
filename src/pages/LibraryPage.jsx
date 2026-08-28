import { useEffect } from 'react';

export default function LibraryPage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Library';
  }, []);

  return (
    <section className="mx-auto max-w-[720px] p-8">
      <h1 className="mb-2 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">Library</h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed">
        Library
      </p>
    </section>
  );
}
