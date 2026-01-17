import React from 'react';
import * as THREE from 'three';
import { ROOM_WIDTH, ROOM_DEPTH } from '../constants';

export const MuseumRoom: React.FC = () => {
  // Create arrays for repeated elements along the Z axis
  const sectionCount = 5;
  const sectionLength = ROOM_DEPTH / sectionCount;
  const positions = Array.from({ length: sectionCount }, (_, i) =>
    -ROOM_DEPTH / 2 + sectionLength / 2 + i * sectionLength
  );

  return (
    <group>
      {/* --- LIGHTING --- */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Sunlight direction */}
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.8}
        castShadow
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Point lights along the corridor for warm ambiance */}
      {positions.map((z, i) => (
        <pointLight key={i} position={[0, 6, z]} intensity={0.2} color="#fff5e6" distance={15} />
      ))}

      {/* --- ARCHITECTURE --- */}

      {/* Floor - Dark Polished Wood/Marble */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#3e2723" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} />
      </mesh>

      {/* Walls - Gallery Grey */}
      <group>
        {/* End Wall (North/Far) */}
        <mesh position={[0, 4, -ROOM_DEPTH / 2]} receiveShadow>
          <planeGeometry args={[ROOM_WIDTH, 8]} />
          <meshStandardMaterial color="#dcdcdc" roughness={0.8} />
        </mesh>

        {/* Entrance Wall (South/Back) */}
        <mesh position={[0, 4, ROOM_DEPTH / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[ROOM_WIDTH, 8]} />
          <meshStandardMaterial color="#dcdcdc" roughness={0.8} />
        </mesh>

        {/* Left Wall (West) */}
        <mesh position={[-ROOM_WIDTH / 2, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[ROOM_DEPTH, 8]} />
          <meshStandardMaterial color="#dcdcdc" roughness={0.8} />
        </mesh>

        {/* Right Wall (East) */}
        <mesh position={[ROOM_WIDTH / 2, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[ROOM_DEPTH, 8]} />
          <meshStandardMaterial color="#dcdcdc" roughness={0.8} />
        </mesh>
      </group>

      {/* Skirting Boards */}
      <group position={[0, 0.25, 0]}>
        {/* Long walls */}
        <mesh position={[-ROOM_WIDTH / 2 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[ROOM_DEPTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        <mesh position={[ROOM_WIDTH / 2 - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[ROOM_DEPTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        {/* End walls */}
        <mesh position={[0, 0, -ROOM_DEPTH / 2 + 0.05]}>
          <boxGeometry args={[ROOM_WIDTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        <mesh position={[0, 0, ROOM_DEPTH / 2 - 0.05]}>
          <boxGeometry args={[ROOM_WIDTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
      </group>

      {/* --- REPEATED DECORATIONS --- */}
      {/* We place skylights and benches at intervals */}

      {positions.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>

          {/* Skylight Frame */}
          <group position={[0, 8, 0]}>
            {/* Frame */}
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[ROOM_WIDTH - 4, 4, 0.4]} />
              <meshStandardMaterial color="#fff" />
            </mesh>
            {/* Glass */}
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[ROOM_WIDTH - 4.5, 3.5]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>

          {/* Place Benches & Plants every OTHER section, or centered */}
          {idx % 2 !== 0 && (
            <group>
              {/* Central Bench */}
              <group rotation={[0, Math.PI / 2, 0]}>
                <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                  <boxGeometry args={[3, 0.1, 1.2]} />
                  <meshStandardMaterial color="#444" roughness={0.8} />
                </mesh>
                <mesh position={[-1.2, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#222" />
                </mesh>
                <mesh position={[1.2, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#222" />
                </mesh>
              </group>

              {/* Plants slightly offset */}
              <group position={[3, 0, 0]}>
                <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.6, 0.8, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
                <mesh position={[0, 1.0, 0]}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#4a7c59" /></mesh>
              </group>
              <group position={[-3, 0, 0]}>
                <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.6, 0.8, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
                <mesh position={[0, 1.0, 0]}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#4a7c59" /></mesh>
              </group>
            </group>
          )}

        </group>
      ))}

    </group>
  );
};