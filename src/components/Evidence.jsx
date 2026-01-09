import { motion } from 'framer-motion';

import ScrollDrivenChart from './ScrollDrivenChart';

export default function Evidence() {
    // Water Consumption Data
    const waterData = [
        { label: '~300 ChatGPT queries', value: 1 },
        { label: 'TV', value: 4 },
        { label: 'Hamburger', value: 660 }
    ];

    const waterStorySteps = [
        {
            text: "Let's examine AI's water consumption in context...",
            visibleBars: 0
        },
        {
            text: "300 ChatGPT queries use about 1 gallon of water.",
            visibleBars: 1
        },
        {
            text: "Watching 1 hour of TV uses 4 gallons - 4x more than AI. This means 1 hour of TV uses about 1200 ChatGPT queries.",
            visibleBars: 2
        },
        {
            text: "A single hamburger? 660 gallons. That's 660x more than those AI queries. So one hamburger is around 198,000 ChatGPT queries.",
            visibleBars: 3
        }
    ];

    // Carbon Footprint (Text) Data
    const carbonTextData = [
        { label: 'BLOOM', value: 0.7 },
        { label: 'ChatGPT', value: 1.2 },
        { label: 'Laptop', value: 20 },
        { label: 'Desktop', value: 70 },
        { label: 'Human (From India)', value: 150 },
        { label: 'Human (From US)', value: 1000 }
    ];

    const carbonTextStorySteps = [
        {
            text: "How much carbon does AI text generation create?",
            visibleBars: 0
        },
        {
            text: "BLOOM, an open-source AI, emits just 0.7g CO2e per page.",
            visibleBars: 1
        },
        {
            text: "ChatGPT uses slightly more: 1.2g CO2e.",
            visibleBars: 2
        },
        {
            text: "A laptop left on while a human writes the same page: 20g CO2e.",
            visibleBars: 3
        },
        {
            text: "A desktop computer? 70g CO2e - 58x more than ChatGPT.",
            visibleBars: 4
        },
        {
            text: "A human writer in India: 150g CO2e from electricity grid mix.",
            visibleBars: 5
        },
        {
            text: "In the US? 1000g CO2e - nearly 1kg. That's 833x more than AI.",
            visibleBars: 6
        }
    ];

    // Carbon Footprint (Images) Data
    const carbonImageData = [
        { label: 'Midjourney', value: 1.5 },
        { label: 'DALL-E2', value: 1.8 },
        { label: 'Laptop', value: 100 },
        { label: 'Desktop', value: 300 },
        { label: 'Human (From India)', value: 700 },
        { label: 'Human (From US)', value: 5000 }
    ];

    const carbonImageStorySteps = [
        {
            text: "What about AI-generated images?",
            visibleBars: 0
        },
        {
            text: "Midjourney creates an image with just 1.5g CO2e.",
            visibleBars: 1
        },
        {
            text: "DALL-E2 is similar: 1.8g CO2e.",
            visibleBars: 2
        },
        {
            text: "A laptop running while a human creates the same image: 100g CO2e.",
            visibleBars: 3
        },
        {
            text: "Desktop workstation? 300g CO2e.",
            visibleBars: 4
        },
        {
            text: "Human artist in India (with electricity): 700g CO2e.",
            visibleBars: 5
        },
        {
            text: "In the US? 5000g CO2e - 5kg. That's 2,778x more than AI.",
            visibleBars: 6
        }
    ];

    return (
        <section className="min-h-screen bg-black text-white py-20 px-8">
            {/* Scroll-Driven Chart 1: Water Consumption */}
            <ScrollDrivenChart
                storySteps={waterStorySteps}
                data={waterData}
                title="Water Consumption (Gallons)"
                yAxisLabel="Water (Gallons)"
                maxValue={660}
                isLogarithmic={false}
            />

            {/* Scroll-Driven Chart 2: Carbon Footprint (Text) */}
            <ScrollDrivenChart
                storySteps={carbonTextStorySteps}
                data={carbonTextData}
                title="Carbon Footprint for Writing One Page"
                yAxisLabel="Carbon (grams CO2e)"
                maxValue={1000}
                isLogarithmic={true}
            />

            {/* Scroll-Driven Chart 3: Carbon Footprint (Images) */}
            <ScrollDrivenChart
                storySteps={carbonImageStorySteps}
                data={carbonImageData}
                title="Carbon Footprint for Creating One Image"
                yAxisLabel="Carbon (grams CO2e)"
                maxValue={5000}
                isLogarithmic={true}
            />
        </section>
    );
}
