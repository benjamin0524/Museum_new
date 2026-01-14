import React, { useRef, useState } from 'react';
import { useTexture, Text } from '@react-three/drei';
import { ArtworkData } from '../types';
import * as THREE from 'three';

interface ArtworkProps {
  data: ArtworkData;
  onSelect: (artwork: ArtworkData) => void;
  isHovered: boolean;
  setHoveredId: (id: number | null) => void;
}

export const Artwork: React.FC<ArtworkProps> = ({ data, onSelect, isHovered, setHoveredId }) => {
  const texture = useTexture(data.imageUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  // Handle interaction click
  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(data);
  };

  return (
    <group position={new THREE.Vector3(...data.position)} rotation={new THREE.Euler(...data.rotation)}>
      {/* Frame - Gold/Brass Finish */}
      <mesh 
        position={[0, 0, -0.05]}
        onClick={handleClick}
        onPointerOver={() => setHoveredId(data.id)}
        onPointerOut={() => setHoveredId(null)}
      >
        <boxGeometry args={[2.2, 3.2, 0.1]} />
        <meshStandardMaterial 
          color={isHovered ? "#ffeb3b" : "#d4af37"} 
          roughness={0.3} 
          metalness={0.6} 
        />
      </mesh>

      {/* Canvas / Image */}
      <mesh position={[0, 0, 0.01]} onClick={handleClick}
        onPointerOver={() => setHoveredId(data.id)}
        onPointerOut={() => setHoveredId(null)}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Plaque - White modern style */}
      <group position={[0, -2, 0]}>
        <mesh>
          <planeGeometry args={[1.5, 0.5]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        <Text 
          position={[0, 0.05, 0.01]} 
          fontSize={0.15} 
          color="#333" 
          anchorX="center" 
          anchorY="middle"
          maxWidth={1.4}
        >
          {data.title.length > 20 ? data.title.substring(0, 20) + '...' : data.title}
        </Text>
        <Text 
          position={[0, -0.15, 0.01]} 
          fontSize={0.1} 
          color="#666" 
          anchorX="center" 
          anchorY="middle"
        >
          {data.artist}
        </Text>
      </group>
    </group>
  );
};