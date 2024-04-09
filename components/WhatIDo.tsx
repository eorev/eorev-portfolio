import '@/app/globals.css';

interface TechCardProps {
    icon: string;
    name: string;
    type: string;
    useCase: string;
    bgColor: string;
}

// Use the TechCardProps interface in your TechCard component
const TechCard = ({ icon, name, type, useCase, bgColor }: TechCardProps) => {
    return (
        <div className="grid grid-cols-12 rounded-lg overflow-hidden">
            {/* Image Container */}
            <div className={`col-span-2 flex justify-center items-center ${bgColor}`}>
                <img src={icon} alt={name} className="object-contain w-full h-full p-2 white-icon" />
            </div>

            {/* Content Container */}
            <div className="col-span-10 p-4 flex flex-col justify-between text-white bg-gray-900">
                {/* Name Box */}
                <div className="bg-gray-800 p-2 rounded-r-lg mb-2">
                    <h5 className="text-xs font-bold text-gray-400">name</h5>
                    <p>{name}</p>
                </div>

                {/* Type Box */}
                <div className="bg-gray-800 p-2 rounded-r-lg mb-2">
                    <h5 className="text-xs font-bold text-gray-400">type</h5>
                    <p>{type}</p>
                </div>

                {/* Use Case Box */}
                <div className="bg-gray-800 p-2 rounded-r-lg">
                    <h5 className="text-xs font-bold text-gray-400">use case</h5>
                    <p>{useCase}</p>
                </div>
            </div>
        </div>
    );
};


const WhatIDo = () => {
    return (
        <div className="max-w-none min-w-0 pb-8 opacity-95 bg-background text-copy-light p-8 rounded-lg">
            <h1 className="text-4xl font-bold my-2 text-primary">What I Do</h1>
            <div className="border-l-4 border-primary pl-4">
                <p className="my-4 text-primary-light">Ethan. 21 y/o developer fascinated by the ever-changing world.</p>
                <p className="my-4 text-primary-light">I design, build, and publish products of reliability.</p>
                <p className="my-4 text-primary-light">
                    I specialize in creating new enjoyable user experiences with an emphasis
                    on speed in the interactions that power these systems.
                </p>
                <p className="my-4 text-primary-light">
                    In my free time, I build new projects from the ground up and learn new
                    frameworks. I also enjoy learning about the intricacies of the technology
                    we take for granted each day.
                </p>
            </div>
            <h3 className="font-bold my-2 text-secondary">A note about computer science to me</h3>
            <div className="border-l-4 border-secondary pl-4">
                <p className="my-4 text-secondary-light">
                    Computer science and artificial intelligence are often perceived as
                    fields focused merely on technical advancements. However, at their core,
                    they are powerful tools with the potential to enhance our daily lives
                    profoundly. My ambition is to delve into the intricacies of human
                    nature, unraveling what motivates us each day, and apply these insights
                    in synergy with AI. By integrating these ideologies, I am dedicated to
                    creating innovative solutions that not only streamline our daily tasks
                    but also enrich our experiences, making every day more fulfilling. It’s
                    a journey towards leveraging technology to harmonize with our human
                    essence, transforming how we live and interact.
                </p>
            </div>

            <hr className="my-8 border-t border-gray-200" /> {/* Divider */}

            <div className="how-i-do-it-section">
                <h1 className="text-4xl font-bold my-2 text-primary">How I Do It</h1>
                <p className="my-4 text-primary-light">
                    I highly leverage new bleeding-edge technologies and languages like Elixir to stay on top of the game. You can find a list of my most-used technologies below.
                </p>

                {/* Tech Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <TechCard
                        icon="./elixir.svg"
                        name="Elixir"
                        type="Realtime, Backend"
                        useCase="Building fault-tolerant realtime systems that scale out across multiple nodes"
                        bgColor="bg-purple-600"
                    />
                    <TechCard
                        icon="/react.svg"
                        name="React"
                        type="Frontend framework"
                        useCase="Constructing stateful and durable frontends for large and interactive web apps"
                        bgColor="bg-blue-500"
                    />
                    <TechCard
                        icon="./typescript.svg"
                        name="TypeScript"
                        type="JS Superset"
                        useCase="Types for JS - will save your life when projects expand"
                        bgColor="bg-blue-700"
                    />
                    <TechCard
                        icon="./tailwindcss.svg"
                        name="TailwindCSS"
                        type="CSS Framework"
                        useCase="Utility-first CSS framework that makes styling a breeze"
                        bgColor="bg-teal-500"
                    />
                    <TechCard
                        icon="./nextdotjs.svg"
                        name="Next.js"
                        type="React Framework"
                        useCase="Building server-side rendering and static web applications using React"
                        bgColor="bg-gray-800"
                    />
                    <TechCard
                        icon="./mongodb.svg"
                        name="MongoDB"
                        type="NoSQL Database"
                        useCase="Flexible, scalable document database for building modern applications"
                        bgColor="bg-[#47A248]"
                    />

                </div>
            </div>
        </div>
    );
};

export default WhatIDo;
