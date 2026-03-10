import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from 'idb-keyval';

export type ElementType = 'path' | 'rect' | 'circle' | 'text' | 'group';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  selected?: boolean;
}

export interface PathElement extends BaseElement {
  type: 'path';
  pathData: string;
}

export interface RectElement extends BaseElement {
  type: 'rect';
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
}

export interface GroupElement extends BaseElement {
  type: 'group';
  childrenIds: string[];
}

export type CanvasElement = PathElement | RectElement | CircleElement | TextElement | GroupElement;

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elementIds: string[];
}

export type ToolType = 'select' | 'pen' | 'rect' | 'circle' | 'text';

export interface DocumentState {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: Layer[];
  elements: Record<string, CanvasElement>;
  selectedElementIds: string[];
  activeLayerId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  activeTool: ToolType;
  showLayersPanel: boolean;
  showTemplatesPanel: boolean;
  
  // Actions
  addElement: (element: CanvasElement, layerId?: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  addLayer: (name: string) => void;
  deleteLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  reorderLayer: (id: string, direction: 'up' | 'down') => void;
  reorderElement: (id: string, direction: 'up' | 'down') => void;
  moveElementToLayer: (elementId: string, targetLayerId: string) => void;
  deleteElements: (ids: string[]) => void;
  selectElements: (ids: string[]) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setActiveTool: (tool: ToolType) => void;
  setShowLayersPanel: (show: boolean) => void;
  setShowTemplatesPanel: (show: boolean) => void;
  loadDocument: (doc: Partial<DocumentState>) => void;
  saveDocument: () => Promise<void>;
  clearDocument: () => void;
}

const createInitialState = () => {
  const initialLayerId = uuidv4();
  return {
    id: uuidv4(),
    name: 'Untitled Project',
    width: 1024,
    height: 1024,
    layers: [
      {
        id: initialLayerId,
        name: 'Layer 1',
        visible: true,
        locked: false,
        elementIds: [],
      },
    ],
    elements: {},
    selectedElementIds: [],
    activeLayerId: initialLayerId,
    zoom: 1,
    pan: { x: 0, y: 0 },
    activeTool: 'select' as ToolType,
    showLayersPanel: false,
    showTemplatesPanel: false,
  };
};

export const useDocumentStore = create<DocumentState>((setStore, getStore) => ({
  ...createInitialState(),

  addElement: (element, layerId) => {
    setStore((state) => {
      const targetLayerId = layerId || state.activeLayerId || state.layers[0].id;
      const targetLayer = state.layers.find(l => l.id === targetLayerId);
      
      if (targetLayer?.locked) {
        // If target layer is locked, find the first unlocked layer
        const unlockedLayer = state.layers.find(l => !l.locked);
        if (!unlockedLayer) return state; // All layers locked, can't add
        
        const newLayers = state.layers.map((layer) => {
          if (layer.id === unlockedLayer.id) {
            return { ...layer, elementIds: [...layer.elementIds, element.id] };
          }
          return layer;
        });

        return {
          elements: { ...state.elements, [element.id]: element },
          layers: newLayers,
          selectedElementIds: [element.id],
          activeLayerId: unlockedLayer.id,
        };
      }

      const newLayers = state.layers.map((layer) => {
        if (layer.id === targetLayerId) {
          return { ...layer, elementIds: [...layer.elementIds, element.id] };
        }
        return layer;
      });

      return {
        elements: { ...state.elements, [element.id]: element },
        layers: newLayers,
        selectedElementIds: [element.id],
      };
    });
  },

  updateElement: (id, updates) => {
    setStore((state) => {
      const element = state.elements[id];
      if (!element) return state;
      return {
        elements: {
          ...state.elements,
          [id]: { ...element, ...updates } as CanvasElement,
        },
      };
    });
  },

  updateLayer: (id, updates) => {
    setStore((state) => ({
      layers: state.layers.map(layer => 
        layer.id === id ? { ...layer, ...updates } : layer
      )
    }));
  },

  addLayer: (name) => {
    setStore((state) => {
      const newLayer: Layer = {
        id: uuidv4(),
        name,
        visible: true,
        locked: false,
        elementIds: [],
      };
      return {
        layers: [...state.layers, newLayer],
        activeLayerId: newLayer.id,
      };
    });
  },

  deleteLayer: (id) => {
    setStore((state) => {
      if (state.layers.length <= 1) return state; // Don't delete last layer
      const layerToDelete = state.layers.find(l => l.id === id);
      if (!layerToDelete) return state;

      const newElements = { ...state.elements };
      layerToDelete.elementIds.forEach(elId => delete newElements[elId]);

      const newLayers = state.layers.filter(l => l.id !== id);
      const newActiveLayerId = state.activeLayerId === id ? newLayers[0].id : state.activeLayerId;

      return {
        layers: newLayers,
        elements: newElements,
        activeLayerId: newActiveLayerId,
        selectedElementIds: state.selectedElementIds.filter(elId => !layerToDelete.elementIds.includes(elId)),
      };
    });
  },

  setActiveLayer: (id) => {
    setStore({ activeLayerId: id });
  },

  reorderLayer: (id, direction) => {
    setStore((state) => {
      const index = state.layers.findIndex(l => l.id === id);
      if (index === -1) return state;
      
      const isUp = direction === 'up';
      if (isUp && index === state.layers.length - 1) return state;
      if (!isUp && index === 0) return state;

      const newLayers = [...state.layers];
      const targetIndex = isUp ? index + 1 : index - 1;
      
      // Swap
      [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];
      
      return { layers: newLayers };
    });
  },

  reorderElement: (id, direction) => {
    setStore((state) => {
      const layer = state.layers.find(l => l.elementIds.includes(id));
      if (!layer) return state;

      const index = layer.elementIds.indexOf(id);
      if (index === -1) return state;
      if (direction === 'up' && index === 0) return state; // 'up' means visually higher, which is later in the array or earlier? Let's say earlier in array is rendered first (bottom). So 'up' means move to later in array.
      // Wait, usually SVG renders elements in order. So index 0 is bottom.
      // If we want to move 'up' (bring forward), we increase index.
      // If we want to move 'down' (send backward), we decrease index.
      
      const isUp = direction === 'up';
      if (isUp && index === layer.elementIds.length - 1) return state;
      if (!isUp && index === 0) return state;

      const targetIndex = isUp ? index + 1 : index - 1;
      const newElementIds = [...layer.elementIds];
      [newElementIds[index], newElementIds[targetIndex]] = [newElementIds[targetIndex], newElementIds[index]];

      return {
        layers: state.layers.map(l => 
          l.id === layer.id ? { ...l, elementIds: newElementIds } : l
        )
      };
    });
  },

  moveElementToLayer: (elementId, targetLayerId) => {
    setStore((state) => {
      const sourceLayer = state.layers.find(l => l.elementIds.includes(elementId));
      if (!sourceLayer || sourceLayer.id === targetLayerId) return state;

      return {
        layers: state.layers.map(l => {
          if (l.id === sourceLayer.id) {
            return { ...l, elementIds: l.elementIds.filter(id => id !== elementId) };
          }
          if (l.id === targetLayerId) {
            return { ...l, elementIds: [...l.elementIds, elementId] };
          }
          return l;
        })
      };
    });
  },

  deleteElements: (ids) => {
    setStore((state) => {
      const newElements = { ...state.elements };
      ids.forEach((id) => delete newElements[id]);

      const newLayers = state.layers.map((layer) => ({
        ...layer,
        elementIds: layer.elementIds.filter((id) => !ids.includes(id)),
      }));

      return {
        elements: newElements,
        layers: newLayers,
        selectedElementIds: state.selectedElementIds.filter((id) => !ids.includes(id)),
      };
    });
  },

  selectElements: (ids) => {
    setStore({ selectedElementIds: ids });
  },

  setZoom: (zoom) => {
    setStore({ zoom });
  },

  setPan: (pan) => {
    setStore({ pan });
  },

  setActiveTool: (tool) => {
    setStore({ activeTool: tool });
  },

  setShowLayersPanel: (show) => {
    setStore({ showLayersPanel: show, showTemplatesPanel: show ? false : getStore().showTemplatesPanel });
  },

  setShowTemplatesPanel: (show) => {
    setStore({ showTemplatesPanel: show, showLayersPanel: show ? false : getStore().showLayersPanel });
  },

  loadDocument: (doc) => {
    setStore((state) => ({ ...state, ...doc }));
  },

  saveDocument: async () => {
    const state = getStore();
    const docToSave = {
      id: state.id,
      name: state.name,
      width: state.width,
      height: state.height,
      layers: state.layers,
      elements: state.elements,
    };
    await set(`doc-${state.id}`, docToSave);
  },

  clearDocument: () => {
    setStore(createInitialState());
  },
}));
