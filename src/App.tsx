/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { ExportDialog } from './components/ExportDialog';
import { keys, get } from 'idb-keyval';
import { useDocumentStore } from './store/documentStore';

export default function App() {
  const { loadDocument, showLayersPanel, showTemplatesPanel, undo, redo } = useDocumentStore();

  useEffect(() => {
    const loadSavedDoc = async () => {
      try {
        const allKeys = await keys();
        const docKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('doc-'));
        if (docKeys.length > 0) {
          const savedDoc = await get(docKeys[0]);
          if (savedDoc) {
            loadDocument(savedDoc);
          }
        }
      } catch (e) {
        console.error('Failed to load saved document', e);
      }
    };
    loadSavedDoc();
  }, [loadDocument]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <Layout>
      <Canvas />
      <PropertiesPanel />
      {showLayersPanel && <LayersPanel />}
      {showTemplatesPanel && <TemplatesPanel />}
      <Toolbar />
      <ExportDialog />
    </Layout>
  );
}
