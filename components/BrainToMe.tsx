import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const BrainModel = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const brainRef = useRef<THREE.Object3D | null>(null);

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
                brainRef.current = brain;
                brain.position.set(0, 0, 0);
                brain.scale.set(20, 20, 20);
                brain.rotation.y = Math.PI;
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            if (brainRef.current) {
                brainRef.current.rotation.y += 0.005;
            }
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (brainRef.current) {
                scene.remove(brainRef.current);
            }
            element.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div className="max-w-none min-w-0 pb-8 opacity-95 bg-background text-copy-light p-8 rounded-lg">
            <header className="w-full text-left">
                <h1 className="text-4xl font-bold my-2 text-primary">The 🧠 To Me</h1>
            </header>
            <div ref={mountRef} className="flex justify-center items-center w-full h-96">
                {/* Renderer attaches here */}
            </div>
            <h2 className="text-3xl font-bold my-2 text-secondary">The Brain is Fascinating</h2>
            <div className="border-l-4 border-secondary pl-4">
                <p className="my-4 text-secondary-light">
                    The human brain, our quintessential processing unit, orchestrates every thought, emotion, and action with astonishing precision. Its complexities mirror the intricate circuits of a computer, yet its capabilities extend far beyond mere data processing.
                    <br /><br />
                    Such profound complexity sparks my curiosity about the potential symbiosis between our neurological framework and cutting-edge technology. Companies like Neuralink, which endeavor to bridge the gap between human cognitive functions and artificial enhancements, hold a special allure for me. The possibility of augmenting human abilities—not just to transcend our limitations but to radically improve the quality of life for those with disabilities—represents a frontier of innovation that is both thrilling and deeply personal.
                    <br /><br />
                    This vision is not just about the allure of advanced technology; it&apos;s driven by a heartfelt desire to aid those who face challenges similar to what my grandparents endured following their strokes. The potential to alleviate such suffering and enhance human capabilities offers a glimpse into a promising and transformative future, where technology serves humanity at its most profound needs.
                </p>
            </div>
        </div>
    );
};

export default BrainModel;
