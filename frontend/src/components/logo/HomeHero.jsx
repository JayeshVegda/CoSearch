import React from 'react';
import { Box, Group, Title, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconSearch, IconSparkles } from '@tabler/icons-react';

export default function HomeHero() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Safe color access helper
  const getColor = (colorName, index, fallback) => {
    try {
      return theme.colors[colorName]?.[index] || fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <Box
      style={{
        padding: `${theme.spacing.xl * 2}px ${theme.spacing.lg}px`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Particles */}
      <Box
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          animation: 'float1 6s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={12}
          style={{
            color: isDark ? getColor('blue', 4, '#74b9ff') : getColor('blue', 5, '#0984e3'),
            opacity: 0.6,
          }}
        />
      </Box>
      
      <Box
        style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          animation: 'float2 8s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={8}
          style={{
            color: isDark ? getColor('indigo', 4, '#a29bfe') : getColor('indigo', 5, '#6c5ce7'),
            opacity: 0.4,
          }}
        />
      </Box>
      
      <Box
        style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          animation: 'float3 7s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={10}
          style={{
            color: isDark ? getColor('purple', 4, '#fd79a8') : getColor('purple', 5, '#e84393'),
            opacity: 0.5,
          }}
        />
      </Box>
      
      <Box
        style={{
          position: 'absolute',
          top: '70%',
          left: '25%',
          animation: 'float4 9s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={6}
          style={{
            color: isDark ? getColor('blue', 3, '#74b9ff') : getColor('blue', 6, '#0984e3'),
            opacity: 0.3,
          }}
        />
      </Box>

      {/* Additional Particles */}
      <Box
        style={{
          position: 'absolute',
          top: '15%',
          right: '30%',
          animation: 'float5 5s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={14}
          style={{
            color: isDark ? getColor('cyan', 4, '#00cec9') : getColor('cyan', 5, '#00b894'),
            opacity: 0.7,
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          top: '80%',
          right: '35%',
          animation: 'float6 10s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={7}
          style={{
            color: isDark ? getColor('pink', 4, '#fd79a8') : getColor('pink', 5, '#e84393'),
            opacity: 0.4,
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          top: '45%',
          left: '5%',
          animation: 'float7 6.5s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={9}
          style={{
            color: isDark ? getColor('violet', 4, '#a29bfe') : getColor('violet', 5, '#6c5ce7'),
            opacity: 0.5,
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          top: '25%',
          left: '40%',
          animation: 'float8 7.5s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={11}
          style={{
            color: isDark ? getColor('teal', 4, '#00cec9') : getColor('teal', 5, '#00b894'),
            opacity: 0.6,
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          top: '55%',
          right: '5%',
          animation: 'float9 8.5s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={5}
          style={{
            color: isDark ? getColor('orange', 4, '#fdcb6e') : getColor('orange', 5, '#e17055'),
            opacity: 0.3,
          }}
        />
      </Box>

      <Box
        style={{
          position: 'absolute',
          top: '85%',
          left: '10%',
          animation: 'float10 9.5s ease-in-out infinite',
        }}
      >
        <IconSparkles
          size={13}
          style={{
            color: isDark ? getColor('lime', 4, '#00b894') : getColor('lime', 5, '#00cec9'),
            opacity: 0.4,
          }}
        />
      </Box>

      <Group
        spacing={48}
        gap={32}
        align="center"
        position="center"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Minimal Logo Container */}
        <Box
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Clean outer ring */}
          <Box
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getColor('blue', 6, '#0984e3')} 0%, ${getColor('indigo', 6, '#6c5ce7')} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isDark 
                ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                : '0 8px 24px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Inner circle */}
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
              }}
            >
              <IconSearch
                size={28}
                style={{
                  color: getColor('blue', 6, '#0984e3'),
                  strokeWidth: 2,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Minimal Title */}
        <Box style={{ position: 'relative' }}>
          <Title
            order={1}
            style={{
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: isDark ? theme.colors.gray[0] : theme.colors.gray[9],
              textAlign: 'center',
              margin: 0,
              userSelect: 'none',
              position: 'relative',
            }}
          >
            CoSearch
          </Title>
        </Box>
      </Group>

      {/* CSS Animations for particles */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-90deg); }
        }

        @keyframes float5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(120deg); }
        }

        @keyframes float6 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-120deg); }
        }

        @keyframes float7 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-19px) rotate(60deg); }
        }

        @keyframes float8 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(-60deg); }
        }

        @keyframes float9 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(150deg); }
        }

        @keyframes float10 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-21px) rotate(-150deg); }
        }
      `}</style>
    </Box>
  );
}
