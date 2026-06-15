import React, { useCallback } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function PremiumParticles() {
  const init = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 z-[0] pointer-events-none">
      <ParticlesProvider init={init}>
        <Particles
          id="tsparticles"
          className="h-full w-full"
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            interactivity: {
              detectsOn: "window",
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 120,
                  duration: 0.8,
                  factor: 2,
                  speed: 1,
                },
              },
            },
            particles: {
              color: {
                value: ["#2dd4bf", "#3b82f6", "#818cf8"],
              },
              links: {
                color: "random",
                distance: 150,
                enable: true,
                opacity: 0.15,
                width: 1,
                triangles: {
                  enable: true,
                  opacity: 0.03
                }
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 0.6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  width: 1920,
                  height: 1080
                },
                value: 60,
              },
              opacity: {
                value: { min: 0.1, max: 0.4 },
                animation: {
                  enable: true,
                  speed: 0.5,
                  sync: false,
                }
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 4 },
                animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
                }
              },
            },
            detectRetina: true,
          }}
        />
      </ParticlesProvider>
      {/* Ambient background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
    </div>
  );
}
