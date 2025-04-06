export const ColorSwatch = ({ color, label }: { color: string; label?: string }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-16 h-16 rounded-xl border cursor-pointer hover:opacity-80 relative group"
      style={{ backgroundColor: color }}
      onClick={() => {
        navigator.clipboard.writeText(color);
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={color === '#fff' || (color.startsWith('#') && parseInt(color.slice(1), 16) > 0xcccccc) ? 'black' : 'currentColor'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white drop-shadow-md"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </div>
    </div>
    {label && <span className="mt-2 text-sm">{label}</span>}
    <span className="text-xs text-white">{color}</span>
  </div>
);
