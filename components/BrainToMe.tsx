import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const BrainModel = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const brainModelRef = useRef<THREE.Object3D | null>(null);  // Ref to store the brain model

    useEffect(() => {
        const element = mountRef.current;
        if (!element) return;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(element.clientWidth, element.clientHeight);
        element.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000);
        camera.position.z = 30;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 50, 50);
        scene.add(directionalLight);

        new OrbitControls(camera, renderer.domElement);

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            '/models/brain.glb',
            (gltf) => {
                const brain = gltf.scene;
                scene.add(brain);
                brainModelRef.current = brain;  // Store the brain model in the ref
                brain.position.set(0, 0, 0);
                brain.scale.set(20, 21, 20);
                brain.rotation.y = Math.PI;
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            if (brainModelRef.current) {
                brainModelRef.current.rotation.y += 0.005;  // Access the brain model from the ref
            }
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (brainModelRef.current) {
                scene.remove(brainModelRef.current);
            }
            element.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div className="w-full bg-background flex flex-col items-center justify-center p-8 overflow-auto">
            <header className="w-full text-left">
                <h1 className="text-3xl font-bold text-primary mb-4">The 🧠 To Me</h1>
            </header>
            <div ref={mountRef} className="flex justify-center items-center w-full h-96">
                {/* Renderer attaches here */}
            </div>
            <div className="w-full p-4">
                <p className="text-xl font-semibold text-primary-content">
                    Explore the Complexities of the Brain
                </p>
                <p className="text-md text-copy-light mt-2">
                    Dive deep into the intricacies of our neural networks and discover how they define every aspect of human cognition and behavior.
                </p>
            </div>
        </div>
    );
};

export default BrainModel;
