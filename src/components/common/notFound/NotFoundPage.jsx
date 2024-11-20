
import { Button } from '@mui/material'
import { ArrowLeft, Home } from 'lucide-react'

import { useNavigate } from 'react-router-dom'

export default function Component() {
  const router = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-gray-900 sm:text-8xl">
            4<span className="text-primary">0</span>4
          </h1>
          <p className="text-xl font-medium text-gray-600 sm:text-2xl">Oops! Page not found.</p>
          <p className="text-base text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center space-x-2"
            onClick={() => router(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
          <Button
            className="w-full sm:w-auto flex items-center justify-center space-x-2"
            onClick={() => router('/')}
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Button>
        </div>

        <div className="mt-8">
          <svg
            className="mx-auto h-32 w-32 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}