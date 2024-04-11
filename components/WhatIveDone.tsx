import '@/app/globals.css';
import ProjectCard from '@/components/ProjectCard';
import React, { useState, useEffect } from 'react';
import SkeletonLoader from '@/components/SkeletonLoader';

const projects = [
    {
        title: "👷 Project Freefall 🛠️",
        description: "A work in progress, the Project Freefall website is a web app containing information about Project Freefall.  Project FreeFall represents believing in oneself enough to take the leap, and freefall into the unknown- confident you will one day succeed.",
        link: "https://project-freefall.vercel.app/",
        image: "/Project FreeFall.jpeg",
    },
    {
        title: "Local Lens",
        description: "Built for HenHacks 2024, Locals Lens is a web app that allows users to be informed about their local politicians through the use of AI.  Built using Next.js, Tailwind, and Typescript.",
        link: "https://github.com/eorev/Local-Lens",
        image: "/local_lens.jpeg",
    },
    {
        title: "Sharable Wordle",
        description: "A sharable wordle game that allows users to play and share custom wordles with their friends. Built using MongoDB, Tailwind, Typescript, and Next.js.",
        link: "https://github.com/eorev/shareable-wordle",
        image: "/puzzle_wordle.jpeg",
    },
    {
        title: "Sorting Visualizer",
        description: "A sorting visualizer built using Tailwind, Typescript, and NextJS. Allows users to visualize sorting algorithms in real time.",
        link: "https://github.com/eorev/sorting-visualizer-2",
        image: "/sorting_visualizer.jpeg",
    },
    {
        title: "Chirp",
        description: "Winner at HenHacks2023 for best educational hack, Chirp is a web app built for students learning about algorithms and allows students to solve algorithmic problems through a visual interface. Built using Vite, Tailwind, React, and Typescript.",
        link: "https://github.com/eorev/Chirp",
        image: "/Chirp.jpeg",
    },
    {
        title: "Nestled",
        description: "Built for CISC275 our software engineering class, Nestled is a web app that allows users to browse a furniture catalog and simulates a shopping experience. Built using React, Firebase, and Tailwind.",
        link: "https://github.com/eorev/webstore",
        image: "/Nestled.jpeg",
    },
    {
        title: "Kodai",
        description: "Kodai was one of my pride and joys that I worked on whilst in highschool.  Kodai was developed using electron and was a desktop application that allowed users to purchase limited streetwear releases like Supreme and Sneaker websites.  Kodai is still running and closed-source but still has a special place in my heart.",
        link: "https://kodai.io/",
        image: "/kodai.png",
    },

];

const WhatIveDone = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="bg-background text-copy-light p-8 rounded-lg">
            <h1 className="text-3xl font-bold text-primary mb-4 text-center md:text-left">What I&apos;ve Done</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                {isLoading ? (
                    projects.map((_, index) => <SkeletonLoader key={index} />)
                ) : (
                    projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            title={project.title}
                            description={project.description}
                            link={project.link}
                            image={project.image}
                        />
                    ))
                )}
            </div>
        </div>

    );
};

export default WhatIveDone;