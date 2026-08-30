import { useState } from 'react';
import { catalog, assetUrl } from './catalog';
import { textureCatalog, loadTextureSet } from './textureCatalog';
import { setObjectTexture } from './materials';
import { sceneStore, useScene, MAX_OBJECTS } from './sceneStore';
import {
  ICON_TAB1,
  ICON_TAB2,
  ICON_TAB3,
  ICON_TAB4,
} from './libraryIcons';

function IconRow({ svgs }) {
  return (
    <span className="d-flex flex-column gap-1 align-items-center">
      {svgs.map((svg, index) => (
        <span key={index} dangerouslySetInnerHTML={{ __html: svg }} />
      ))}
    </span>
  );
}

function ModelCard({ name, id, imagePath, filePath, type, emissive, parallelTexturePath, onClick, onDelete }) {
  return (
    <div className="h-100">
      <a
        className="add-model-btn d-block h-100 text-decoration-none"
        role="button"
        tabIndex="0"
        data-filepath={filePath}
        data-type={type}
        data-model-name={name}
        data-id={id}
        data-parallel-texture-path={parallelTexturePath}
        onClick={onClick}
      >
        <div className="card w-100 h-100 border-0 shadow-sm rounded-3 overflow-hidden hover-animate-model">
          <div className="position-relative">
            {emissive && (
              <div className="position-absolute top-0 start-0 mx-1 mt-1" style={{ zIndex: 10 }}>
                <svg
                  className="bi bi-brightness-high-fill"
                  fill="currentColor"
                  height="20"
                  viewBox="0 0 16 16"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
                </svg>
              </div>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn btn-sm btn-danger delete-model-button position-absolute top-0 end-0 m-2"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
              >
                <svg className="bi bi-trash" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
            )}
            <div className="ratio ratio-1x1" id="image-container">
              {imagePath ? (
                <img alt={`Preview of ${name}`} className="card-img-top object-fit-cover" src={imagePath} />
              ) : (
                <span className="d-block w-100 h-100" style={{ background: '#fff' }} />
              )}
            </div>
          </div>
          <div className="card-body p-2 text-center bg-light">
            <p className="card-text text-truncate mb-0" style={{ fontSize: '0.8rem' }}>
              {name}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function ObjectLibrary() {
  const [tab, setTab] = useState('tab1');
  const [collapsed, setCollapsed] = useState(false);
  const { objects, selectedId } = useScene();

  const movableCount = objects.filter((object) => object.movable).length;
  const atCapacity = movableCount >= MAX_OBJECTS;
  const selected = selectedId ? sceneStore.getObject(selectedId) : null;

  const activateTab = (id) => {
    setCollapsed(false);
    setTab(id);
  };

  const applyTexture = (textureId) => {
    if (!selected) return;
    sceneStore.actions.applyTexture(selected.id, textureId);
    const root = sceneStore.getRef(selected.id);
    if (root) {
      loadTextureSet(textureId).then((set) => setObjectTexture(root, set));
    }
  };

  const TABS = [
    {
      id: 'tab1',
      desktop: 'Furniture & Fixtures',
      icon: ICON_TAB1,
    },
    {
      id: 'tab2',
      desktop: 'Textures',
      icon: ICON_TAB2,
    },
    {
      id: 'tab3',
      desktop: 'Custom Models',
      icon: ICON_TAB3,
    },
    {
      id: 'tab4',
      desktop: 'Uploaded Textures',
      icon: ICON_TAB4,
    },
  ];

  return (
    <div className={`z-2 ${collapsed ? 'collapsed' : ''}`} id="overlay-controls">
      <div className="nav flex-column nav-pills w-auto h-100" id="tabButtons" role="tablist">
        {TABS.map((item) => (
          <div key={item.id}>
            <button
              className={`nav-link ${tab === item.id ? 'active' : ''} d-none d-md-block`}
              data-tab={item.id}
              role="tab"
              type="button"
              onClick={() => activateTab(item.id)}
            >
              {item.desktop}
            </button>
            <button
              className={`pe-2 ps-2 nav-link ${tab === item.id ? 'active' : ''} d-md-none d-flex ${item.id === 'tab1' || item.id === 'tab2' ? '' : 'flex-column gap-1 align-items-center'}`}
              data-tab={item.id}
              role="tab"
              type="button"
              onClick={() => activateTab(item.id)}
            >
              <IconRow svgs={item.icon} />
            </button>
          </div>
        ))}
      </div>

      <div className="tab-content p-3 overflow-auto" id="tabContent">
        <div className="close-button-wrapper">
          <button className="close-button" id="closeContentBtn" onClick={() => setCollapsed(true)}>
            ×
          </button>
        </div>

        {tab === 'tab1' && (
          <div className="tab-pane active overflow-x-hidden object-library-tab-pane" id="tab1" role="tabpanel">
            <div className="row row-cols-1 row-cols-lg-3 mx-3 g-3 pb-2" id="public-models-tab">
              {catalog.map((entry) => (
                <ModelCard
                  key={entry.id}
                  name={entry.name}
                  id={entry.id}
                  imagePath={entry.thumbnail ? assetUrl(entry.thumbnail) : null}
                  filePath={entry.model}
                  type="model"
                  emissive={!!entry.light}
                  parallelTexturePath={entry.parallelTexture || null}
                  onClick={() => {
                    if (!atCapacity) sceneStore.actions.addObject(entry);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'tab2' && (
          <div className="tab-pane active overflow-x-hidden object-library-tab-pane" id="tab2" role="tabpanel">
            <div className="row row-cols-1 row-cols-lg-3 mx-3 g-3 pb-2">
              <ModelCard
                name="No Texture"
                id={null}
                imagePath={null}
                filePath={null}
                type="remove-texture"
                emissive={false}
                parallelTexturePath={null}
                onClick={() => applyTexture(null)}
              />
              {textureCatalog.map((entry) => (
                <ModelCard
                  key={entry.id}
                  name={entry.name}
                  id={entry.id}
                  imagePath={assetUrl(entry.file)}
                  filePath={entry.file}
                  type="texture"
                  emissive={false}
                  parallelTexturePath={null}
                  onClick={() => applyTexture(entry.id)}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'tab3' && (
          <div className="tab-pane active overflow-x-hidden object-library-tab-pane" id="tab3" role="tabpanel">
            <div className="d-flex flex-column align-items-center mb-4">
              <button className="btn btn-sm btn-primary" id="model-upload-btn" type="button">
                Upload Model +
              </button>
              <p style={{ fontSize: '0.75rem' }}>(.obj &amp; .glb files only)</p>
            </div>
            <div className="row row-cols-1 row-cols-lg-3 mx-3 g-3 pb-2" id="uploaded-models-tab">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} style={{ visibility: 'hidden' }} />
              ))}
            </div>
          </div>
        )}

        {tab === 'tab4' && (
          <div className="tab-pane active overflow-x-hidden object-library-tab-pane" id="tab4" role="tabpanel">
            <div className="d-flex flex-column align-items-center mb-4">
              <button className="btn btn-sm btn-primary" type="button">
                Upload Texture +
              </button>
              <p style={{ fontSize: '0.75rem' }}>(.jpg &amp; .png files only)</p>
            </div>
            <div className="row row-cols-1 row-cols-lg-3 mx-3 g-3 pb-2" id="custom-texture-container">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} style={{ visibility: 'hidden' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}