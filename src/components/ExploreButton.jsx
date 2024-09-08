import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function ExploreButton({ setIsExploreClicked }) {
    const exploreButtonRef = useRef(null);

    useEffect(() => {
        // GSAP animation for bringing the button from the left (-x)
        gsap.from(exploreButtonRef.current, {
            x: -300, // starting from outside the viewport
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        });
    }, []);

    function exploreClickHandler() {
        setIsExploreClicked(true);
    }

    return (
        <div ref={exploreButtonRef} className="explore-button">
            <p>An illustrated timeline of how EWB has changed the future of healthcare</p>
            <button onClick={exploreClickHandler}>Explore</button>
        </div>
    );
}

export default ExploreButton;
