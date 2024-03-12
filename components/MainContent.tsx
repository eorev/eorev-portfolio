import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import WhatIDo from "@/components/WhatIDo";
import TheExtras from "@/components/TheExtras";
import WhereIDoIt from "@/components/WhereIDoIt";

export default function MainContent() {
    const [currentView, setCurrentView] = useState("whatido");
    const [activeView, setActiveView] = useState("whatido");
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (currentView !== activeView) {
            setIsFading(true);
            setTimeout(() => {
                setActiveView(currentView);
                setIsFading(false);
            }, 100);
        }
    }, [currentView]);

    const renderView = () => {
        switch (activeView) {
            case "whatido":
                return <WhatIDo />;
            case "whereidoit":
                return <WhereIDoIt />;
            case "theextras":
                return <TheExtras />;
            default:
                return null;
        }
    };

    return (
        <div className="flex">
            <Navbar setCurrentView={setCurrentView} currentView={currentView} />
            <div className={`flex-1 transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                {renderView()}
            </div>
        </div>
    );
}
