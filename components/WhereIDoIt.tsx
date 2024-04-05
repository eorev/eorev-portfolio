import React from 'react';
import '@/app/globals.css';

interface Experience {
    company: string;
    role: string;
    description: string;
    link: string;
    image: string;
    tag: string;
    period?: string;
}

const experiences: Experience[] = [
    {
        company: 'Prudential',
        role: 'Incoming Software Engineer Intern',
        description: 'At Prudential Financial, I will be working as a Software Engineer Intern on the Global Technology team. I will be working on a variety of projects and learning from experienced engineers.',
        link: 'https://www.prudential.com/',
        image: './prudential.jpeg',
        tag: 'Professional',
    },
    {
        company: 'Alpha Kappa Psi',
        role: 'Info-Tech Chair',
        description: 'At Alpha Kappa Psi, I am responsible for managing the chapter website and maintaining our online presence.  I do this by optimizing our website for SEO and ensuring that our website is up to date.',
        link: 'https://udelakpsi.com/',
        image: './akpsi.jpeg',
        tag: 'Freelance',
    },
    {
        company: 'Longboard Pharmaceuticals',
        role: 'Information Technology Intern',
        description: 'At Longboard Pharmaceuticals, I worked as an IT Intern where I was responsible for managing the company\'s IT infrastructure. I had the opportunity to perform audits and ensure that the companys IT infrastructure was secure.',
        link: 'https://www.longboardpharma.com/',
        image: './longboard.jpeg',
        tag: 'Professional',
    },
    {
        company: 'University of Delaware',
        role: 'Undergraduate Teaching Assistant',
        description: 'At the University of Delaware, I worked as an undergraduate teaching assistant for the Computer Science department. I was responsible for grading assignments and assisting students with their python coursework.',
        link: 'https://www.cis.udel.edu/',
        image: './ud.png',
        tag: 'Student',
    },
    {
        company: 'Click / Freelance',
        role: 'Freelance Web Developer',
        description: 'Since 2018, I have been working as a freelance web developer. Throughout these years, I founded Click Automation where I worked on a variety of projects for clients. I have worked on projects ranging from simple websites to complex web applications.',
        link: 'https://twitter.com/KodaiAIO/',
        image: './click.jpeg',
        tag: 'Freelance',
    },
];

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
    const { company, role, description, link, image, tag, period } = experience;

    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block bg-foreground rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <img src={image} alt={`${company} logo`} className="w-full h-48 object-cover" />
            <div className="p-6">
                <div className="text-lg font-bold text-primary-content">{company}</div>
                {period && <div className="text-sm text-secondary">{period}</div>}
                <div className="text-md text-primary-light font-semibold mt-1">{role}</div>
                <div className="text-copy-light mt-2">{description}</div>
                <div className="text-sm text-secondary-light mt-3">{tag}</div>
            </div>
        </a>
    );
};


const WhereIDoIt: React.FC = () => (
    <div className="p-8 bg-background">
        <h1 className="text-3xl font-bold text-primary mb-4">Where I Do It</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp, index) => <ExperienceCard key={index} experience={exp} />)}
        </div>
    </div>
);

export default WhereIDoIt;
