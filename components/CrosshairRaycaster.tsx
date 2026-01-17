import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface CrosshairRaycasterProps {
    setHoveredId: (id: number | null) => void;
    enabled: boolean;
}

export const CrosshairRaycaster: React.FC<CrosshairRaycasterProps> = ({ setHoveredId, enabled }) => {
    const { scene, camera } = useThree();
    const raycaster = useRef(new THREE.Raycaster());

    useFrame(() => {
        if (!enabled) {
            setHoveredId(null);
            return;
        }

        // Raycast from center of screen (0, 0 in normalized device coordinates)
        raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);

        // Find all intersections
        const intersects = raycaster.current.intersectObjects(scene.children, true);

        // Find the first object with artworkId in userData
        for (const intersect of intersects) {
            if (intersect.object.userData.artworkId) {
                setHoveredId(intersect.object.userData.artworkId);
                return;
            }
        }

        // No artwork found
        setHoveredId(null);
    });

    return null;
};
