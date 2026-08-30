import { useState } from 'react';
import { sceneStore, useScene } from './sceneStore';
import { snapObjectToFloor, changeObjectColour, changeObjectLightIntensity, changeObjectWarmth } from './materials';
import { ICON_OBJECT_CONTROLS, ICON_LIGHTING } from './libraryIcons';

function LightControls({ root }) {
  return (
    <div className="d-flex align-items-center p-3 gap-5" style={{ minHeight: '115px' }}>
      <div className="d-flex flex-column gap-3 align-content-between">
        <label className="text-light fw-bold" htmlFor="intensity-slider">Brightness:</label>
        <label className="text-light fw-bold" htmlFor="warmth-slider">Warmth:</label>
      </div>
      <div className="d-flex flex-column gap-3" style={{ minWidth: '250px' }}>
        <input
          className="form-range"
          id="intensity-slider"
          type="range"
          step="0.01"
          defaultValue={root?.userData?.lightIntensity ?? 50}
          onChange={(event) => changeObjectLightIntensity(root, parseFloat(event.target.value))}
        />
        <input
          className="form-range"
          id="warmth-slider"
          type="range"
          step="0.01"
          defaultValue={root?.userData?.warmth ?? 50}
          onChange={(event) => changeObjectWarmth(root, parseFloat(event.target.value))}
        />
      </div>
    </div>
  );
}

export default function ObjectDetails() {
  const [activeTab, setActiveTab] = useState('controls');
  const { selectedId, coordinates, transformMode, objects, tick } = useScene();
  void tick;

  const selected = selectedId ? sceneStore.getObject(selectedId) : null;
  const root = selectedId ? sceneStore.getRef(selectedId) : null;

  if (!selected || !root) return null;

  const { x, y, z } = coordinates;
  const isLight = !!root?.userData?.isLight;
  const colour = selected.colour ?? '#ffffff';
  const movable = selected.movable ?? true;

  const refreshCoordinates = () => {
    sceneStore.actions.setCoordinates({
      x: root.position.x,
      y: root.position.y,
      z: root.position.z,
    });
  };

  const toggleInput = (mode, label) => (
    <input
      autoComplete="off"
      className="btn-check"
      id={`vbtn-${mode}`}
      name="vbtn-radio"
      type="radio"
      checked={transformMode === mode}
      onChange={() => sceneStore.actions.setTransformMode(mode)}
    />
  );

  return (
    <div className="position-absolute me-3 mb-3" id="object-details-menu" style={{ bottom: 0, right: 0, maxWidth: '70%' }}>
      {isLight && (
        <ul className="nav nav-tabs border-0 justify-content-end" id="object-details-tab-buttons" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={`nav-link tab-button border border-secondary ${activeTab === 'controls' ? 'active' : ''}`}
              id="object-controls-btn"
              role="tab"
              onClick={() => setActiveTab('controls')}
            >
              <p className="d-none d-sm-block m-0" style={{ minWidth: '140px' }}>Object Controls</p>
              {ICON_OBJECT_CONTROLS.map((svg, index) => (
                <span key={index} className="d-sm-none" dangerouslySetInnerHTML={{ __html: svg }} />
              ))}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              className={`nav-link tab-button border border-secondary ${activeTab === 'lighting' ? 'active' : ''}`}
              id="lighting-controls-btn"
              role="tab"
              onClick={() => setActiveTab('lighting')}
            >
              <p className="d-none d-sm-block m-0" style={{ minWidth: '140px' }}>Lighting Controls</p>
              {ICON_LIGHTING.map((svg, index) => (
                <span key={index} className="d-sm-none" dangerouslySetInnerHTML={{ __html: svg }} />
              ))}
            </button>
          </li>
        </ul>
      )}

      <div
        className={`tab-content bg-opacity-75 border border-secondary bg-dark rounded-2 overflow-x-scroll ${isLight ? 'no-rounded-top-left-corner' : ''}`}
        id="object-details-box"
      >
        {activeTab === 'controls' && (
          <div className="tab-pane fade show active p-0" id="object-controls-tab" role="tabpanel" style={{ minHeight: '115px' }}>
            <div className="d-flex gap-3 align-items-center p-3 justify-content-center" style={{ width: 'fit-content', minHeight: '115px' }}>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="text-light text-truncate" id="object-name">{selected.entry.name}</h5>
                  {movable && (
                    <button className="btn btn-danger btn-sm" id="removeObjectButton" type="button" onClick={() => sceneStore.actions.removeObject(selected.id)}>
                      Delete
                    </button>
                  )}
                </div>
                <div className="d-flex gap-2" id="coordinates-container" style={{ minWidth: '250px' }}>
                  <p className="text-nowrap text-light p-0 m-0" id="object-coordinates-x">X: {(x * 1).toFixed(2)}</p>
                  <p className="text-nowrap text-light p-0 m-0" id="object-coordinates-y">Y: {(y * 1).toFixed(2)}</p>
                  <p className="text-nowrap text-light p-0 m-0" id="object-coordinates-z">Z: {(z * 1).toFixed(2)}</p>
                </div>
              </div>

              <label className="text-light d-flex flex-column align-items-center justify-content-sm-between justify-content-center" htmlFor="colour-picker">
                <p className="p-0 m-0 d-none d-sm-block text-nowrap">Change Colour:</p>
                <svg height="40" style={{ fill: colour }} viewBox="0 0 640 640" width="40" xmlns="http://www.w3.org/2000/svg">
                  <path
                    id="colour-picker-icon"
                    d="M290.4 70C288.9 66.4 285.4 64 281.5 64L262.5 64C258.6 64 255 66.4 253.6 70L232.9 121.7C229.7 129.7 218.3 129.7 215.1 121.7L194.4 70C192.9 66.4 189.4 64 185.5 64L176 64C149.5 64 128 85.5 128 112L128 320L512 320L512 112C512 85.5 490.5 64 464 64L358.5 64C354.6 64 351 66.4 349.6 70L328.9 121.7C325.7 129.7 314.3 129.7 311.1 121.7L290.4 70zM128 368L128 384C128 419.3 156.7 448 192 448L256 448L256 512C256 547.3 284.7 576 320 576C355.3 576 384 547.3 384 512L384 448L448 448C483.3 448 512 419.3 512 384L512 368L128 368zM320 528C311.2 528 304 520.8 304 512C304 503.2 311.2 496 320 496C328.8 496 336 503.2 336 512C336 520.8 328.8 528 320 528z"
                    fill={colour}
                  />
                </svg>
                <input
                  id="colour-picker"
                  type="color"
                  style={{ backgroundColor: 'transparent', border: 'none', color: 'transparent', width: 0, height: 0, padding: 0 }}
                  value={colour}
                  onChange={(event) => {
                    sceneStore.actions.setObjectColour(selected.id, event.target.value);
                    if (!movable) changeObjectColour(root, event.target.value);
                  }}
                />
              </label>

              {movable && (
                <div className="d-flex flex-column align-items-center gap-2" id="scale-div">
                  <p className="m-0 p-0 text-white">Scale:</p>
                  <input
                    className="form-control"
                    id="scale-input"
                    type="number"
                    step="0.01"
                    maxLength="10"
                    style={{ width: '150px' }}
                    value={selected.scale}
                    onChange={(event) => {
                      const value = parseFloat(event.target.value);
                      if (Number.isFinite(value) && value > 0) {
                        sceneStore.actions.setObjectProps(selected.id, { scale: value });
                      }
                    }}
                  />
                </div>
              )}

              {movable && (
                <button
                  className="btn btn-sm btn-secondary text-nowrap"
                  id="snapToFloorBtn"
                  style={{ height: '2.2rem' }}
                  type="button"
                  onClick={() => {
                    snapObjectToFloor(root);
                    refreshCoordinates();
                  }}
                >
                  Snap to Floor
                </button>
              )}

              {movable && (
                <div className="form-check form-switch m-0 p-0" id="rotate-object-div">
                <div aria-label="Vertical radio toggle button group" className="btn-group-vertical" role="group">
                  {toggleInput('translate')}
                  <label
                    className={`btn btn-secondary ${transformMode === 'translate' ? 'fw-bold' : ''}`}
                    htmlFor="vbtn-translate"
                    id="translate-label"
                  >
                    Translate
                  </label>
                  {toggleInput('rotate')}
                  <label
                    className={`btn btn-secondary ${transformMode === 'rotate' ? 'fw-bold' : ''}`}
                    htmlFor="vbtn-rotate"
                    id="rotate-label"
                  >
                    Rotate
                  </label>
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lighting' && (
          <div className="tab-pane fade show active p-0 m-0" id="lighting-controls-tab" role="tabpanel" style={{ minHeight: '115px' }}>
            <LightControls root={root} />
          </div>
        )}
      </div>
    </div>
  );
}