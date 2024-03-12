// TheExtras.tsx
import '@/app/globals.css';

const TheExtras = () => {
    return (
        <div className="extras-container p-4">
            <h1 className="text-2xl font-bold">Just The Extras</h1>
            <h2 className="text-xl mt-4">Thanks</h2>
            <p className="mt-2">
                Thanks for visiting. I hope you enjoyed your stay. The source code for this website is available{" "}
                <a href="https://github.com/eorev/eorev-portfolio-3" className="text-pink-500 hover:text-pink-600 transition-colors duration-300 ease-in-out no-underline">
                    here
                </a>.
            </p>
            <h2 className="text-xl mt-4">Contact</h2>
            <p className="mt-2">You can reach out to me by email or reaching out on discord!</p>
            <p className="mt-1">Email: iamnullcase@gmail.com</p>
            <p className="mt-1">Discord: thatisnull</p>
        </div>
    );
};

export default TheExtras;
