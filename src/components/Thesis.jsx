import { motion } from 'framer-motion';

export default function Thesis() {
    return (
        <section className="section-container bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center text-white">The Thesis</h2>
                    <p className="text-xl md:text-3xl leading-relaxed text-gray-300 text-center font-light">
                        "While public discourse often focuses on job loss and loss of control, this project presents evidence that <span className="text-white font-normal">AI's benefits</span>—particularly in sustainability and health—<span className="text-white font-normal">vastly outweigh current fears</span>."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
