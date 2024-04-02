import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface NavbarProps {
    setCurrentView: (view: string) => void;
    currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentView, currentView }) => {
    const handleSetCurrentView = (view: string) => {
        setCurrentView(view);
    };

    return (
        <div className='flex flex-col p-8 w-60 h-screen text-white border-r border-white'>
            <div className='flex flex-col h-full'>
                <div className='font-semibold text-2xl py-2'>
                    Ethan Orevillo
                </div>
                <div className='flex flex-col'>
                    <button onClick={() => handleSetCurrentView("whatido")} className={`py-2 ${currentView === "whatido" ? 'bg-pink-400' : ''}`}>
                        What I Do
                    </button>
                    <button onClick={() => handleSetCurrentView("whereidoit")} className={`py-2 ${currentView === "whereidoit" ? 'bg-pink-400' : ''}`}>
                        Where I Do It
                    </button>
                    <button onClick={() => handleSetCurrentView("theextras")} className={`py-2 ${currentView === "theextras" ? 'bg-pink-400' : ''}`}>
                        The Extras
                    </button>
                </div>
                <div className='mt-auto flex items-center justify-center py-4 space-x-4'>
                    <a href='https://github.com/eorev' target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} size="lg" />
                    </a>
                    <a href='https://www.linkedin.com/in/ethan-orevillo' target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} size="lg" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
