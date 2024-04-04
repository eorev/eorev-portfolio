import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface NavbarProps {
    setCurrentView: (view: string) => void;
    currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentView, currentView }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSetCurrentView = (view: string) => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Desktop Navbar */}
            <div className="hidden md:flex flex-col w-60 h-screen fixed inset-y-0 left-0 z-10 bg-background p-8 text-copy items-center">
                <div className='font-semibold text-2xl mb-10 text-center'>
                    Ethan Orevillo
                </div>
                <div className='flex flex-col space-y-4 w-full items-center'>
                    <button onClick={() => handleSetCurrentView("whatido")} className={`py-2 w-full text-center ${currentView === "whatido" ? 'bg-primary text-primary-content' : 'text-copy-lighter'}`}>
                        What I Do
                    </button>
                    <button onClick={() => handleSetCurrentView("whereidoit")} className={`py-2 w-full text-center ${currentView === "whereidoit" ? 'bg-primary text-primary-content' : 'text-copy-lighter'}`}>
                        Where I Do It
                    </button>
                    <button onClick={() => handleSetCurrentView("theextras")} className={`py-2 w-full text-center ${currentView === "theextras" ? 'bg-primary text-primary-content' : 'text-copy-lighter'}`}>
                        The Extras
                    </button>
                </div>
                <div className='mt-auto flex items-center justify-center space-x-4'>
                    <a href='https://github.com/eorev' target="_blank" rel="noopener noreferrer" className="text-copy-light hover:text-copy">
                        <FontAwesomeIcon icon={faGithub} size="lg" />
                    </a>
                    <a href='https://www.linkedin.com/in/ethan-orevillo' target="_blank" rel="noopener noreferrer" className="text-copy-light hover:text-copy">
                        <FontAwesomeIcon icon={faLinkedin} size="lg" />
                    </a>
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden flex justify-between items-center p-4 w-full fixed top-0 z-40 bg-background text-copy">
                <span className='font-semibold'>Ethan Orevillo</span>
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-copy-light" size="lg" />
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden fixed inset-0 z-30 pt-14 backdrop-blur-md bg-opacity-30 bg-foreground ${isMobileMenuOpen ? 'flex' : 'hidden'} flex-col justify-between`}>
                <div className='flex flex-col items-center space-y-4 mt-5'>
                    <button onClick={() => handleSetCurrentView("whatido")} className="text-copy-light hover:text-copy">
                        What I Do
                    </button>
                    <button onClick={() => handleSetCurrentView("whereidoit")} className="text-copy-light hover:text-copy">
                        Where I Do It
                    </button>
                    <button onClick={() => handleSetCurrentView("theextras")} className="text-copy-light hover:text-copy">
                        The Extras
                    </button>
                </div>

                {/* Social links */}
                <div className='pb-4 flex justify-center space-x-6'>
                    <a href='https://github.com/eorev' target="_blank" rel="noopener noreferrer" className="text-copy-light hover:text-copy">
                        <FontAwesomeIcon icon={faGithub} size="2x" />
                    </a>
                    <a href='https://www.linkedin.com/in/ethan-orevillo' target="_blank" rel="noopener noreferrer" className="text-copy-light hover:text-copy">
                        <FontAwesomeIcon icon={faLinkedin} size="2x" />
                    </a>
                </div>
            </div>
        </>
    );
};

export default Navbar;
