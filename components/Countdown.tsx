import React from 'react'

const Countdown = () => {
    const counter = 15 as React.CSSProperties;
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={counter} aria-live="polite" aria-label={counter.toString()}>15</span>
    </span>
    days
  </div>
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={counter} aria-live="polite" aria-label={counter.toString()}>10</span>
    </span>
    hours
  </div>
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={counter} aria-live="polite" aria-label={counter.toString()}>24</span>
    </span>
    min
  </div>
  <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
    <span className="countdown font-mono text-5xl">
      <span style={counter} aria-live="polite" aria-label={counter.toString()}>59</span>
    </span>
    sec
  </div>
</div>

  )
}

export default Countdown