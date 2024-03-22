import '@/app/globals.css';
import ProjectCard from '@/components/ProjectCard';

const WhereIDoIt = () => {
    return (
        <div className="bg-background text-copy-light p-8 rounded-lg">
            <h1 className="text-3xl font-bold text-primary mb-4">Where I Do It</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProjectCard
                    title="Sample Project"
                    description="This is a brief description of what the project is about. Click to learn more!"
                    link="https://example.com"
                    image="https://via.placeholder.com/400"
                />
            </div>
        </div>
    );
};

export default WhereIDoIt;
