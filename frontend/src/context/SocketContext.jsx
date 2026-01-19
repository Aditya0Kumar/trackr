import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		if (currentUser) {
            // Should come from env in production
			const socketInstance = io("http://localhost:3000", {
				query: {
					userId: currentUser._id,
				},
			});

			setSocket(socketInstance);

			return () => {
				socketInstance.close();
				setSocket(null);
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [currentUser]);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};
