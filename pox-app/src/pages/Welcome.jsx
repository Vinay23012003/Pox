import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white p-6">
      <div className="max-w-md bg-white text-gray-900 rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">
          Welcome to <span className="text-blue-500">Pox</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus accusamus dicta atque tenetur fugiat dolores, 
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105">
              Create Account
            </button>
          </Link>
          <Link to="/login">
            <button className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105">
              Already Registered? Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
