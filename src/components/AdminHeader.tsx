"use client";

import { useState, useEffect } from 'react';
import { FiUser, FiServer, FiClock, FiCalendar } from 'react-icons/fi';

export default function AdminHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serverStatus, setServerStatus] = useState('online');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome message */}
          <div className="ml-12 lg:ml-0">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-sm lg:text-base text-gray-600 hidden sm:block">Ready to manage your admin panel</p>
          </div>

          {/* Right side - Admin details */}
          <div className="flex items-center space-x-2 lg:space-x-6">
            {/* Server Status - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <FiServer className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Server</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-800 capitalize">{serverStatus}</span>
              </div>
            </div>

            {/* Date and Time */}
            <div className="hidden lg:block bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <FiCalendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono font-semibold text-blue-800">{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Time only for tablet */}
            <div className="lg:hidden md:block hidden bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <FiClock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono font-semibold text-blue-800">{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center space-x-2 lg:space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 px-2 lg:px-4 py-2 rounded-lg border border-purple-200">
              <div className="relative">
                <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 lg:w-5 h-4 lg:h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">Lovosis Technologies</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar - Hidden on mobile */}
        <div className="mt-4 pt-4 border-t border-gray-100 hidden md:block">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">System Status: All services running</span>
              </div>
             
            </div>
            <div className="text-gray-500 hidden lg:block">
              Session started at {new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}