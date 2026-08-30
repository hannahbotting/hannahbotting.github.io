import { useScene, MAX_OBJECTS } from './sceneStore';

export default function ModelCounter() {
  const { objects } = useScene();
  const modelCount = objects.filter((object) => object.movable).length;

  return (
    <div className="text-white d-flex gap-1 bg-opacity-75 bg-dark px-2 py-1" id="model-counter-container">
      <p className="p-0 m-0">Models:</p>
      <p className="p-0 m-0" id="model-counter">
        {modelCount}/{MAX_OBJECTS}
      </p>
    </div>
  );
}