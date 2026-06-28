import React from "react";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#0f172a]">
      {/* Decorative Background Elements from design template */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-float-1" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-float-2" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-float-3" />

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />
    </div>
  );
}
