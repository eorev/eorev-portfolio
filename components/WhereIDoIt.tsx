import '@/app/globals.css';
import ProjectCard from '@/components/ProjectCard';

const WhereIDoIt = () => {
    return (
        <div className="bg-background text-copy-light p-8 rounded-lg">
            <h1 className="text-3xl font-bold text-primary mb-4">Where I Do It</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProjectCard
                    title="Local Lens"
                    description="Built for HenHacks 2024, Locals Lens is a web app that allows users to be informed about their local politicians through the use of AI."
                    link="https://github.com/eorev/Local-Lens"
                    image="/local_lens.jpeg"
                />
                <ProjectCard
                    title="Sharable Wordle"
                    description="A sharable wordle game that allows users to play and share custom wordles with their friends.  Built using MongoDB, Tailwind, Typescript, and Next.js."
                    link="https://github.com/eorev/shareable-wordle"
                    image="/puzzle_wordle.jpeg"
                />
                <ProjectCard
                    title="Sorting Visualizer"
                    description="A sorting visualizer built using Tailwind, Typescript, and NextJS.  Allows users to visualize sorting algorithms in real time."
                    link="https://github.com/eorev/sorting-visualizer-2"
                    image="/sorting_visualizer.jpeg"
                />
                <ProjectCard
                    title="Nestled"
                    description="Built for CISC275 our software engineering class, Nestled is a web app that allows users to browse a furniture catalog and simulates a shopping experience.  Built using React, Firebase, and Tailwind."
                    link="https://github.com/eorev/webstore"
                    image="/Nestled.jpeg"
                />
            </div>
        </div>
    );
};

export default WhereIDoIt;
