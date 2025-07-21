import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";

const Header = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();

  return (
    <div className="border-b bg-white px-6 py-4 flex justify-between items-center">
      {/* Kiri - Logo dan Title */}
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback className="bg-blue-500 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-semibold">DeepSeek Model Test</h1>
          <p className="text-sm text-gray-500">Always here to help</p>
        </div>
      </div>

      {/* Kanan - Auth */}
      <div>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button
            onClick={openSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
