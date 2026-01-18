import React from 'react';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { ROOM_WIDTH, ROOM_DEPTH, FRAME_LOCATIONS } from '../constants';

export const MuseumRoom: React.FC = () => {
  // Create arrays for repeated elements along the Z axis
  const sectionCount = 5;
  const sectionLength = ROOM_DEPTH / sectionCount;
  const positions = Array.from({ length: sectionCount }, (_, i) =>
    -ROOM_DEPTH / 2 + sectionLength / 2 + i * sectionLength
  );

  return (
    <group>
      {/* Atmosphere - Volumetric Fog Feel */}
      <fog attach="fog" args={['#1a1a1a', 5, 40]} />

      {/* --- LIGHTING --- */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Sunlight direction */}
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.5}
        castShadow
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Point lights along the corridor for warm ambiance */}
      {positions.map((z, i) => (
        <pointLight key={`pl-${i}`} position={[0, 6, z]} intensity={0.15} color="#fff5e6" distance={15} />
      ))}

      {/* Dramatic Spotlights for Artworks */}
      {FRAME_LOCATIONS.map((art) => {
        // Calculate spot position relative to artwork
        // Standard height is 2.5. Light should be higher (e.g., 6) and slightly in front
        const [x, y, z] = art.position;
        // Determine "front" based on rotation.
        // Rotation [0, 0, 0] (North wall) -> Front is +Z? No, artwork at -Z looking +Z.
        // Actually simpler: Just place light above and slightly away from wall

        let lightPos: [number, number, number] = [x, 6, z];
        let targetPos: [number, number, number] = [x, y, z];

        // Adjust light position based on wall to be slightly "in front"
        if (z < -ROOM_DEPTH / 2 + 2) { // End wall (North)
          lightPos = [x, 6, z + 3];
        } else if (Math.abs(x + ROOM_WIDTH / 2) < 2) { // West Wall (Left)
          lightPos = [x + 3, 6, z];
        } else if (Math.abs(x - ROOM_WIDTH / 2) < 2) { // East Wall (Right)
          lightPos = [x - 3, 6, z];
        }

        return (
          <group key={`spot-${art.id}`}>
            <spotLight
              position={lightPos}
              target-position={targetPos}
              intensity={1.5}
              angle={0.5}
              penumbra={0.4}
              castShadow
              color="#fff0e0" // Slightly warm gallery light
              distance={20}
            />
            {/* Visual light fixture (track light) */}
            <mesh position={lightPos}>
              <cylinderGeometry args={[0.1, 0.1, 0.3]} />
              <meshStandardMaterial color="#222" emissive="#444" />
            </mesh>
          </group>
        );
      })}


      {/* --- ARCHITECTURE --- */}

      {/* Floor - Premium Reflective Material */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={60} // Strength of the reflections
          roughness={0.6} // Glossy but slightly matte wood
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#2a2a2a" // Dark elegant floor
          metalness={0.5}
          mirror={0.5} // Mirror intensity
        />
      </mesh>

      {/* Sub-floor to prevent z-fighting gaps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#111" />
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
          <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
        </mesh>

        {/* Entrance Wall (South/Back) */}
        <mesh position={[0, 4, ROOM_DEPTH / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[ROOM_WIDTH, 8]} />
          <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
        </mesh>

        {/* Left Wall (West) */}
        <mesh position={[-ROOM_WIDTH / 2, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[ROOM_DEPTH, 8]} />
          <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
        </mesh>

        {/* Right Wall (East) */}
        <mesh position={[ROOM_WIDTH / 2, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[ROOM_DEPTH, 8]} />
          <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
        </mesh>
      </group>

      {/* Skirting Boards */}
      <group position={[0, 0.25, 0]}>
        {/* Long walls */}
        <mesh position={[-ROOM_WIDTH / 2 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[ROOM_DEPTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[ROOM_WIDTH / 2 - 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[ROOM_DEPTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* End walls */}
        <mesh position={[0, 0, -ROOM_DEPTH / 2 + 0.05]}>
          <boxGeometry args={[ROOM_WIDTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, ROOM_DEPTH / 2 - 0.05]}>
          <boxGeometry args={[ROOM_WIDTH, 0.5, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* --- REPEATED DECORATIONS --- */}
      {/* We place skylights and benches at intervals */}

      {positions.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>

          {/* Phase 2: Ceiling Beams - Dark Wood */}
          <mesh position={[0, 7.8, 0]} receiveShadow>
            <boxGeometry args={[ROOM_WIDTH, 0.4, 0.8]} />
            <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
          </mesh>

          {/* Phase 2: Wall Moldings (Chair Rails) - Running along sides */}
          <group>
            {/* Left Wall Rail */}
            <mesh position={[-ROOM_WIDTH / 2 + 0.1, 1.2, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.1, sectionLength]} />
              <meshStandardMaterial color="#ccc" />
            </mesh>
            {/* Right Wall Rail */}
            <mesh position={[ROOM_WIDTH / 2 - 0.1, 1.2, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.1, sectionLength]} />
              <meshStandardMaterial color="#ccc" />
            </mesh>

            {/* Vertical Panels (Wainscoting style) - every 2 meters? */}
            {[-2, 0, 2].map((offset) => (
              <group key={`panel-${offset}`}>
                <mesh position={[-ROOM_WIDTH / 2 + 0.05, 0.6, offset]}>
                  <boxGeometry args={[0.05, 1.0, 0.05]} />
                  <meshStandardMaterial color="#ccc" />
                </mesh>
                <mesh position={[ROOM_WIDTH / 2 - 0.05, 0.6, offset]}>
                  <boxGeometry args={[0.05, 1.0, 0.05]} />
                  <meshStandardMaterial color="#ccc" />
                </mesh>
              </group>
            ))}
          </group>


          {/* Skylight Frame - Darker industrial style */}
          <group position={[0, 8, 0]}>
            {/* Frame */}
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <boxGeometry args={[ROOM_WIDTH - 4, 3, 0.4]} />
              <meshStandardMaterial color="#111" roughness={0.5} />
            </mesh>
            {/* Glass */}
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[ROOM_WIDTH - 4.5, 2.5]} />
              <meshBasicMaterial color="#e0f7fa" transparent opacity={0.2} toneMapped={false} />
            </mesh>
          </group>

          {/* Place Benches & Plants every OTHER section, or centered */}
          {idx % 2 !== 0 && (
            <group>
              {/* Central Bench - Modern Dark Wood + Cushion */}
              <group rotation={[0, Math.PI / 2, 0]}>
                <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                  <boxGeometry args={[3, 0.1, 1.2]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
                </mesh>
                {/* Legs */}
                <mesh position={[-1.2, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#000" />
                </mesh>
                <mesh position={[1.2, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#000" />
                </mesh>
                {/* Cushion */}
                <mesh position={[0, 0.5, 0]}>
                  <boxGeometry args={[2.8, 0.1, 1.1]} />
                  <meshStandardMaterial color="#8d6e63" roughness={1} />
                </mesh>
              </group>

              {/* Plants slightly offset - Upgraded Low Poly */}
              <group position={[3.5, 0, 0]}>
                {/* Pot */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <cylinderGeometry args={[0.4, 0.3, 0.8, 8]} />
                  <meshStandardMaterial color="#222" />
                </mesh>
                {/* Foliage - Stacked spheres for volume */}
                <group position={[0, 1.0, 0]}>
                  <mesh position={[0, 0, 0]}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#2e7d32" /></mesh>
                  <mesh position={[0, 0.4, 0.2]}><dodecahedronGeometry args={[0.4, 0]} /><meshStandardMaterial color="#388e3c" /></mesh>
                  <mesh position={[-0.2, 0.3, -0.2]}><dodecahedronGeometry args={[0.4, 0]} /><meshStandardMaterial color="#4caf50" /></mesh>
                </group>
              </group>

              <group position={[-3.5, 0, 0]}>
                {/* Pot */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <cylinderGeometry args={[0.4, 0.3, 0.8, 8]} />
                  <meshStandardMaterial color="#222" />
                </mesh>
                {/* Foliage */}
                <group position={[0, 1.0, 0]}>
                  <mesh position={[0, 0, 0]}><dodecahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#2e7d32" /></mesh>
                  <mesh position={[0, 0.4, -0.2]}><dodecahedronGeometry args={[0.4, 0]} /><meshStandardMaterial color="#388e3c" /></mesh>
                  <mesh position={[0.2, 0.3, 0.2]}><dodecahedronGeometry args={[0.4, 0]} /><meshStandardMaterial color="#4caf50" /></mesh>
                </group>
              </group>
            </group>
          )}

        </group>
      ))}

    </group>
  );
};