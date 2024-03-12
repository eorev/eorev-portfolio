import React from 'react';

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
                <div className='mt-auto flex items-center justify-center py-4 text-gray-200'>
                    <a href='https://github.com/eorev' className='mx-2 cursor-pointer' target="_blank" rel="noopener noreferrer">
                        <img src='/github-mark-white.svg' alt='github' />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
