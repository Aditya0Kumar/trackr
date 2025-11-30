import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Navbar activeMenu={activeMenu} />

            {currentUser && (
                <div className="flex flex-1">
                    {/* Desktop sidebar */}
                    <div className="max-[1080px]:hidden">
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    {/* Content area */}
                    <div className="grow mx-5 bg-gray-800 min-h-[calc(100vh-80px)] rounded-lg p-4">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
