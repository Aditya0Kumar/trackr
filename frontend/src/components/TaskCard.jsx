import Progress from "./Progress";
import moment from "moment";
import AvatarGroup from "./AvatarGroup";
import { FaFileLines } from "react-icons/fa6";

const TaskCard = ({
    title,
    description,
    priority,
    status,
    progress,
    createdAt,
    dueDate,
    assignedTo = [],
    attachmentCount = 0,
    completedTodoCount = 0,
    todoChecklist = [],
    onClick,
}) => {
    // status colors: Pending=red, In Progress=yellow, Completed=green
    const getStatusTag = () => {
        switch (status) {
            case "Pending":
                return {
                    bg: "bg-red-600/10",
                    text: "text-red-400",
                    border: "border-red-600/30",
                };
            case "In Progress":
                return {
                    bg: "bg-yellow-600/10",
                    text: "text-yellow-300",
                    border: "border-yellow-600/30",
                };
            case "Completed":
                return {
                    bg: "bg-green-600/10",
                    text: "text-green-300",
                    border: "border-green-600/30",
                };
            default:
                return {
                    bg: "bg-gray-700/10",
                    text: "text-gray-300",
                    border: "border-gray-600/30",
                };
        }
    };

    const getPriorityTag = () => {
        switch (priority) {
            case "High":
                return { bg: "bg-red-700/10", text: "text-red-400" };
            case "Medium":
                return { bg: "bg-yellow-700/10", text: "text-yellow-300" };
            case "Low":
                return { bg: "bg-green-700/10", text: "text-green-300" };
            default:
                return { bg: "bg-gray-700/10", text: "text-gray-300" };
        }
    };

    const statusTag = getStatusTag();
    const priorityTag = getPriorityTag();

    return (
        <div
            onClick={onClick}
            className="bg-gray-900/60 border border-gray-800 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition p-4 flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusTag.bg} ${statusTag.text} ${statusTag.border}`}
                    >
                        {status}
                    </div>

                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${priorityTag.bg} ${priorityTag.text}`}
                    >
                        {priority} Priority
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                    {description}
                </p>

                <div className="mt-3 text-sm text-gray-300">
                    Task Done:{" "}
                    <span className="font-semibold text-white">
                        {completedTodoCount} / {todoChecklist.length || 0}
                    </span>
                </div>

                <div className="mt-3">
                    <Progress progress={progress} status={status} />
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/60">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs text-gray-400">Start</div>
                        <div className="text-sm font-medium text-gray-200">
                            {moment(createdAt).format("Do MMM YYYY")}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-400">Due</div>
                        <div className="text-sm font-medium text-gray-200">
                            {moment(dueDate).format("Do MMM YYYY")}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <AvatarGroup avatars={assignedTo || []} />

                    {attachmentCount > 0 ? (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700">
                            <FaFileLines className="text-gray-300" />
                            <span className="text-xs text-gray-200">
                                {attachmentCount}
                            </span>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-500">
                            No attachments
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
