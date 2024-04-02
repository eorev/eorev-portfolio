import React, { useState } from 'react';
import Head from 'next/head';
import '@/app/globals.css';
import Navbar from "@/components/Navbar";
import WhatIDo from "@/components/WhatIDo";
import TheExtras from "@/components/TheExtras";
import WhereIDoIt from "@/components/WhereIDoIt";

export default function MainContent() {
    const [currentView, setCurrentView] = useState("whatido");

    const getPageTitle = () => {
        switch (currentView) {
            case "whatido":
                return "Ethan Orevillo • Ethan";
            case "whereidoit":
                return "Where • Ethan";
            case "theextras":
                return "Extras • Ethan";
            default:
                return "Page Not Found";
        }
    };

    const renderView = () => {
        switch (currentView) {
            case "whatido":
                return <WhatIDo />;
            case "whereidoit":
                return <WhereIDoIt />;
            case "theextras":
                return <TheExtras />;
            default:
                return <div>Not Found</div>;
        }
    };

    return (
        <>
            <Head>
                <title>{getPageTitle()}</title>
            </Head>
            <div className="flex h-screen overflow-hidden">
                <div className="flex flex-col w-60 border-r border-white h-screen">
                    <Navbar setCurrentView={setCurrentView} currentView={currentView} />
                </div>
                <div className="flex-grow overflow-auto">
                    {renderView()}
                </div>
            </div>
        </>
    );
}
