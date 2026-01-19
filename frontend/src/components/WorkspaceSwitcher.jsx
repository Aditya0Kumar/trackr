
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Briefcase, Plus } from 'lucide-react';
import { setCurrentWorkspace } from '../redux/slice/workspaceSlice';

const WorkspaceSwitcher = ({ isCollapsed, className = "mb-6" }) => {
    const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSwitch = (workspace) => {
        dispatch(setCurrentWorkspace(workspace));
        setIsOpen(false);
        navigate('/user/dashboard'); 
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (isCollapsed) {
        return (
            <div className={`flex justify-center cursor-pointer ${className}`} onClick={() => navigate('/workspace/select')}>
                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md hover:bg-blue-700 transition">
                    {currentWorkspace?.name?.charAt(0).toUpperCase() || "W"}
                 </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition shadow-sm group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
                <div className="flex items-center min-w-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                        {currentWorkspace?.name?.charAt(0).toUpperCase() || "W"}
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {currentWorkspace?.role || "Member"}
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <div className="py-1">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Switch Workspace
                        </div>
                        
                        {workspaces.map((ws) => (
                            <button
                                key={ws._id}
                                onClick={() => handleSwitch(ws)}
                                className={`group flex w-full items-center px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${ws._id === currentWorkspace?._id ? 'text-blue-700 bg-blue-50' : 'text-gray-700'}`}
                            >
                                <Briefcase className="mr-3 h-4 w-4 text-gray-400" />
                                {ws.name}
                                {ws._id === currentWorkspace?._id && (
                                    <span className="ml-auto w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                            </button>
                        ))}

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                            onClick={() => {
                                dispatch(setCurrentWorkspace(null));
                                setIsOpen(false);
                                navigate('/user/dashboard');
                            }}
                            className={`group flex w-full items-center px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${!currentWorkspace ? 'text-blue-700 bg-blue-50' : 'text-gray-700'}`}
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600 mr-3">
                                <span className="font-bold text-xs">MW</span>
                            </div>
                            My Work (Personal)
                            {!currentWorkspace && (
                                <span className="ml-auto w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                            onClick={() => { setIsOpen(false); navigate('/workspace/create'); }}
                            className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            <Plus className="mr-3 h-4 w-4 text-gray-400" />
                            Create New Workspace
                        </button>
                        
                         <button
                            onClick={() => { setIsOpen(false); navigate('/workspace/select'); }}
                            className="group flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            <Briefcase className="mr-3 h-4 w-4 text-gray-400" />
                            View All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceSwitcher;
