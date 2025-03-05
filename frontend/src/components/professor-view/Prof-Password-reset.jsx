import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function ProfPasswordResetConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-gray-500 text-sm">
            We have sent password recovery instructions to your email.
          </p>
        </div>
        <Button className="w-full   text-white">
          <Link to="/professor/login">Back to login</Link>
        </Button>
      </div>
    </div>
  );
}

export default ProfPasswordResetConfirmation;