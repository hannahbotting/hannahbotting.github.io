import { useEffect } from 'react';
import ProfilePictures from '../components/ProfilePictures';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Home';
  }, []);

  return (
    <section className="mx-auto grid max-w-[1120px] grid-cols-[minmax(320px,1fr)_auto] items-center justify-center gap-12 max-md:grid-cols-1">
      <div className="order-2 max-w-[30rem] max-md:order-1">
        <h1 className="m-0 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">Hannah Botting</h1>
        <p className="mt-4 text-[1.15rem] leading-relaxed">
          WIP
        </p>
      </div>
      <div className="order-1 flex items-center justify-center max-md:order-2">
        <ProfilePictures />
      </div>
    </section>
  );
}
