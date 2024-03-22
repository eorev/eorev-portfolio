import '@/app/globals.css';

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
        </div>
    );
};

export default WhatIDo;
