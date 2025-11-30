const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">{children}</div>
        </div>
    );
};

export default AuthLayout;
