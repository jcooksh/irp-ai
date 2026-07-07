import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Bars and ticks use this fraction of the plot height, leaving headroom
// above the tallest bar for its value label.
const PLOT_SCALE = 0.88;

// One fading story sentence; fades in as its step starts and out as it ends
function StoryText({ step, index, total, scrollYProgress, isSmallScreen }) {
    const opacity = useTransform(
        scrollYProgress,
        [
            index / total,
            (index + 0.3) / total,
            (index + 0.7) / total,
            (index + 1) / total
        ],
        [0, 1, 1, 0]
    );

    return (
        <Motion.div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                fontSize: isSmallScreen ? '20px' : '30px',
                fontWeight: '700',
                lineHeight: '1.45',
                letterSpacing: '-0.01em',
                textAlign: isSmallScreen ? 'center' : 'left',
                opacity
            }}
        >
            {step.text}
        </Motion.div>
    );
}

// One bar column; fades in when its story step is reached and stays visible
function ChartBar({ item, index, storySteps, scrollYProgress, isSmallScreen, rotateLabels, barHeight, formattedValue }) {
    const appearStep = storySteps.findIndex(step => step.visibleBars > index);
    const total = storySteps.length;
    const opacity = useTransform(
        scrollYProgress,
        appearStep === -1
            ? [0, 1]
            : [0, appearStep / total, (appearStep + 0.3) / total, 1],
        appearStep === -1
            ? [0, 0]
            : [0, 0, 1, 1] // Stay invisible until the step starts, fade to 1, then stay 1
    );

    return (
        <Motion.div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '1',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
                opacity
            }}
        >
            {/* Bar Value */}
            <div style={{
                marginBottom: '8px',
                fontSize: isSmallScreen ? '14px' : '16px',
                fontWeight: '900',
                color: '#fff',
                whiteSpace: 'nowrap'
            }}>
                {formattedValue}
            </div>

            {/* Bar */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '70px',
                    height: `${barHeight}%`,
                    background: '#fff',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 10px 20px rgba(255, 255, 255, 0.25)',
                    minHeight: '3px'
                }}
            />

            {/* X-axis Label - positioned below the axis; rotated when the
                chart is too dense for horizontal labels on small screens */}
            <div style={{
                position: 'absolute',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.25',
                ...(rotateLabels ? {
                    top: 'calc(100% + 10px)',
                    right: '50%',
                    transform: 'rotate(-32deg)',
                    transformOrigin: 'top right',
                    whiteSpace: 'nowrap',
                    fontSize: '11px',
                    textAlign: 'right'
                } : {
                    top: 'calc(100% + 14px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: isSmallScreen ? '12px' : '13px',
                    textAlign: 'center',
                    width: isSmallScreen ? 'calc(100% + 10px)' : 'calc(100% + 16px)'
                })
            }} title={item.label}>
                {item.label}
            </div>
        </Motion.div>
    );
}

export default function ScrollDrivenChart({
    storySteps,
    data,
    title,
    yAxisLabel,
    isLogarithmic = false,
    maxValue
}) {
    const containerRef = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Track window size for responsive layout
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 900);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Track scroll progress through this container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Calculate height percentage for each bar
    const getBarHeight = (value) => {
        if (value === 0) return 0;
        if (isLogarithmic) {
            const logValue = Math.log10(value + 1);
            const logMax = Math.log10(maxValue + 1);
            return (logValue / logMax) * 100;
        }
        return (value / maxValue) * 100;
    };

    // Format value for display, keeping one decimal for small non-integers
    const formatValue = (value) => {
        if (value >= 1000) {
            const k = value / 1000;
            return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
        }
        if (value < 10 && value % 1 !== 0) return value.toFixed(1);
        return value.toFixed(0);
    };

    // Axis ticks positioned on the same scale as the bars, so gridlines
    // and bar heights always agree (powers of ten for log charts).
    const getTicks = () => {
        if (!isLogarithmic) {
            return [0, 0.25, 0.5, 0.75, 1].map(f => ({
                value: maxValue * f,
                position: f * 100
            }));
        }
        const ticks = [{ value: 0, position: 0 }];
        for (let p = 1; p < maxValue; p *= 10) {
            ticks.push({ value: p, position: getBarHeight(p) });
        }
        ticks.push({ value: maxValue, position: 100 });
        return ticks;
    };

    const ticks = getTicks();

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                height: `${storySteps.length * 100}vh`, // Creates scroll distance
            }}
        >
            {/* Sticky container that stays in view while scrolling */}
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                padding: '0 20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '1400px',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    gap: isSmallScreen ? '32px' : '80px',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Left: Dynamic Text */}
                    <div
                        style={{
                            color: '#fff',
                            flex: isSmallScreen ? 'none' : '1',
                            width: isSmallScreen ? '100%' : 'auto',
                            position: 'relative',
                            minHeight: isSmallScreen ? '150px' : '240px'
                        }}
                    >
                        {storySteps.map((step, index) => (
                            <StoryText
                                key={index}
                                step={step}
                                index={index}
                                total={storySteps.length}
                                scrollYProgress={scrollYProgress}
                                isSmallScreen={isSmallScreen}
                            />
                        ))}
                    </div>

                    {/* Right: Chart with incremental bars */}
                    <div style={{
                        width: isSmallScreen ? '100%' : '50%',
                        maxWidth: isSmallScreen ? '540px' : 'none',
                        padding: '24px 24px 0',
                        backgroundColor: '#000',
                        borderRadius: '12px'
                    }}>
                        {/* Title */}
                        {title && (
                            <div style={{
                                marginBottom: '28px',
                                fontSize: isSmallScreen ? '19px' : '24px',
                                fontWeight: '900',
                                color: '#fff',
                                textAlign: 'center'
                            }}>
                                {title}
                            </div>
                        )}

                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: isSmallScreen ? '320px' : '380px',
                            display: 'flex',
                            alignItems: 'stretch'
                        }}>
                            {/* Y-axis title */}
                            {yAxisLabel && !isSmallScreen && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginRight: '8px'
                                }}>
                                    <span style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.45)',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {yAxisLabel}
                                    </span>
                                </div>
                            )}

                            {/* Y-axis tick values */}
                            <div style={{
                                position: 'relative',
                                width: isSmallScreen ? '44px' : '56px',
                                height: '100%',
                                flexShrink: 0
                            }}>
                                {ticks.map((tick, i) => (
                                    <span key={i} style={{
                                        position: 'absolute',
                                        right: '12px',
                                        bottom: `${tick.position * PLOT_SCALE}%`,
                                        transform: 'translateY(50%)',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: 'rgba(255,255,255,0.8)'
                                    }}>
                                        {formatValue(tick.value)}
                                    </span>
                                ))}
                            </div>

                            {/* Chart Area */}
                            <div style={{
                                position: 'relative',
                                flex: '1',
                                height: '100%',
                                borderLeft: '3px solid #fff',
                                borderBottom: '3px solid #fff',
                                backgroundColor: '#000'
                            }}>
                                {/* Gridlines aligned with the ticks */}
                                {ticks.filter(tick => tick.position > 0).map((tick, i) => (
                                    <div key={i} style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: `${tick.position * PLOT_SCALE}%`,
                                        height: '1px',
                                        backgroundColor: 'rgba(255,255,255,0.12)'
                                    }} />
                                ))}

                                {/* Bars Container */}
                                <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    top: 0,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-around',
                                    gap: isSmallScreen ? '12px' : '20px',
                                    padding: '0 16px'
                                }}>
                                    {data.map((item, index) => (
                                        <ChartBar
                                            key={index}
                                            item={item}
                                            index={index}
                                            storySteps={storySteps}
                                            scrollYProgress={scrollYProgress}
                                            isSmallScreen={isSmallScreen}
                                            rotateLabels={isSmallScreen && data.length > 4}
                                            barHeight={getBarHeight(item.value) * PLOT_SCALE}
                                            formattedValue={formatValue(item.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reserved space for the x-axis labels below the chart */}
                        <div style={{ height: isSmallScreen && data.length > 4 ? '96px' : '72px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
