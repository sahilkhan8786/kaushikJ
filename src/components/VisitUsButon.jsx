import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function VisitUsButon() {
    const visitUsButtonRef = useRef()

    useEffect(() => {
        // GSAP animation for bringing the button from the left (-x)
        gsap.from(visitUsButtonRef.current, {
            x: 300, // starting from outside the viewport
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });
    }, []);



    return (
        <div ref={visitUsButtonRef} className="visitus-button">
            <p></p>
            <a href="https://european-wellness.in/" target="blank">
                <button >Visit Us</button>

            </a>
        </div>
    );
}

export default VisitUsButon;
