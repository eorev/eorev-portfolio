import '@/app/globals.css';
import React from 'react';

interface ProjectCardProps {
    title: string;
    description: string;
    link: string;
    image: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, link, image }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-background text-copy-light hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <img className="w-full" src={image} alt={`Project ${title}`} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-primary">{title}</div>
                <p className="text-primary-light text-base">
                    {description}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <a href={link} className="inline-block bg-secondary hover:bg-secondary-dark text-secondary-content rounded-full px-3 py-1 text-sm font-semibold text-copy mr-2 mb-2">Learn More</a>
            </div>
        </div>
    );
};

export default ProjectCard;
