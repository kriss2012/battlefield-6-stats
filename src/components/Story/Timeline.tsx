/**
 * Working: This file provides core functionality and UI rendering for its specific module.
 * Use: Imported and utilized across the application as part of the game's system logic.
 * #by Kiri Team
 */
import React from 'react';
import { motion } from 'framer-motion';

interface TimelineNode {
  id: string;
  label: string;
  chapter: number;
  type: 'STORY' | 'CHOICE' | 'ENDING';
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  position: { x: number; y: number };
}

interface TimelineProps {
  currentChapter: number;
  activePath?: string;
}

const timelineData: TimelineNode[] = [
  { id: 'c1', label: 'THE BOY WHO DISAPPEARED', chapter: 1, type: 'STORY', status: 'COMPLETED', position: { x: 50, y: 10 } },
  { id: 'c2', label: 'THE WEIGHT OF WATER', chapter: 2, type: 'STORY', status: 'COMPLETED', position: { x: 50, y: 25 } },
  { id: 'choice1', label: 'THE WORKSHOP SHED', chapter: 3, type: 'CHOICE', status: 'ACTIVE', position: { x: 50, y: 40 } },
  { id: 'path_warrior', label: 'WARRIOR PATH', chapter: 4, type: 'STORY', status: 'LOCKED', position: { x: 30, y: 55 } },
  { id: 'path_shadow', label: 'SHADOW PATH', chapter: 4, type: 'STORY', status: 'LOCKED', position: { x: 70, y: 55 } },
  { id: 'final', label: 'SHADOW RISING', chapter: 10, type: 'ENDING', status: 'LOCKED', position: { x: 50, y: 85 } },
];

const Timeline: React.FC<TimelineProps> = ({ currentChapter }) => {
  return (
    <div className="w-full h-96 bg-black/20 rounded-3xl border border-white/5 p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase">Visual Storyline Engine // Active path</span>
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connection Lines */}
        <path d="M50 10 L50 40 M50 40 L30 55 M50 40 L70 55 M30 55 L50 85 M70 55 L50 85" 
              fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />

        {timelineData.map((node) => {
          const isActive = node.chapter === currentChapter;
          const isCompleted = node.chapter < currentChapter;
          
          return (
            <g key={node.id}>
              <motion.circle
                cx={node.position.x}
                cy={node.position.y}
                r={isActive ? 2.5 : 1.5}
                className={`${isCompleted ? 'fill-blue-500' : isActive ? 'fill-blue-400' : 'fill-neutral-800'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
              <text 
                x={node.position.x} 
                y={node.position.y - 4} 
                textAnchor="middle" 
                fontSize="2.5" 
                className={`font-mono font-bold uppercase ${isActive ? 'fill-blue-400' : 'fill-neutral-600'}`}
              >
                {node.label}
              </text>
              {isActive && (
                <motion.circle 
                  cx={node.position.x}
                  cy={node.position.y}
                  r="4"
                  className="fill-none stroke-blue-500 stroke-[0.2]"
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-[8px] font-mono text-gray-600 uppercase tracking-[0.2em]">
        <span>Chapter {currentChapter} Active</span>
        <span>Branching Complexity: High</span>
      </div>
    </div>
  );
};

export default Timeline;
