import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from 'idb-keyval';

export type ElementType = 'path' | 'rect' | 'circle' | 'text' | 'group' | 'line';

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

export interface LineElement extends BaseElement {
  type: 'line';
  x2: number;
  y2: number;
}

export interface GroupElement extends BaseElement {
  type: 'group';
  childrenIds: string[];
}

export type CanvasElement = PathElement | RectElement | CircleElement | TextElement | GroupElement | LineElement;

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elementIds: string[];
}

export type ToolType = 'select' | 'pen' | 'rect' | 'circle' | 'text' | 'line';

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
  setDocumentName: (name: string) => void;
  exportToExcalidraw: () => ExcalidrawFile;
  importFromExcalidraw: (file: ExcalidrawFile) => void;
}

// --- Excalidraw types ---

export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: 'solid' | 'hachure' | 'cross-hatch';
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  roughness: number;
  opacity: number;
  groupIds: string[];
  frameId: string | null;
  roundness: { type: number } | null;
  seed: number;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  boundElements: null | { id: string; type: string }[];
  updated: number;
  link: string | null;
  locked: boolean;
  text?: string;
  fontSize?: number;
  fontFamily?: number;
  textAlign?: string;
  verticalAlign?: string;
  containerId?: string | null;
  originalText?: string;
  autoResize?: boolean;
  lineHeight?: number;
  points?: number[][];
  pressures?: number[];
  simulatePressure?: boolean;
  lastCommittedPoint?: number[] | null;
  startBinding?: null;
  endBinding?: null;
  startArrowhead?: null | string;
  endArrowhead?: null | string;
}

export interface ExcalidrawFile {
  type: 'excalidraw';
  version: number;
  source: string;
  elements: ExcalidrawElement[];
  appState: {
    gridSize: number | null;
    viewBackgroundColor: string;
  };
  files: Record<string, unknown>;
}

// --- Conversion helpers ---

function randomSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

function elementToExcalidraw(el: CanvasElement): ExcalidrawElement | null {
  const base: ExcalidrawElement = {
    id: el.id,
    type: 'rectangle',
    x: el.x,
    y: el.y,
    width: 0,
    height: 0,
    angle: (el.rotation * Math.PI) / 180,
    strokeColor: el.stroke === 'transparent' ? 'transparent' : el.stroke,
    backgroundColor: el.fill === 'transparent' ? 'transparent' : el.fill,
    fillStyle: el.fill !== 'transparent' ? 'solid' : 'hachure',
    strokeWidth: el.strokeWidth,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: Math.round(el.opacity * 100),
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: randomSeed(),
    version: 1,
    versionNonce: randomSeed(),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  };

  switch (el.type) {
    case 'rect':
      return {
        ...base,
        type: 'rectangle',
        width: el.width,
        height: el.height,
        roundness: el.rx ? { type: 3 } : null,
      };
    case 'circle':
      return {
        ...base,
        type: 'ellipse',
        x: el.x - el.radius,
        y: el.y - el.radius,
        width: el.radius * 2,
        height: el.radius * 2,
      };
    case 'text':
      return {
        ...base,
        type: 'text',
        width: el.text.length * el.fontSize * 0.6,
        height: el.fontSize * 1.25,
        text: el.text,
        fontSize: el.fontSize,
        fontFamily: el.fontFamily === 'Inter' ? 2 : 1,
        textAlign: 'left',
        verticalAlign: 'top',
        containerId: null,
        originalText: el.text,
        autoResize: true,
        lineHeight: 1.25,
      };
    case 'path': {
      const points = svgPathToPoints(el.pathData);
      return {
        ...base,
        type: 'freedraw',
        x: el.x,
        y: el.y,
        width: 0,
        height: 0,
        points,
        pressures: points.map(() => 0.5),
        simulatePressure: true,
        lastCommittedPoint: points.length > 0 ? points[points.length - 1] : null,
      };
    }
    case 'line':
      return {
        ...base,
        type: 'line',
        width: el.x2 - el.x,
        height: el.y2 - el.y,
        points: [[0, 0], [el.x2 - el.x, el.y2 - el.y]],
        startBinding: null,
        endBinding: null,
        startArrowhead: null,
        endArrowhead: null,
      };
    default:
      return null;
  }
}

function svgPathToPoints(pathData: string): number[][] {
  const points: number[][] = [];
  const commands = pathData.match(/[MLCQZHVAmlcqzhva][^MLCQZHVAmlcqzhva]*/g) || [];
  let cx = 0, cy = 0;
  let startX = 0, startY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

    switch (type) {
      case 'M':
        cx = nums[0]; cy = nums[1];
        startX = cx; startY = cy;
        points.push([cx, cy]);
        break;
      case 'm':
        cx += nums[0]; cy += nums[1];
        startX = cx; startY = cy;
        points.push([cx, cy]);
        break;
      case 'L':
        for (let i = 0; i < nums.length; i += 2) {
          cx = nums[i]; cy = nums[i + 1];
          points.push([cx, cy]);
        }
        break;
      case 'l':
        for (let i = 0; i < nums.length; i += 2) {
          cx += nums[i]; cy += nums[i + 1];
          points.push([cx, cy]);
        }
        break;
      case 'H':
        cx = nums[0];
        points.push([cx, cy]);
        break;
      case 'h':
        cx += nums[0];
        points.push([cx, cy]);
        break;
      case 'V':
        cy = nums[0];
        points.push([cx, cy]);
        break;
      case 'v':
        cy += nums[0];
        points.push([cx, cy]);
        break;
      case 'C':
        for (let i = 0; i < nums.length; i += 6) {
          cx = nums[i + 4]; cy = nums[i + 5];
          points.push([nums[i], nums[i + 1]]);
          points.push([nums[i + 2], nums[i + 3]]);
          points.push([cx, cy]);
        }
        break;
      case 'c':
        for (let i = 0; i < nums.length; i += 6) {
          points.push([cx + nums[i], cy + nums[i + 1]]);
          points.push([cx + nums[i + 2], cy + nums[i + 3]]);
          cx += nums[i + 4]; cy += nums[i + 5];
          points.push([cx, cy]);
        }
        break;
      case 'Q':
        for (let i = 0; i < nums.length; i += 4) {
          cx = nums[i + 2]; cy = nums[i + 3];
          points.push([nums[i], nums[i + 1]]);
          points.push([cx, cy]);
        }
        break;
      case 'q':
        for (let i = 0; i < nums.length; i += 4) {
          points.push([cx + nums[i], cy + nums[i + 1]]);
          cx += nums[i + 2]; cy += nums[i + 3];
          points.push([cx, cy]);
        }
        break;
      case 'Z':
      case 'z':
        cx = startX; cy = startY;
        points.push([cx, cy]);
        break;
    }
  }

  if (points.length > 0) {
    const ox = points[0][0];
    const oy = points[0][1];
    return points.map(([px, py]) => [px - ox, py - oy]);
  }
  return points;
}

function excalidrawToElement(exEl: ExcalidrawElement): CanvasElement | null {
  const base = {
    id: exEl.id || uuidv4(),
    x: exEl.x,
    y: exEl.y,
    rotation: (exEl.angle * 180) / Math.PI,
    fill: exEl.backgroundColor === 'transparent' ? 'transparent' : exEl.backgroundColor,
    stroke: exEl.strokeColor === 'transparent' ? 'transparent' : exEl.strokeColor,
    strokeWidth: exEl.strokeWidth,
    opacity: (exEl.opacity ?? 100) / 100,
  };

  switch (exEl.type) {
    case 'rectangle':
    case 'diamond':
      return {
        ...base,
        type: 'rect' as const,
        width: exEl.width,
        height: exEl.height,
        rx: exEl.roundness ? 8 : undefined,
        ry: exEl.roundness ? 8 : undefined,
      };
    case 'ellipse':
      return {
        ...base,
        type: 'circle' as const,
        x: exEl.x + exEl.width / 2,
        y: exEl.y + exEl.height / 2,
        radius: Math.max(exEl.width, exEl.height) / 2,
      };
    case 'text':
      return {
        ...base,
        type: 'text' as const,
        text: exEl.text || '',
        fontSize: exEl.fontSize || 20,
        fontFamily: exEl.fontFamily === 2 ? 'Inter' : 'Virgil',
        fontWeight: 'normal',
      };
    case 'freedraw': {
      const pts = exEl.points || [];
      if (pts.length === 0) return null;
      const ox = exEl.x;
      const oy = exEl.y;
      let d = `M ${ox + pts[0][0]} ${oy + pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${ox + pts[i][0]} ${oy + pts[i][1]}`;
      }
      return {
        ...base,
        type: 'path' as const,
        x: 0,
        y: 0,
        pathData: d,
      };
    }
    case 'line':
    case 'arrow': {
      const pts = exEl.points || [[0, 0], [exEl.width, exEl.height]];
      if (pts.length >= 2) {
        return {
          ...base,
          type: 'line' as const,
          x: exEl.x + pts[0][0],
          y: exEl.y + pts[0][1],
          x2: exEl.x + pts[pts.length - 1][0],
          y2: exEl.y + pts[pts.length - 1][1],
        };
      }
      return null;
    }
    default:
      return null;
  }
}

// --- Store ---

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
    elements: {} as Record<string, CanvasElement>,
    selectedElementIds: [] as string[],
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
        const unlockedLayer = state.layers.find(l => !l.locked);
        if (!unlockedLayer) return state;

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
      if (state.layers.length <= 1) return state;
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

  setDocumentName: (name) => {
    setStore({ name });
  },

  exportToExcalidraw: () => {
    const state = getStore();
    const elements: ExcalidrawElement[] = [];

    for (const layer of state.layers) {
      for (const elId of layer.elementIds) {
        const el = state.elements[elId];
        if (el) {
          const exEl = elementToExcalidraw(el);
          if (exEl) {
            elements.push(exEl);
          }
        }
      }
    }

    return {
      type: 'excalidraw' as const,
      version: 2,
      source: 'https://claudecrayons.app',
      elements,
      appState: {
        gridSize: null,
        viewBackgroundColor: '#ffffff',
      },
      files: {},
    };
  },

  importFromExcalidraw: (file) => {
    const state = getStore();
    const initialLayerId = uuidv4();
    const newElements: Record<string, CanvasElement> = {};
    const elementIds: string[] = [];

    for (const exEl of file.elements) {
      if (exEl.isDeleted) continue;
      const el = excalidrawToElement(exEl);
      if (el) {
        newElements[el.id] = el;
        elementIds.push(el.id);
      }
    }

    setStore({
      ...state,
      id: uuidv4(),
      name: 'Imported from Excalidraw',
      layers: [{
        id: initialLayerId,
        name: 'Layer 1',
        visible: true,
        locked: false,
        elementIds,
      }],
      elements: newElements,
      selectedElementIds: [],
      activeLayerId: initialLayerId,
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
  },
}));
