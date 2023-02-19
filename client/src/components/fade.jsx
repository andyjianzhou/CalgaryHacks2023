import React, { useEffect, useState } from 'react';

export default function Fade({
  animationDuration = 800,
  children,
  className,
  show,
}) {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) {
      setRender(true);
    }
  }, [show]);

  function onAnimationEnd() {
      setRender(false);
  }

  const animationKeyFrame = show ? 'fade-out' : 'fade-in';

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        animation: `${animationKeyFrame} ${animationDuration}ms ease-in-out`,
      }}
      onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  );
}