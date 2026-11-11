
import { motion } from 'framer-motion';

import desktop from '../assets/desktop.png';
import mobile from '../assets/mobile.png';

const smoothEase = [0.22, 1, 0.36, 1];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.16,
            delayChildren: 0.25
        }
    }
};

const leftVariants = {
    hidden: {
        opacity: 0,
        x: -18
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.9,
            ease: smoothEase
        }
    }
};

const rightVariants = {
    hidden: {
        opacity: 0,
        x: 18
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1.1,
            ease: smoothEase
        }
    }
};

const fadeVariants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.9,
            ease: smoothEase
        }
    }
};

export default function Hero() {
    return (
        <section className="relative min-h-screen w-full grid grid-cols-1 md:grid-cols-[40%_60%] bg-white overflow-hidden font-six">

            {/* LEFT CONTENT */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex flex-col justify-center px-6 md:px-8 lg:px-10 py-28 md:py-0"
            >

                {/* Eyebrow */}
                <motion.div
                    variants={leftVariants}
                    className="flex items-center gap-3 mb-5"
                >
                    <div className="w-10 md:w-14 h-[1.5px] bg-black shrink-0" />

                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-semibold tracking-[0.15em] uppercase whitespace-nowrap">
                        <p>Modest</p>
                        <p>•</p>
                        <p>Stylish</p>
                        <p>•</p>
                        <p>Halaal</p>
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    variants={rightVariants}
                    className="text-5xl md:text-[4.5rem] lg:text-[5rem] font-bold leading-[0.95] tracking-[-0.055em] text-black"
                >
                    Haute N
                    <br />
                    Halaal<sup className="text-sm md:text-base align-top tracking-normal ml-1">™</sup>
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={fadeVariants}
                    className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed max-w-full"
                >
                    Premium modest streetwear
                    for everyday confidence.
                </motion.p>

                {/* CTA */}
                <motion.div
                    variants={fadeVariants}
                    className="mt-5"
                >
                    <a
                        href="/shop"
                        className="group inline-flex items-center gap-4 bg-black text-white rounded-full px-6 py-3.5 text-xs md:text-sm transition-all duration-300 hover:bg-neutral-800 hover:gap-6"
                    >
                        <div>Go to Collection</div>

                        <div className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </div>
                    </a>
                </motion.div>

                {/* DESKTOP SCROLL INDICATOR */}
                <motion.div
                    variants={fadeVariants}
                    className="absolute bottom-8 left-6 md:left-8 lg:left-10 hidden md:flex items-center gap-3"
                >
                    <div className="w-3.5 h-6 rounded-full border border-black flex justify-center pt-1">
                        <div className="w-[2px] h-1.5 rounded-full bg-black" />
                    </div>

                    <div className="w-px h-7 bg-neutral-400" />

                    <p className="text-[10px] text-neutral-500">
                        Scroll to explore
                    </p>
                </motion.div>
            </motion.div>

            {/* MOBILE IMAGE */}
            <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 1.3,
                    delay: 0.2,
                    ease: smoothEase
                }}
                className="relative w-full md:hidden"
            >
                <img
                    src={mobile}
                    alt="Haute N Halaal fashion"
                    className="object-center w-full"
                />
            </motion.div>

            {/* MOBILE SCROLL INDICATOR - BELOW IMAGE */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.9,
                    delay: 0.5,
                    ease: smoothEase
                }}
                className="md:hidden flex items-center justify-center gap-3 py-8"
            >
                <div className="w-3.5 h-6 rounded-full border border-black flex justify-center pt-1">
                    <div className="w-[2px] h-1.5 rounded-full bg-black" />
                </div>

                <p className="text-[10px] text-neutral-500">
                    Scroll to explore
                </p>
            </motion.div>

            {/* DESKTOP IMAGE */}
            <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 1.3,
                    delay: 0.2,
                    ease: smoothEase
                }}
                className="relative w-full hidden md:block"
            >
                <img
                    src={desktop}
                    alt="Haute N Halaal fashion"
                    className="h-screen"
                />
            </motion.div>

        </section>
    );
}
