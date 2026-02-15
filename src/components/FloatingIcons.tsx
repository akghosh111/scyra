'use client'

export default function FloatingIcons() {
  const icons = [
    { icon: '📈', delay: 0 },
    { icon: '🔥', delay: 1 },
    { icon: '💬', delay: 2 },
    { icon: '⬆️', delay: 3 },
    { icon: '📊', delay: 4 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <div
          key={index}
          className="absolute text-4xl opacity-10"
          style={{
            right: `${8 + (index * 8)}%`,
            top: `${15 + (index * 16)}%`,
            animation: `float-slow ${4 + index}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}
