import Link from 'next/link';
import React from 'react';

interface NavbarProps {
    setCurrentView: (view: string) => void;
    currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentView, currentView }) => {

    return (
        <div className='flex flex-col p-8 w-60 h-screen text-white border-r border-white'>
            <div className='flex flex-col h-full'>
                <div className='font-semibold text-2xl py-2'>
                    Ethan Orevillo
                </div>
                <div className='flex flex-col'>
                    <Link href="#whatido" passHref>
                        <span className={`py-2 flex cursor-pointer ${currentView === "whatido" ? 'relative after:absolute after:right-[-5px] after:top-0 after:bottom-0 after:w-[3px] after:bg-pink-400' : ''}`}>
                            what I do
                        </span>
                    </Link>
                    <Link href="#whereidoit" passHref>
                        <span className={`py-2 flex cursor-pointer ${currentView === "whereidoit" ? 'relative after:absolute after:right-[-5px] after:top-0 after:bottom-0 after:w-[3px] after:bg-pink-400' : ''}`}>
                            where I do it
                        </span>
                    </Link>
                    <Link href="#theextras" passHref>
                        <span className={`py-2 flex cursor-pointer ${currentView === "theextras" ? 'relative after:absolute after:right-[-5px] after:top-0 after:bottom-0 after:w-[3px] after:bg-pink-400' : ''}`}>
                            the extras
                        </span>
                    </Link>
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
