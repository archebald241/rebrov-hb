import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./styles.module.scss";

const texts = [
    'Уважаемый Никита, мы поздравляем тебя с победой в конкурсе "Лучший педик"',
    "Ой, кажется в текте произошла какая-то ошибка, давай попробуем еще раз",
    "Уважаемый Никита, мы поздравляем тебя с лучшими кудрями в сообществе!",
    "Ой, кажется с текстом снова что-то не так, давай попробуем еще раз",
    "Уважаемый Никита, мы поздравляем тебя с ДНЕМ РОЖДЕНИЯ!",
];

const useErasableEffect = () => {
    const [isErased, setIsErased] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isErasingRef = useRef(false);

    const handleErase = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
            if (!isErasingRef.current && e.type !== "touchmove") return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const rect = canvas.getBoundingClientRect();

            console.log({ rect });
            const x =
                "clientX" in e ? e.clientX - rect.left - 40 : e.touches[0].clientX - rect.left;
            const y = "clientY" in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fill();

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let erasedPixels = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] === 0) erasedPixels++;
            }
            if (erasedPixels / (pixels.length / 4) > 0.7) {
                setIsErased(true);
            }
        },
        [],
    );

    const handleMouseDown = useCallback(() => {
        isErasingRef.current = true;
    }, []);

    const handleMouseUp = useCallback(() => {
        isErasingRef.current = false;
    }, []);

    return { isErased, canvasRef, handleErase, handleMouseDown, handleMouseUp };
};

const Screen2: React.FC = () => {
    const [textNumber, setTextNumber] = useState(0);
    const [showCoupon, setShowCoupon] = useState(false);
    const { isErased, canvasRef, handleErase, handleMouseDown, handleMouseUp } =
        useErasableEffect();

    useEffect(() => {
        if (textNumber === texts.length - 1) {
            setShowCoupon(true);
            return;
        }

        const interval = setInterval(
            () => {
                setTextNumber((prev) => prev + 1);
            },
            textNumber % 2 === 1 ? 2000 : 5000,
        );

        return () => clearInterval(interval);
    }, [textNumber]);

    useEffect(() => {
        if (showCoupon) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.fillStyle = "#888";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [showCoupon]);

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.messageContainer}>
                    <h1 className={styles.title}>
                        {textNumber === 4 ? "И вот же ОН - ваш подарок!" : "Что же это такое?"}
                    </h1>
                    <p className={styles.message}>{texts[textNumber]}</p>
                </div>
                {showCoupon && (
                    <div className={styles.coupon}>
                        <div className={styles.couponHeader}>
                            Вам в порадок достается купон! Но какой?
                        </div>
                        <div className={styles.couponBody}>
                            {isErased ? (
                                <>
                                    <div className={styles.couponTitle}>
                                        Это купон на приобретение любой КЛАВИАТУРЫ!
                                    </div>
                                    <div className={styles.couponSubtitle}>
                                        ДА! ДА! Именно клавиатуры!
                                    </div>
                                    <div className={styles.couponTerms}>
                                        <h3>Условия использования:</h3>
                                        <ol>
                                            <li>Купон доступен на сумму до 6000 рублей!</li>
                                            <li>
                                                Купон действителен только при присутствии милорда во
                                                время покупке!
                                            </li>
                                            <li>Клавиатуру ОБЯЗАТЕЛЬНО нужно будет обмыть!</li>
                                            <li>
                                                Для того, чтобы купон был действителен, нужно будет
                                                написать в телеграм{" "}
                                                <span className={styles.couponLink}>@kapelo0</span>{" "}
                                                кодовое слово
                                                <span className={styles.codeWord}>"nikitagey"</span>
                                            </li>
                                        </ol>
                                    </div>
                                </>
                            ) : (
                                <canvas
                                    ref={canvasRef}
                                    className={styles.erasableCanvas}
                                    width={400}
                                    height={300}
                                    onMouseMove={handleErase}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchMove={handleErase}
                                    onTouchStart={handleMouseDown}
                                    onTouchEnd={handleMouseUp}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Screen2;
