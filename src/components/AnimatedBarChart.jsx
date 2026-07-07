import { motion } from 'framer-motion';

export default function AnimatedBarChart({
    data,
    title,
    yAxisLabel,
    isLogarithmic = false,
    maxValue
}) {
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

    // Format value for display
    const formatValue = (value) => {
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        if (value < 1 && value > 0) return value.toFixed(1);
        return value.toFixed(0);
    };

    return (
        <div style={{
            width: '100%',
            height: '500px',
            padding: '24px',
            backgroundColor: '#000',
            borderRadius: '12px',
            border: '4px solid rgba(255, 255, 255, 0.5)'
        }}>
            {/* Title */}
            {title && (
                <div style={{
                    marginBottom: '24px',
                    fontSize: '24px',
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
                height: '380px',
                display: 'flex',
                gap: '16px'
            }}>
                {/* Y-axis values */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    paddingRight: '16px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#fff',
                    width: '64px',
                    textAlign: 'right'
                }}>
                    <span>{formatValue(maxValue)}</span>
                    <span>{formatValue(maxValue * 0.75)}</span>
                    <span>{formatValue(maxValue * 0.5)}</span>
                    <span>{formatValue(maxValue * 0.25)}</span>
                    <span>0</span>
                </div>

                {/* Chart Area */}
                <div style={{
                    position: 'relative',
                    flex: '1',
                    height: '100%',
                    borderLeft: '4px solid #fff',
                    borderBottom: '4px solid #fff',
                    backgroundColor: '#000'
                }}>
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
                        padding: '0 24px'
                    }}>
                        {data.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flex: '1',
                                height: '100%',
                                justifyContent: 'flex-end'
                            }}>
                                {/* Bar Value */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    style={{
                                        marginBottom: '12px',
                                        fontSize: '16px',
                                        fontWeight: '900',
                                        color: '#fff',
                                        padding: '8px 12px',
                                        backgroundColor: '#000000',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {formatValue(item.value)}
                                </motion.div>

                                {/* Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${getBarHeight(item.value)}%` }}
                                    transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
                                    style={{
                                        width: '100%',
                                        maxWidth: '70px',
                                        background: 'linear-gradient(to top, #000000, #000000)',
                                        border: '2px solid #fff',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                                        minHeight: '6px'
                                    }}
                                />

                                {/* X-axis Label */}
                                <div style={{
                                    marginTop: '16px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    color: '#fff',
                                    width: '100%',
                                    padding: '0 4px',
                                    lineHeight: '1.2'
                                }} title={item.label}>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
