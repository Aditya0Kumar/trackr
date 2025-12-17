const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            {/* Background Pattern: Softer, material-inspired light background */}
            <div className="fixed inset-0 bg-slate-50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/30 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};

export default AuthLayout;