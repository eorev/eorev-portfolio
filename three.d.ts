// ./three.d.ts

declare module 'three/examples/jsm/loaders/OBJLoader' {
    import { Object3D } from 'three';
    export class OBJLoader {
        load(url: string, onLoad: (object: Object3D) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    }
}

declare module 'three/examples/jsm/loaders/MTLLoader' {
    import * as THREE from 'three';
    export class MTLLoader {
        constructor(manager?: THREE.LoadingManager);
        load(url: string, onLoad: (materialCreator: THREE.MTLLoader.MaterialCreator) => void, onProgress?: (event: ProgressEvent<EventTarget>) => void, onError?: (event: ErrorEvent) => void): void;
    }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher } from 'three';
    export class OrbitControls extends EventDispatcher {
        constructor(camera: Camera, domElement?: HTMLElement);
        enableDamping: boolean;
        dampingFactor: number;
        update(): void;
    }
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
    export interface GLTF {
        animations: AnimationClip[];
        scene: ThreeScene;
        scenes: ThreeScene[];
        cameras: Camera[];
        asset: object;
    }

    export class GLTFLoader {
        constructor(manager?: LoadingManager);
        load(url: string, onLoad?: (gltf: GLTF) => void, onProgress?: (event: ProgressEvent<EventTarget>) => void, onError?: (error: ErrorEvent) => void): void;
    }
}