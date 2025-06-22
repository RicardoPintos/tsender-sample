import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-gray-200 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Title and GitHub */}
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-gray-900">
              TSender
            </h1>
            <a
              href="https://github.com/lokapal-xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FaGithub className="text-xl" />
              <span className="hidden sm:inline text-sm font-medium">GitHub</span>
            </a>
          </div>

          {/* Right side - Connect Button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}