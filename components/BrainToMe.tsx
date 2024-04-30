import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const BrainToMe = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = mountRef.current;
        if (!element) return;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(element.clientWidth, element.clientHeight);
        element.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000);
        camera.position.z = 50;

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 10, 10);
        scene.add(directionalLight);

        // OrbitControls to allow user interaction
        new OrbitControls(camera, renderer.domElement);

        const axesHelper = new THREE.AxesHelper(50);
        scene.add(axesHelper);


        // GLTFLoader to load the .glb file
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            '/models/brain.glb',
            (gltf) => {
                const brain = gltf.scene;
                scene.add(brain);

                // Set the position
                brain.position.set(0, -5, 0);

                // Scale the brain model to make it larger
                // The scale values (x, y, z) can be adjusted based on your needs
                brain.scale.set(100, 100, 100); // Adjust these values as needed
            },
            (xhr) => {
                console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
            },
            (error) => {
                console.error('An error happened while loading the model:', error);
            }
        );


        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            element.removeChild(renderer.domElement);
            scene.clear();
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className="max-w-none min-w-0 pb-8 opacity-95 bg-background text-copy-light p-8 rounded-lg">
            <h1 className="text-4xl font-bold my-2 text-primary">The 🧠 To Me</h1>
        </div>
    );
}

export default BrainToMe;
