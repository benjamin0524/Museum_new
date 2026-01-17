import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { MOVEMENT_SPEED, ROOM_WIDTH, ROOM_DEPTH } from '../constants';
import { AppState } from '../types';

import { InputState } from '../types';

interface PlayerProps {
  appState: AppState;
  setAppState: (s: AppState) => void;
  inputRef: React.MutableRefObject<InputState>;
  isMobile: boolean;
}

export const Player: React.FC<PlayerProps> = ({ appState, setAppState, inputRef, isMobile }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Movement state
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': setMoveForward(true); break;
        case 'ArrowLeft':
        case 'KeyA': setMoveLeft(true); break;
        case 'ArrowDown':
        case 'KeyS': setMoveBackward(true); break;
        case 'ArrowRight':
        case 'KeyD': setMoveRight(true); break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': setMoveForward(false); break;
        case 'ArrowLeft':
        case 'KeyA': setMoveLeft(false); break;
        case 'ArrowDown':
        case 'KeyS': setMoveBackward(false); break;
        case 'ArrowRight':
        case 'KeyD': setMoveRight(false); break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Unlock controls if we enter inspection mode
  useEffect(() => {
    if (appState === AppState.INSPECTING) {
      controlsRef.current?.unlock();
    }
  }, [appState]);

  useFrame((state, delta) => {
    if (appState !== AppState.PLAYING) return;
    // On Desktop, wait for lock. On Mobile, always active.
    if (!isMobile && !controlsRef.current?.isLocked) return;

    // Movement Logic
    const speed = MOVEMENT_SPEED * delta;

    if (controlsRef.current?.isLocked) {
      // Desktop PointerLock Logic
      direction.current.z = Number(moveForward) - Number(moveBackward);
      direction.current.x = Number(moveRight) - Number(moveLeft);
      direction.current.normalize();

      if (moveForward || moveBackward) {
        controlsRef.current.moveForward(direction.current.z * speed);
      }
      if (moveLeft || moveRight) {
        controlsRef.current.moveRight(direction.current.x * speed);
      }
    } else if (isMobile) {
      // Mobile Touch Logic from inputRef
      const { moveVector, lookDelta } = inputRef.current;

      // 1. Look (Rotation)
      // Sensitivity factor
      const lookSpeed = 0.005;
      // We manually rotate the camera object since we don't have PointerLock controls
      camera.rotation.y -= lookDelta.x * lookSpeed;
      // RESTRICT VERTICAL LOOK: camera.rotation.x is disabled
      camera.rotation.x = 0;

      // Reset delta after consumption
      inputRef.current.lookDelta = { x: 0, y: 0 };

      // 2. Move
      // Translate moveVector (Joystick X/Y) relative to camera direction
      if (moveVector.x !== 0 || moveVector.z !== 0) {
        // Forward/Backward (Z) - Joystick Y is Z (Up is -1, Down is 1? No, Joystick Y up is negative)
        // Typically Joystick Y < 0 is Forward.
        // moveRight/Forward usually takes distance.

        // We need to move relative to camera's Y-rotation only
        const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, camera.rotation.y, 0));
        const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, camera.rotation.y, 0));

        // Joystick Y is negative when up (Forward). X is positive when Right.
        // Move Vector Z is Joystick Y. X is Joystick X.
        // So -Y is forward.

        const moveSpeed = speed * 2; // Maybe boost a bit on mobile
        camera.position.addScaledVector(forward, -moveVector.z * moveSpeed);
        camera.position.addScaledVector(right, moveVector.x * moveSpeed);
      }
    }

    // Collision / Boundaries (Rectangular Room)
    const pos = camera.position;
    const xLimit = ROOM_WIDTH / 2 - 1.5;
    const zLimit = ROOM_DEPTH / 2 - 1.5;

    // Clamp position
    if (pos.x < -xLimit) pos.x = -xLimit;
    if (pos.x > xLimit) pos.x = xLimit;
    if (pos.z < -zLimit) pos.z = -zLimit;
    if (pos.z > zLimit) pos.z = zLimit;

    // Keep player on ground
    pos.y = 1.7;
  });

  return (
    <>
      {!isMobile && (
        <PointerLockControls
          ref={controlsRef}
          // Lock to horizon
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          onLock={() => setAppState(AppState.PLAYING)}
          onUnlock={() => {
            // if (appState === AppState.PLAYING) setAppState(AppState.PAUSED?);
          }}
        />
      )}
    </>
  );
};