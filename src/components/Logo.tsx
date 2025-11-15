export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Stylized House/Apartment */}
      <div className="relative">
        {/* Colorful building blocks */}
        <div className="flex gap-0.5">
          {/* Left tower */}
          <div className="flex flex-col gap-0.5">
            <div className="w-3 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-t-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-purple-600"></div>
          </div>
          {/* Main building */}
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-t-md relative">
              {/* Door */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-yellow-300 rounded-t-sm"></div>
            </div>
            <div className="w-4 h-2 bg-gradient-to-br from-pink-500 to-rose-500"></div>
          </div>
          {/* Right tower */}
          <div className="flex flex-col gap-0.5">
            <div className="w-3 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-t-sm"></div>
            <div className="w-3 h-2 bg-gradient-to-br from-cyan-500 to-blue-600"></div>
          </div>
        </div>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md"></div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
          Codakraft
        </span>
        <span className="text-[10px] font-semibold text-gray-600 tracking-wider uppercase -mt-0.5">
          Apartment
        </span>
      </div>
    </div>
  );
}
