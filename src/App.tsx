import { useCallback, useEffect, useState, useRef } from "react";
import present from "@assets/image2.png";
import "./styles.scss";
import "./confetti.css";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Confetti from "./Confetti";

const useConfetti = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const confettiContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!confettiContainerRef.current) {
            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.top = "0";
            container.style.left = "0";
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.pointerEvents = "none";
            container.style.zIndex = "1000";
            document.body.appendChild(container);
            confettiContainerRef.current = container;
        }
        setIsInitialized(true);
    }, []);

    return useCallback(
        (e: MouseEvent) => {
            if (!isInitialized || !confettiContainerRef.current) return;

            for (let i = 0; i < 10; i++) {
                const confetti = document.createElement("div");
                confetti.classList.add("confetti");
                confetti.style.left = `${e.clientX}px`;
                confetti.style.top = `${e.clientY}px`;

                const angle = Math.random() * Math.PI * 2;
                const minDistance = 10;
                const maxDistance = 50;
                const distance = minDistance + Math.random() * (maxDistance - minDistance);
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                confetti.style.setProperty("--x", `${x}px`);
                confetti.style.setProperty("--y", `${y}px`);

                confettiContainerRef.current.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 1000);
            }
        },
        [isInitialized],
    );
};
function App() {
    const [screen, setScreen] = useState(1);
    const createConfetti = useConfetti();

    useEffect(() => {
        document.addEventListener("click", createConfetti);
        return () => {
            document.removeEventListener("click", createConfetti);
        };
    }, [createConfetti]);

    return (
        <div className="container">
            <Confetti />
            {screen === 1 ? <Screen1 setScreen={setScreen} /> : <Screen2 />}
        </div>
    );
}

export default App;
