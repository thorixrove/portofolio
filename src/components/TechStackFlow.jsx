import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { techStack } from '../constants/techIcons.js';

const SPEED = 22; // px per detik
const RESUME_DELAY = 1200; // ms setelah sentuhan selesai

const Column = ({ items, direction = 1, zigzag = false, onHover }) => {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(null);
  const looped = [...items, ...items, ...items];

  useEffect(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    // Tinggi satu siklus dihitung dari posisi item (akurat, termasuk gap)
    const period =
      track.children[items.length].offsetTop - track.children[0].offsetTop;

    let pos = period;
    el.scrollTop = pos;

    let last = performance.now();
    let rafId;

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (pausedRef.current) {
        // Ikuti posisi scroll manual user
        pos = el.scrollTop;
      } else {
        // Akumulasi di variabel float agar gerak halus meski scrollTop dibulatkan
        pos += direction * SPEED * dt;
        el.scrollTop = pos;
      }

      // Loop tanpa putus ke dua arah
      if (pos >= period * 2) {
        pos -= period;
        el.scrollTop = pos;
      } else if (pos < period) {
        pos += period;
        el.scrollTop = pos;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resumeTimer.current);
    };
  }, [direction, items.length]);

  const pause = () => {
    clearTimeout(resumeTimer.current);
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
    onHover(null);
  };
  const resumeAfterTouch = () => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(resume, RESUME_DELAY);
  };

  return (
    <div className="tech-flow-col">
      <div
        ref={scrollRef}
        className="tech-flow-scroll"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resumeAfterTouch}
      >
        <div ref={trackRef} className="tech-flow-track">
          {looped.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className="tech-flow-icon"
              style={zigzag ? { marginLeft: i % 2 === 0 ? '0px' : '22px' } : undefined}
              onMouseEnter={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                onHover({ name: tech.name, x: r.left + r.width / 2, y: r.top });
              }}
              onMouseLeave={() => onHover(null)}
            >
              <img src={tech.icon} alt={tech.name} className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TechStackFlow = () => {
  const [tip, setTip] = useState(null);
  const main = techStack.slice(0, 6);
  const side = techStack.slice(6);

  return (
    <div className="tech-flow-wrapper">
      <Column items={main} direction={1} zigzag onHover={setTip} />
      <Column items={side} direction={-1} onHover={setTip} />

      {/* Tooltip dirender ke body supaya tidak terpotong overflow/mask */}
      {tip &&
        createPortal(
          <div className="tech-flow-tooltip" style={{ left: tip.x, top: tip.y - 8 }}>
            {tip.name}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TechStackFlow;