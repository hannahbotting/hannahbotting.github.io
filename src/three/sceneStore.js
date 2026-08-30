import { useSyncExternalStore } from 'react';

export const MAX_OBJECTS = 50;

let listeners = new Set();
const refs = new Map();

let state = {
  objects: [],
  selectedId: null,
  transformMode: 'translate',
  coordinates: { x: 0, y: 0, z: 0 },
  tick: 0,
};

function emit() {
  for (const listener of listeners) listener();
}

function setState(partial) {
  state = { ...state, ...partial };
  emit();
}

function updateObject(id, patch) {
  return state.objects.map((object) =>
    object.id === id ? { ...object, ...patch } : object,
  );
}

export const sceneStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getState() {
    return state;
  },

  getObject(id) {
    return state.objects.find((object) => object.id === id) ?? null;
  },

  getRef(id) {
    return refs.get(id) ?? null;
  },

  registerRef(id, object3d) {
    refs.set(id, object3d);
    this.actions.touch();
  },

  unregisterRef(id) {
    refs.delete(id);
  },

  registerStaticObject(id, object3d, { name, colour }) {
    refs.set(id, object3d);
    const exists = state.objects.some((object) => object.id === id);
    setState({
      objects: exists
        ? state.objects
        : [
            ...state.objects,
            {
              id,
              entry: { name },
              movable: false,
              position: [...object3d.position],
              rotation: [0, 0, 0],
              scale: 1,
              colour,
              textureId: null,
            },
          ],
    });
  },

  actions: {
    addObject(entry) {
      const movableCount = state.objects.filter((object) => object.movable).length;
      if (movableCount >= MAX_OBJECTS) return false;
      const id = crypto.randomUUID();
      setState({
        objects: [
          ...state.objects,
          {
            id,
            entry,
            movable: true,
            position: entry.position ? [...entry.position] : [0, 0, 0],
            rotation: entry.rotation ? [...entry.rotation] : [0, 0, 0],
            scale: entry.scale ?? 1,
            colour: null,
            textureId: entry.textureId ?? null,
          },
        ],
        selectedId: id,
        coordinates: { x: 0, y: 0, z: 0 },
      });
      return true;
    },

    removeObject(id) {
      refs.delete(id);
      setState({
        objects: state.objects.filter((object) => object.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      });
    },

    select(id) {
      const object3d = refs.get(id);
      const coordinates = object3d
        ? { x: object3d.position.x, y: object3d.position.y, z: object3d.position.z }
        : state.coordinates;
      setState({ selectedId: id, coordinates });
    },

    deselect() {
      setState({ selectedId: null });
    },

    setTransformMode(mode) {
      setState({ transformMode: mode });
    },

    setCoordinates(coordinates) {
      setState({ coordinates });
    },

    setObjectColour(id, colour) {
      setState({ objects: updateObject(id, { colour }) });
    },

    applyTexture(id, textureId) {
      setState({ objects: updateObject(id, { textureId }) });
    },

    setObjectProps(id, patch) {
      setState({ objects: updateObject(id, patch) });
    },

    touch() {
      setState({ tick: state.tick + 1 });
    },
  },
};

export function useScene() {
  return useSyncExternalStore(sceneStore.subscribe, sceneStore.getState);
}