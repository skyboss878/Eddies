// src/components/UserDropdown.jsx
import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts";

export default function UserDropdown() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none">
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline truncate max-w-20 lg:max-w-none">
          {user.username}
        </span>
        <ChevronDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 sm:hidden">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {user.username}
              </p>
              {user.email && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              )}
            </div>

            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/settings"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                  Settings
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 flex-shrink-0" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
