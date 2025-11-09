import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🏗️ Site Progress</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/add-report" className="hover:text-blue-500">Add Report</Link>
        <Link to="/reports" className="hover:text-blue-500">Reports</Link>
        <Link to="/login" className="hover:text-blue-500">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
