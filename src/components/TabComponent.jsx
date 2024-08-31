import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
    { id: 1, label: 'FB', },
    { id: 2, label: 'YT', },
    { id: 3, label: 'TW', },
];

const TabComponent = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const handleMouseEnter = (id) => {
        setActiveTab(id);
    };

    return (
        <div className="tabs-container">
            <div className="tabs">
                {tabs.map((tab) => (
                    <motion.div
                        key={tab.id}
                        className="tab"
                        whileHover={{ scale: 1.1 }}
                        onMouseEnter={() => handleMouseEnter(tab.id)}
                    // transition={{ type: 'spring', stiffness: 300 }}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                className="tab-label bottom-0 h-1"
                                layoutId="underline"
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence wait>
                {tabs.map(
                    (tab) =>
                        tab.id === activeTab && (
                            <motion.div
                                key={tab.id}
                                className="mt-4 p-4 border border-gray-300 rounded"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {tab.content}
                            </motion.div>
                        )
                )}
            </AnimatePresence>
        </div>
    );
};

export default TabComponent;
