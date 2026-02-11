import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-light-gray py-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-text-gray text-sm">
                    &copy; {new Date().getFullYear()} FloodSense. Disaster Management Centre. All rights reserved.
                </p>
                <div className="mt-2 flex justify-center space-x-4 text-xs text-text-gray opacity-80">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Emergency Contact: 117</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
