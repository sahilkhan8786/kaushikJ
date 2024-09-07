function ExploreButton({ setIsExploreClicked }) {
    function exploreClickHandler() {
        setIsExploreClicked(true)
    }

    return (
        <div className="explore-button">
            <p>An illustrated timeline of how EWB has changed the future of healthcare</p>
            <button onClick={exploreClickHandler}>
                Explore
            </button>
        </div>
    )
}

export default ExploreButton
