import "./footer.css";

export const Footer = () => {
    return (
        <div className="w-full bg-premier-dark text-white px-4 md:px-8 py-8 md:py-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-4">
                <div className="flex flex-col gap-2">
                    <a href="https://youtu.be/UdDM4yTRejo?si=AEU_hbl_nRPIy9F6&t=4" target="_blank" rel="noreferrer" className="text-white no-underline hover:text-gray-300 transition-colors">
                        <h4 className="text-white text-base md:text-lg font-semibold flex items-center gap-2">
                            Premier Metrics <img src="/images/logo.png" alt="Premier Metrics Logo" className="w-5 h-auto"/>
                        </h4>
                        <p className="text-sm md:text-base text-gray-300">by Pedro Boudoux</p>
                    </a>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <a href="https://pedroboudoux.com" target="_blank" rel="noreferrer" className="text-white no-underline hover:text-gray-300 transition-colors text-sm md:text-base">Portfolio</a>
                    <a href="https://www.linkedin.com/in/pedroboudoux/" target="_blank" rel="noreferrer" className="text-white no-underline hover:text-gray-300 transition-colors text-sm md:text-base">LinkedIn</a>
                    <a href="https://github.com/pedro-boudoux/" target="_blank" rel="noreferrer" className="text-white no-underline hover:text-gray-300 transition-colors text-sm md:text-base">GitHub</a>
                </div>
            </div>
        </div>
    );
}