/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Canvas } from './components/Canvas';
import { AIPrompt } from './components/AIPrompt';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { keys, get } from 'idb-keyval';
import { useDocumentStore } from './store/documentStore';

export default function App() {
  const { loadDocument, showLayersPanel, showTemplatesPanel } = useDocumentStore();

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

  return (
    <Layout>
      <Canvas />
      <AIPrompt />
      <PropertiesPanel />
      {showLayersPanel && <LayersPanel />}
      {showTemplatesPanel && <TemplatesPanel />}
      <Toolbar />
    </Layout>
  );
}
