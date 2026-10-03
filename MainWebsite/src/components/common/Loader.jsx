
import React from "react";

const Loader = ({ text = "" }) => {
  const rays = Array.from({ length: 16 });

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
          {rays.map((_, index) => {
            const rotation = index * 22.5;

            return (
              <span
                key={index}
                className="absolute left-1/2 top-1/2 h-8 w-[2px] rounded-full bg-violet-500/70"
                style={{
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-36px)`,
                  transformOrigin: "center",
                }}
              />
            );
          })}
        </div>

        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600 shadow-[0_0_20px_rgba(124,58,237,0.45)]">
          <div className="absolute inset-1.5 rounded-full bg-violet-400 animate-pulse" />
        </div>

        {text && (
          <p className="absolute left-1/2 top-full mt-5 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-violet-700">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
