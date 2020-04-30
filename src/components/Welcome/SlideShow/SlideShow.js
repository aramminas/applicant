import React, {useState, useEffect} from 'react'
import './SlideShow.scss'
import InfiniteCarousel from 'react-leaf-carousel'
import slideShow from '../../../constants'

const icons = slideShow.slideShowIcons


const SlideShow = () => {
    const [removeSlide, setRemoveSlide] = useState(false)
    const [cancelAll, setCancelAll] = useState(false)
    // canceling all slider events
    useEffect(() => {
        return () => {
            setCancelAll(() => true)
            setRemoveSlide(() => true)
        }
    }, [cancelAll])

    const img_icons = icons.map((icon, index) =>
        <div key={index}>
            <img src={`/images/slideShow/${icon.url}`} alt="" key={index}/>
        </div>
    )

    return (
        <>
            {!removeSlide ?
                <div className="tech-slideshow">
                    <InfiniteCarousel
                        breakpoints={[
                            {
                                breakpoint: 500,
                            },
                            {
                                breakpoint: 768,
                            },
                        ]}
                        arrows={false}
                        sidesOpacity={!cancelAll ? 1: 0}
                        sideSize={!cancelAll ? 1: 0}
                        slidesToScroll={!cancelAll ? 1: 0}
                        slidesToShow={!cancelAll ? 7: 0}
                        lazyLoad={!cancelAll}
                        animationDuration={!cancelAll ? 1000: 0}
                        cycleInterval={!cancelAll ? 1500: 0}
                        autoCycle={!cancelAll}
                    >
                        {
                            img_icons
                        }
                    </InfiniteCarousel>
                </div>
                : null}
        </>
    )
}

export default SlideShow