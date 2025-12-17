import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import moment from "moment";

const DashboardHero = ({ currentUser, navigate }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="
        bg-white
        border border-gray-200
        rounded-xl
        p-6
        shadow-lg
      "
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT SIDE */}
                <div>
                    {/* NAME WITH UNDERLINE */}
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 relative inline-block"
                    >
                        Welcome, {currentUser?.name}
                        {/* UNDERLINE */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={inView ? { scaleX: 1 } : {}}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                                delay: 0.2,
                            }}
                            className="
                absolute
                -bottom-1
                left-0
                h-[2px]
                w-full
                origin-left
                bg-indigo-500/40
                rounded-full
              "
                        />
                    </motion.h2>

                    {/* DATE */}
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-gray-500 text-sm mt-1"
                    >
                        {moment().format("dddd, Do MMMM YYYY")}
                    </motion.p>
                </div>

                {/* RIGHT SIDE BUTTON */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    onClick={() => navigate("/admin/create-task")}
                    className="
            bg-indigo-600
            text-white
            font-semibold
            px-5 py-2.5
            rounded-lg
            shadow-md
            hover:bg-indigo-700
            transition
          "
                >
                    + Create Task
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardHero;