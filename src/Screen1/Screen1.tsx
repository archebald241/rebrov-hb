import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./styles.module.scss";
import present from "@assets/image2.png";

interface IProps {
    setScreen: (screen: number) => void;
}

const useShake = () => {
    const [isShaking, setIsShaking] = useState(false);
    const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const triggerShake = useCallback(() => {
        if (shakeTimeoutRef.current) {
            clearTimeout(shakeTimeoutRef.current);

            if (isShaking) {
                setIsShaking(false);
            }
        }

        setTimeout(() => {
            setIsShaking(true);
        });

        shakeTimeoutRef.current = setTimeout(() => setIsShaking(false), 200);
    }, [isShaking]);

    useEffect(() => {
        return () => {
            if (shakeTimeoutRef.current) {
                clearTimeout(shakeTimeoutRef.current);
            }
        };
    }, []);

    return { isShaking, triggerShake };
};

const useClickCounter = (maxCount: number) => {
    const [clickCount, setClickCount] = useState(0);
    const [showText, setShowText] = useState(false);
    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const incrementClickCount = useCallback(() => {
        if (clickCount < maxCount) {
            setClickCount((prev) => prev + 1);
        }
    }, [clickCount, maxCount]);

    const resetClickCount = useCallback(() => {
        if (clickCount) {
            setShowText(true);
            setTimeout(() => {
                setShowText(false);
            }, 200);
        }

        setClickCount(0);
    }, [clickCount]);

    useEffect(() => {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
        }

        resetTimeoutRef.current = setTimeout(resetClickCount, 500);

        return () => {
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }
        };
    }, [clickCount, resetClickCount]);

    return { clickCount, showText, incrementClickCount };
};

const texts = [
    "НЕ ОТКРЫЛ, ЛОХ!",
    "ПОПРОБУЙ ЕЩЕ РАЗ",
    "В СЛЕДУЮЩИЙ РАЗ ПОЛУЧИТСЯ",
    "ПОПРОБУЙ ЕЩЕ РАЗ",
    "НУ ПОЧТИ СМОГ",
    "ПРОМАЗАЛ?",
    "ПОТЫКАЙ ЕЩЕ",
    "НУ ПОЧТИ",
];

const Screen1: React.FC<IProps> = ({ setScreen }) => {
    const { isShaking, triggerShake } = useShake();
    const { clickCount, showText, incrementClickCount } = useClickCounter(30);
    const [isExploding, setIsExploding] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        triggerShake();
        incrementClickCount();
    };

    useEffect(() => {
        if (clickCount >= 30 && !isExploding) {
            setIsExploding(true);
            setTimeout(() => {
                setScreen(2);
            }, 500);
        }
    }, [clickCount, setScreen, isExploding]);

    return (
        <div className={`${styles.root}${isExploding ? ` ${styles.explode}` : ""}`}>
            <div className={styles.text}>
                <h1>Вам подарок</h1>
            </div>
            <div className={styles.text}>
                {showText ? <span>{texts[Math.floor(Math.random() * texts.length)]}</span> : null}
            </div>
            <div className={`${styles.image_container}${isShaking ? ` ${styles.shake}` : ""}`}>
                <img src={present} alt="image" onClick={handleClick} />
            </div>
        </div>
    );
};

export default Screen1;
