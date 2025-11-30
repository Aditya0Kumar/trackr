const Progress = ({ progress, status }) => {
    const getColor = () => {
        switch (status) {
            case "Pending":
                return "bg-red-500";
            case "In Progress":
                return "bg-yellow-400";
            case "Completed":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1">
            <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getColor()}`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default Progress;
