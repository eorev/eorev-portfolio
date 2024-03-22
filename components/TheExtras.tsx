import '@/app/globals.css';

const TheExtras = () => {
    return (
        <div className="extras-container p-8 bg-background text-copy-light rounded-lg">
            <h1 className="text-3xl font-bold text-primary mb-6">Just The Extras</h1>
            <div className="mb-8">
                <h2 className="text-2xl mt-4 text-primary-light">Thanks</h2>
                <p className="mt-2">
                    Thanks for visiting. I hope you enjoyed your stay. The source code for this website is available{" "}
                    <a href="https://github.com/eorev/eorev-portfolio-3" className="text-secondary hover:text-secondary-dark transition-colors duration-300 ease-in-out underline">
                        here
                    </a>.
                </p>
            </div>
            <div>
                <h2 className="text-2xl mt-4 text-primary-light">Contact</h2>
                <p className="mt-2">You can reach out to me by email or reaching out on discord!</p>
                <p className="mt-1">Email: iamnullcase@gmail.com</p>
                <p className="mt-1">Discord: thatisnull</p>
            </div>
        </div>
    );
};

export default TheExtras;
