'use client'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex w-full flex-col items-center min-h-screen bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 p-8">
      <h1 className="text-5xl font-bold text-white text-center mb-8">
        <span className="text-blue-900">NextJS</span> Video Call <span className="text-cyan-300">Group</span>
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Join a Channel</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          const target = e.target as typeof e.target & {
            channel: { value: string }
          };
          router.push(`/channel/${target.channel.value}`)
        }}>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2" htmlFor="channel">
              Channel Name
            </label>
            <input
              className="w-full text-black p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="channel"
              type="text"
              name="channel"
              placeholder="Enter a unique channel name"
              required
            />
          </div>
          <div className="text-center">
            <button
              className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
            >
              Join Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
