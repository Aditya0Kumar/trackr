import Progress from "./Progress";
import moment from "moment";
import AvatarGroup from "./AvatarGroup";
import { Paperclip, CalendarDays, Flag, ArchiveRestore } from "lucide-react"; // Using lucide-react for icons
import { motion } from "framer-motion"; // Import motion for animations

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
    // New prop for optional action button (e.g., Unarchive)
    actionButton = null, 
}) => {
    // status colors: Pending=red, In Progress=yellow, Completed=green, Awaiting Verification=orange
    const getStatusTag = () => {
        switch (status) {
            case "Pending":
                return {
                    bg: "bg-red-100",
                    text: "text-red-700",
                    border: "border-red-300",
                };
            case "In Progress":
                return {
                    bg: "bg-blue-100", // Changed to blue for In Progress
                    text: "text-blue-700",
                    border: "border-blue-300",
                };
            case "Awaiting Verification":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-700",
                    border: "border-orange-300",
                };
            case "Completed":
                return {
                    bg: "bg-green-100",
                    text: "text-green-700",
                    border: "border-green-300",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                    border: "border-gray-300",
                };
        }
    };

    const getPriorityTag = () => {
        switch (priority) {
            case "High":
                return { bg: "bg-red-50", text: "text-red-600" };
            case "Medium":
                return { bg: "bg-yellow-50", text: "text-yellow-600" };
            case "Low":
                return { bg: "bg-green-50", text: "text-green-600" };
            default:
                return { bg: "bg-gray-50", text: "text-gray-600" };
        }
    };

    const statusTag = getStatusTag();
    const priorityTag = getPriorityTag();

    const isOverdue = status !== "Completed" && moment().isAfter(moment(dueDate), 'day');

    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-gray-200 rounded-xl shadow-md cursor-pointer transition-all p-5 flex flex-col justify-between h-full hover:border-indigo-400"
        >
            <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusTag.bg} ${statusTag.text} ${statusTag.border}`}
                    >
                        {status}
                    </div>

                    <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${priorityTag.bg} ${priorityTag.text}`}
                    >
                        <Flag className="w-3 h-3" /> {priority}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Due:</span>
                        <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                            {moment(dueDate).format("MMM Do")}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        Created: {moment(createdAt).format("MMM Do")}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <Progress progress={progress} status={status} />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <AvatarGroup avatars={assignedTo || []} />

                {actionButton ? (
                    actionButton
                ) : attachmentCount > 0 ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span>{attachmentCount}</span>
                    </div>
                ) : (
                    <div className="text-xs text-gray-500">
                        No attachments
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TaskCard;