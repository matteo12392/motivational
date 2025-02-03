"use client"

import { Lightbulb, Users } from "lucide-react"
import type { Variants } from "motion/react"
import * as motion from "motion/react-client"
import { useRouter } from "next/navigation"
import React from "react"
import { useEffect, useRef, useState } from "react"

export default function Variants() {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { height } = useDimensions(containerRef)

    return (
        <div className="absolute top-0 z-50 h-full">
            <div style={container}>
                <motion.nav
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    custom={height}
                    ref={containerRef}
                    style={nav}
                >
                    <motion.div
                        variants={sidebarVariants}
                        className="absolute top-0 left-0 bottom-0 w-[300px] transition-colors duration-300 rounded-xl"
                        style={{
                            backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                            backdropFilter: isOpen ? 'blur(8px)' : 'none',
                            boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                            borderRadius: '0.75rem',
                            border: isOpen ? '2px solid rgba(255, 255, 255, 0.2)' : 'none'
                        }}
                    />
                    <Navigation />
                    <MenuToggle toggle={() => setIsOpen(!isOpen)} />
                </motion.nav>
            </div>
        </div>
    )
}

const navVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
}

const Navigation = () => (
    <motion.ul style={list} variants={navVariants}>
        {[0, 1].map((i) => (
            <MenuItem i={i} key={i} />
        ))}
    </motion.ul>
)

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
}

const colors = ["#7700FFe6", "#4400FFe6"]
const text = ["SCRVI LA TUA!", "CHI SIAMO"]
// eslint-disable-next-line react/jsx-key
const icons = [<Lightbulb />, <Users />]

const MenuItem = ({ i }: { i: number }) => {
    const router = useRouter();
    const border = `2px solid ${colors[i]}`
    const color = `${colors[i]}`
    const icon = React.cloneElement(icons[i], { style: { ...iconPlaceholder, color } });
    
    const handleClick = () => {
        if (i === 1) { // "CHI SIAMO" button
            router.push('/about');
        } else if (i === 0) { // "ESPRIMI LA TUA!" button
            router.push('/submit');
        }
    };

    return (
        <motion.li
            style={listItem}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
        >
            {icon}
            <div style={{ ...textPlaceholder, border, color }} >{text[i]}</div>
        </motion.li>
    )
}

const sidebarVariants = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        }
    }),
    closed: {
        clipPath: "circle(30px at 40px 40px)",
        transition: {
            delay: 0.2,
            type: "spring",
            stiffness: 400,
            damping: 40,
        }
    }
}

interface PathProps {
    d?: string
    variants: Variants
    transition?: { duration: number }
}

const Path = (props: PathProps) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 80%)"
        strokeLinecap="round"
        {...props}
    />
)

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
    <button style={toggleContainer} onClick={toggle} className="bg-white/20 h-[50px] w-[50px] flex items-center justify-center border-2 p-2 z-60 border-white/20 hover:scale-110 transition-all">
        <svg width="23" height="23" viewBox="0 0 23 23">
            <Path
                variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                }}
            />
        </svg>
    </button>
)

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
    position: "fixed", // Changed from "relative"
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "var(--accent)",
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 100, // Added to ensure it stays on top
}

const nav: React.CSSProperties = {
    width: 300,
}

const toggleContainer: React.CSSProperties = {
    outline: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    cursor: "pointer",
    position: "absolute",
    top: 15,
    left: 15,
    borderRadius: "50%",
}

const list: React.CSSProperties = {
    listStyle: "none",
    padding: 25,
    margin: 0,
    position: "absolute",
    top: 80,
    width: 230,
}

const listItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    margin: "10px 0",
    listStyle: "none",
    marginBottom: 20,
    cursor: "pointer",
    width: "250px"
}

const iconPlaceholder: React.CSSProperties = {
    width: 40,
    height: 40,
    flex: "40px 0",
    marginRight: 20,
}

const textPlaceholder: React.CSSProperties = {
    borderRadius: 5,
    padding: "5px 10px",
    fontWeight: 700,
    width: 200,
    flex: 1,
}

/**
 * ==============   Utils   ================
 */

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
    const dimensions = useRef({ width: 0, height: 0 })

    useEffect(() => {
        if (ref.current) {
            dimensions.current.width = ref.current.offsetWidth
            dimensions.current.height = ref.current.offsetHeight
        }
    }, [ref])

    return dimensions.current
}