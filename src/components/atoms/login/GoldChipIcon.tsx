const GoldChipIcon = () => {
  return (
    <div>
      {/* Gold chip icon */}
      <div className="absolute top-6 right-6">
        <div className="w-10 h-8 bg-gradient-to-br from-amber-200 to-amber-400 rounded-md flex items-center justify-center">
          <div className="w-8 h-6 border border-amber-700/30 rounded-sm grid grid-cols-2 gap-0.5">
            <div className="bg-amber-700/20 h-full"></div>
            <div className="bg-amber-700/20 h-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoldChipIcon
