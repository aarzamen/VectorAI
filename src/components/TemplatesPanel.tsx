import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import {
  Smartphone,
  Hexagon,
  LayoutGrid,
  MessageSquare,
  Monitor,
  CreditCard,
  PenTool,
  Share2,
  Presentation,
  Users,
  Workflow,
  Star,
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  apply: () => void;
}

export function TemplatesPanel() {
  const { addElement, clearDocument } = useDocumentStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'app', label: 'App' },
    { id: 'business', label: 'Business' },
    { id: 'diagram', label: 'Diagrams' },
    { id: 'social', label: 'Social' },
    { id: 'shapes', label: 'Shapes' },
  ];

  const templates: Template[] = [
    // App templates
    {
      id: 'ios-icon',
      name: 'iOS App Icon',
      description: '1024x1024 squircle',
      category: 'app',
      icon: <Smartphone className="w-5 h-5" />,
      color: '#D97757',
      apply: () => {
        clearDocument();
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 100, y: 100, width: 824, height: 824,
          rx: 180, ry: 180, rotation: 0, fill: '#292524', stroke: '#D97757', strokeWidth: 2, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 512, y: 512, radius: 200,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 512, y: 512, radius: 80,
          rotation: 0, fill: '#1C1917', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    {
      id: 'mobile-wireframe',
      name: 'Mobile Wireframe',
      description: 'Phone screen layout',
      category: 'app',
      icon: <Monitor className="w-5 h-5" />,
      color: '#3B82F6',
      apply: () => {
        clearDocument();
        // Phone frame
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 200, y: 50, width: 375, height: 812,
          rx: 40, ry: 40, rotation: 0, fill: '#1C1917', stroke: '#57534E', strokeWidth: 2, opacity: 1,
        });
        // Status bar
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 220, y: 70, width: 335, height: 44,
          rotation: 0, fill: 'transparent', stroke: '#44403C', strokeWidth: 1, opacity: 0.5,
        });
        // Header
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 220, y: 114, width: 335, height: 56,
          rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 320, y: 150, text: 'Header',
          fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Content cards
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 230, y: 190, width: 315, height: 120,
          rx: 12, ry: 12, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 230, y: 325, width: 315, height: 120,
          rx: 12, ry: 12, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 230, y: 460, width: 315, height: 120,
          rx: 12, ry: 12, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        // Tab bar
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 220, y: 780, width: 335, height: 60,
          rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        // Tab bar circles
        for (let i = 0; i < 4; i++) {
          addElement({
            id: crypto.randomUUID(), type: 'circle', x: 290 + i * 70, y: 810, radius: 12,
            rotation: 0, fill: i === 0 ? '#D97757' : '#44403C', stroke: 'transparent', strokeWidth: 0, opacity: 1,
          });
        }
      },
    },
    // Business templates
    {
      id: 'business-card',
      name: 'Business Card',
      description: '3.5" x 2" standard',
      category: 'business',
      icon: <CreditCard className="w-5 h-5" />,
      color: '#E8A87C',
      apply: () => {
        clearDocument();
        // Card background
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 100, y: 200, width: 630, height: 360,
          rx: 16, ry: 16, rotation: 0, fill: '#292524', stroke: '#D97757', strokeWidth: 2, opacity: 1,
        });
        // Accent line
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 100, y: 200, width: 8, height: 360,
          rx: 4, ry: 4, rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Logo placeholder
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 200, y: 320, radius: 40,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 0.9,
        });
        // Name
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 280, y: 310, text: 'John Doe',
          fontSize: 28, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Title
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 280, y: 350, text: 'Senior Designer',
          fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Contact
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 280, y: 420, text: 'hello@example.com',
          fontSize: 14, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 280, y: 450, text: '+1 (555) 123-4567',
          fontSize: 14, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#78716C', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    {
      id: 'presentation-slide',
      name: 'Presentation Slide',
      description: '16:9 title slide',
      category: 'business',
      icon: <Presentation className="w-5 h-5" />,
      color: '#8B5CF6',
      apply: () => {
        clearDocument();
        // Slide bg
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 50, y: 100, width: 960, height: 540,
          rx: 8, ry: 8, rotation: 0, fill: '#1C1917', stroke: '#44403C', strokeWidth: 2, opacity: 1,
        });
        // Accent stripe
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 50, y: 100, width: 960, height: 6,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Title
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 320, text: 'Presentation Title',
          fontSize: 48, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Subtitle
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 390, text: 'Subtitle or tagline goes here',
          fontSize: 20, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Date
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 560, text: 'March 2026',
          fontSize: 14, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    // Diagram templates
    {
      id: 'flowchart',
      name: 'Flowchart',
      description: 'Process flow diagram',
      category: 'diagram',
      icon: <Workflow className="w-5 h-5" />,
      color: '#22C55E',
      apply: () => {
        clearDocument();
        // Start
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 350, y: 50, width: 160, height: 60,
          rx: 30, ry: 30, rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 400, y: 88, text: 'Start',
          fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Arrow down
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 430, y: 110, x2: 430, y2: 170,
          rotation: 0, fill: 'transparent', stroke: '#57534E', strokeWidth: 2, opacity: 1,
        });
        // Process 1
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 330, y: 170, width: 200, height: 70,
          rx: 8, ry: 8, rotation: 0, fill: '#292524', stroke: '#57534E', strokeWidth: 2, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 380, y: 212, text: 'Process',
          fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Arrow down
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 430, y: 240, x2: 430, y2: 300,
          rotation: 0, fill: 'transparent', stroke: '#57534E', strokeWidth: 2, opacity: 1,
        });
        // Decision diamond (rect rotated - represented as rect)
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 350, y: 300, width: 160, height: 80,
          rx: 4, ry: 4, rotation: 0, fill: '#292524', stroke: '#D97757', strokeWidth: 2, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 385, y: 348, text: 'Decision?',
          fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Yes branch down
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 430, y: 380, x2: 430, y2: 440,
          rotation: 0, fill: 'transparent', stroke: '#22C55E', strokeWidth: 2, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 440, y: 415, text: 'Yes',
          fontSize: 12, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#22C55E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // No branch right
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 510, y: 340, x2: 600, y2: 340,
          rotation: 0, fill: 'transparent', stroke: '#EF4444', strokeWidth: 2, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 545, y: 330, text: 'No',
          fontSize: 12, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#EF4444', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // End
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 350, y: 440, width: 160, height: 60,
          rx: 30, ry: 30, rotation: 0, fill: '#22C55E', stroke: 'transparent', strokeWidth: 0, opacity: 0.9,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 405, y: 478, text: 'End',
          fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    {
      id: 'org-chart',
      name: 'Org Chart',
      description: 'Team hierarchy',
      category: 'diagram',
      icon: <Users className="w-5 h-5" />,
      color: '#06B6D4',
      apply: () => {
        clearDocument();
        // CEO
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 350, y: 60, width: 180, height: 60,
          rx: 8, ry: 8, rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 400, y: 96, text: 'CEO',
          fontSize: 18, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Lines to VPs
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 440, y: 120, x2: 440, y2: 160,
          rotation: 0, fill: 'transparent', stroke: '#57534E', strokeWidth: 2, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 200, y: 160, x2: 680, y2: 160,
          rotation: 0, fill: 'transparent', stroke: '#57534E', strokeWidth: 2, opacity: 1,
        });
        // VP boxes
        const vpPositions = [
          { x: 120, label: 'VP Engineering' },
          { x: 350, label: 'VP Design' },
          { x: 580, label: 'VP Marketing' },
        ];
        vpPositions.forEach(vp => {
          addElement({
            id: crypto.randomUUID(), type: 'line', x: vp.x + 80, y: 160, x2: vp.x + 80, y2: 190,
            rotation: 0, fill: 'transparent', stroke: '#57534E', strokeWidth: 2, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'rect', x: vp.x, y: 190, width: 160, height: 50,
            rx: 8, ry: 8, rotation: 0, fill: '#292524', stroke: '#57534E', strokeWidth: 2, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'text', x: vp.x + 15, y: 222, text: vp.label,
            fontSize: 13, fontFamily: 'Inter', fontWeight: 'normal',
            rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
          });
        });
        // Team members under VP Engineering
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 200, y: 240, x2: 200, y2: 280,
          rotation: 0, fill: 'transparent', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'line', x: 120, y: 280, x2: 280, y2: 280,
          rotation: 0, fill: 'transparent', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        [100, 220].forEach(x => {
          addElement({
            id: crypto.randomUUID(), type: 'line', x: x + 20, y: 280, x2: x + 20, y2: 300,
            rotation: 0, fill: 'transparent', stroke: '#44403C', strokeWidth: 1, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'rect', x: x, y: 300, width: 100, height: 40,
            rx: 6, ry: 6, rotation: 0, fill: '#1C1917', stroke: '#44403C', strokeWidth: 1, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'text', x: x + 15, y: 326, text: x === 100 ? 'Frontend' : 'Backend',
            fontSize: 12, fontFamily: 'Inter', fontWeight: 'normal',
            rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
          });
        });
      },
    },
    {
      id: 'mind-map',
      name: 'Mind Map',
      description: 'Branching ideas',
      category: 'diagram',
      icon: <Share2 className="w-5 h-5" />,
      color: '#F59E0B',
      apply: () => {
        clearDocument();
        // Center node
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 350, radius: 60,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 415, y: 357, text: 'Main Idea',
          fontSize: 16, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Branches
        const branches = [
          { angle: -30, label: 'Topic A', color: '#3B82F6', dist: 200 },
          { angle: 30, label: 'Topic B', color: '#22C55E', dist: 200 },
          { angle: -90, label: 'Topic C', color: '#F59E0B', dist: 180 },
          { angle: 90, label: 'Topic D', color: '#8B5CF6', dist: 180 },
          { angle: 150, label: 'Topic E', color: '#06B6D4', dist: 200 },
          { angle: -150, label: 'Topic F', color: '#EF4444', dist: 200 },
        ];
        branches.forEach(b => {
          const rad = (b.angle * Math.PI) / 180;
          const ex = 450 + Math.cos(rad) * b.dist;
          const ey = 350 + Math.sin(rad) * b.dist;
          // Connection line
          addElement({
            id: crypto.randomUUID(), type: 'line',
            x: 450 + Math.cos(rad) * 60, y: 350 + Math.sin(rad) * 60,
            x2: ex, y2: ey,
            rotation: 0, fill: 'transparent', stroke: b.color, strokeWidth: 2, opacity: 0.5,
          });
          // Branch circle
          addElement({
            id: crypto.randomUUID(), type: 'circle', x: ex, y: ey, radius: 35,
            rotation: 0, fill: '#292524', stroke: b.color, strokeWidth: 2, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'text', x: ex - 28, y: ey + 5, text: b.label,
            fontSize: 12, fontFamily: 'Inter', fontWeight: 'normal',
            rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
          });
        });
      },
    },
    // Social templates
    {
      id: 'social-post',
      name: 'Social Post',
      description: '1080x1080 square',
      category: 'social',
      icon: <MessageSquare className="w-5 h-5" />,
      color: '#D946EF',
      apply: () => {
        clearDocument();
        // Background
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 50, y: 50, width: 800, height: 800,
          rx: 24, ry: 24, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 2, opacity: 1,
        });
        // Gradient accent circle
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 300, radius: 120,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 0.15,
        });
        // Main text
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 420, text: 'Your Message',
          fontSize: 56, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 500, text: 'Goes Right Here',
          fontSize: 56, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Subtext
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 580, text: 'Add your description or call-to-action below.',
          fontSize: 18, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Bottom accent
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 120, y: 720, width: 200, height: 4,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 120, y: 760, text: '@yourbrand',
          fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#78716C', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    {
      id: 'logo-design',
      name: 'Logo Design',
      description: 'Centered composition',
      category: 'social',
      icon: <PenTool className="w-5 h-5" />,
      color: '#F97316',
      apply: () => {
        clearDocument();
        // Background circle
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 400, radius: 200,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 0.1,
        });
        // Inner ring
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 400, radius: 120,
          rotation: 0, fill: 'transparent', stroke: '#D97757', strokeWidth: 3, opacity: 1,
        });
        // Center mark
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 400, radius: 40,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Brand text
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 350, y: 580, text: 'BRAND',
          fontSize: 64, fontFamily: 'Inter', fontWeight: '900',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 370, y: 620, text: 'STUDIO',
          fontSize: 24, fontFamily: 'Inter', fontWeight: 'normal',
          rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    // Shapes
    {
      id: 'geometric-pattern',
      name: 'Geometric Pattern',
      description: 'Grid of shapes',
      category: 'shapes',
      icon: <LayoutGrid className="w-5 h-5" />,
      color: '#84CC16',
      apply: () => {
        clearDocument();
        const colors = ['#D97757', '#E8A87C', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'];
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const cx = 200 + col * 120;
            const cy = 150 + row * 120;
            const color = colors[(row + col) % colors.length];
            if ((row + col) % 2 === 0) {
              addElement({
                id: crypto.randomUUID(), type: 'circle', x: cx, y: cy, radius: 40,
                rotation: 0, fill: color, stroke: 'transparent', strokeWidth: 0, opacity: 0.8,
              });
            } else {
              addElement({
                id: crypto.randomUUID(), type: 'rect', x: cx - 35, y: cy - 35, width: 70, height: 70,
                rx: 8, ry: 8, rotation: 0, fill: color, stroke: 'transparent', strokeWidth: 0, opacity: 0.8,
              });
            }
          }
        }
      },
    },
    {
      id: 'icon-set',
      name: 'Icon Grid',
      description: 'Placeholder icon set',
      category: 'shapes',
      icon: <Hexagon className="w-5 h-5" />,
      color: '#EF4444',
      apply: () => {
        clearDocument();
        // Title
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 150, y: 80, text: 'Icon Set',
          fontSize: 32, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Grid of icon placeholders
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 4; col++) {
            const cx = 200 + col * 140;
            const cy = 180 + row * 140;
            // Background
            addElement({
              id: crypto.randomUUID(), type: 'rect', x: cx - 45, y: cy - 45, width: 90, height: 90,
              rx: 16, ry: 16, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
            });
            // Icon placeholder
            addElement({
              id: crypto.randomUUID(), type: 'circle', x: cx, y: cy, radius: 20,
              rotation: 0, fill: 'transparent', stroke: '#D97757', strokeWidth: 2, opacity: 0.6,
            });
          }
        }
      },
    },
    {
      id: 'dashboard',
      name: 'Dashboard Layout',
      description: 'Grid of panels',
      category: 'business',
      icon: <LayoutGrid className="w-5 h-5" />,
      color: '#3B82F6',
      apply: () => {
        clearDocument();
        // Header
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 50, y: 50, width: 900, height: 56,
          rx: 8, ry: 8, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 80, y: 85, text: 'Dashboard',
          fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Stat cards row
        for (let i = 0; i < 4; i++) {
          addElement({
            id: crypto.randomUUID(), type: 'rect', x: 50 + i * 228, y: 130, width: 212, height: 100,
            rx: 8, ry: 8, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'text', x: 75 + i * 228, y: 165, text: ['Users', 'Revenue', 'Orders', 'Growth'][i],
            fontSize: 12, fontFamily: 'Inter', fontWeight: 'normal',
            rotation: 0, fill: '#78716C', stroke: 'transparent', strokeWidth: 0, opacity: 1,
          });
          addElement({
            id: crypto.randomUUID(), type: 'text', x: 75 + i * 228, y: 202, text: ['12,543', '$84.2K', '1,247', '+24%'][i],
            fontSize: 24, fontFamily: 'Inter', fontWeight: 'bold',
            rotation: 0, fill: '#FAFAF9', stroke: 'transparent', strokeWidth: 0, opacity: 1,
          });
        }
        // Main chart area
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 50, y: 250, width: 580, height: 280,
          rx: 8, ry: 8, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 80, y: 285, text: 'Analytics Overview',
          fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
        // Sidebar panel
        addElement({
          id: crypto.randomUUID(), type: 'rect', x: 650, y: 250, width: 300, height: 280,
          rx: 8, ry: 8, rotation: 0, fill: '#292524', stroke: '#44403C', strokeWidth: 1, opacity: 1,
        });
        addElement({
          id: crypto.randomUUID(), type: 'text', x: 680, y: 285, text: 'Recent Activity',
          fontSize: 14, fontFamily: 'Inter', fontWeight: 'bold',
          rotation: 0, fill: '#A8A29E', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
    {
      id: 'star-burst',
      name: 'Star Burst',
      description: 'Decorative star pattern',
      category: 'shapes',
      icon: <Star className="w-5 h-5" />,
      color: '#F59E0B',
      apply: () => {
        clearDocument();
        // Large background circle
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 400, radius: 250,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 0.05,
        });
        // Concentric rings
        [200, 150, 100, 50].forEach((r, i) => {
          addElement({
            id: crypto.randomUUID(), type: 'circle', x: 450, y: 400, radius: r,
            rotation: 0, fill: 'transparent', stroke: '#D97757', strokeWidth: 1, opacity: 0.2 + i * 0.1,
          });
        });
        // Radiating lines
        for (let i = 0; i < 12; i++) {
          const angle = (i * 30 * Math.PI) / 180;
          addElement({
            id: crypto.randomUUID(), type: 'line',
            x: 450 + Math.cos(angle) * 50, y: 400 + Math.sin(angle) * 50,
            x2: 450 + Math.cos(angle) * 250, y2: 400 + Math.sin(angle) * 250,
            rotation: 0, fill: 'transparent', stroke: '#D97757', strokeWidth: 1, opacity: 0.2,
          });
        }
        // Center
        addElement({
          id: crypto.randomUUID(), type: 'circle', x: 450, y: 400, radius: 30,
          rotation: 0, fill: '#D97757', stroke: 'transparent', strokeWidth: 0, opacity: 1,
        });
      },
    },
  ];

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="absolute left-4 right-4 top-[calc(max(1rem,env(safe-area-inset-top))+3.5rem)] md:top-16 md:right-auto md:w-80 bg-claude-surface/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-claude-border/50 z-40 flex flex-col gap-3 max-h-[50vh] md:max-h-[70vh] overflow-hidden">
      <h3 className="text-xs font-semibold text-claude-text-muted uppercase tracking-wider">Templates</h3>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-claude-terracotta text-white'
                : 'bg-claude-bg/50 text-claude-text-dim hover:text-claude-text-muted hover:bg-claude-surface-hover'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={template.apply}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-claude-surface-hover text-claude-text-muted hover:text-claude-text transition-all text-left group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{ backgroundColor: template.color + '20', color: template.color }}
            >
              {template.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{template.name}</span>
              <span className="text-xs text-claude-text-dim truncate">{template.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
