import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Project, ProjectNode } from '../types';

// Fix for missing JSX types in @react-three/fiber usage
// We augment both the 'react' module (for React 18+) and global JSX namespace to ensure coverage
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      color: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      color: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

interface GalaxySceneProps {
  projects: Project[];
  filter: string;
  onProjectSelect: (project: Project) => void;
}

const MONAD_PURPLE = '#836EF9';
const MONAD_DARK = '#200052';
const MONAD_LIGHT = '#D9D1FA';

const Node = ({ node, isSelected, onClick }: { node: ProjectNode; isSelected: boolean; onClick: (n: ProjectNode) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle pulse
      const scale = hovered || isSelected ? 1.5 : 1 + Math.sin(time * 2 + node.id) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={node.position}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick(node);
          }}
          onPointerOver={() => {
             document.body.style.cursor = 'pointer';
             setHovered(true);
          }}
          onPointerOut={() => {
             document.body.style.cursor = 'default';
             setHovered(false);
          }}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={isSelected ? '#fff' : node.color}
            emissive={isSelected ? MONAD_PURPLE : node.color}
            emissiveIntensity={hovered || isSelected ? 2 : 0.5}
            toneMapped={false}
          />
        </mesh>
        {(hovered || isSelected) && (
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/rajdhani/v15/L1XY2TCoB14p99S9ysO9.woff"
          >
            {node.name}
          </Text>
        )}
      </group>
    </Float>
  );
};

const Connections = ({ nodes }: { nodes: ProjectNode[] }) => {
  const lines = useMemo(() => {
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    // Create limited connections to avoid chaos
    for (let i = 0; i < nodes.length; i++) {
      // Connect to 2 nearest neighbors
      let nearest = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 8) { // Only connect if reasonably close
          nearest.push({ idx: j, dist });
        }
      }
      nearest.sort((a, b) => a.dist - b.dist);
      nearest.slice(0, 1).forEach(n => {
         connections.push([nodes[i].position, nodes[n.idx].position]);
      });
    }
    return connections;
  }, [nodes]);

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line}
          color={MONAD_PURPLE}
          opacity={0.1}
          transparent
          lineWidth={0.5}
        />
      ))}
    </group>
  );
};

export const GalaxyScene: React.FC<GalaxySceneProps> = ({ projects, filter, onProjectSelect }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Calculate galaxy positions
  const nodes = useMemo<ProjectNode[]>(() => {
    const tempNodes: ProjectNode[] = [];
    const count = projects.length;
    const radius = 30;
    const spiralTightness = 0.2;

    projects.forEach((p, i) => {
      // Spiral Galaxy Math
      const angle = spiralTightness * i;
      // Add some randomness to cluster them but keep structure
      const r = radius * (i / count) + (Math.random() - 0.5) * 5;
      
      const x = r * Math.cos(angle) + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 6; // Flattened disc
      const z = r * Math.sin(angle) + (Math.random() - 0.5) * 2;

      let color = MONAD_PURPLE;
      if (p.category === 'DeFi') color = '#4ade80'; // Green
      if (p.category === 'NFT') color = '#f472b6'; // Pink
      if (p.category === 'Gaming') color = '#facc15'; // Yellow
      if (p.category === 'Infrastructure') color = '#60a5fa'; // Blue
      if (p.category === 'Wallet') color = '#a78bfa'; // Violet

      tempNodes.push({
        ...p,
        id: i,
        position: new THREE.Vector3(x, y, z),
        color
      });
    });
    return tempNodes;
  }, [projects]);

  const filteredNodes = useMemo(() => {
    return filter === 'All' ? nodes : nodes.filter(n => n.category === filter);
  }, [nodes, filter]);

  const handleNodeClick = (node: ProjectNode) => {
    setSelectedId(node.id);
    onProjectSelect(node);
  };

  return (
    <div className="w-full h-screen absolute inset-0 bg-black z-0">
      <Canvas camera={{ position: [20, 20, 20], fov: 60 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 20, 80]} />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={MONAD_PURPLE} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={60} 
          autoRotate={!selectedId}
          autoRotateSpeed={0.5}
        />

        <group>
           <Connections nodes={filteredNodes} />
           {filteredNodes.map((node) => (
             <Node 
               key={node.id} 
               node={node} 
               isSelected={selectedId === node.id}
               onClick={handleNodeClick}
             />
           ))}
        </group>
      </Canvas>
    </div>
  );
};