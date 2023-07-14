import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import shoes from '../../assets/frontend/img/sepatu.png';
import jam from '../../assets/frontend/img/jam.png';
import gitar from '../../assets/frontend/img/gitar.png';

// import required modules
import { EffectCube, Pagination, Autoplay } from 'swiper';

function Home() {
    return (
        <div className='container'>
            <br />
            <div className="row d-flex align-items-center">
                <div className="col p-4">
                    <div className='swiperHomeContent mx-auto'>
                        <Swiper
                            effect={'cube'}
                            grabCursor={true}
                            cubeEffect={{
                                shadow: true,
                                slideShadows: true,
                                shadowOffset: 20,
                                shadowScale: 0.94,
                            }}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            pagination={false}
                            modules={[EffectCube, Pagination, Autoplay]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <img src={shoes} />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={jam} />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={gitar} />
                            </SwiperSlide>
                        </Swiper>

                    </div>

                </div>
                <div className="col p-4">
                    <h2 className='mb-3 aboutTitle'>Online Shopping</h2>
                    <p className='aboutDes'>
                        Find the product you need here, with premium quality, good service, and various attractive promos
                    </p>
                    <br />
                    <button className='btn btn-lg px-5 py-2 btnShopNow'>Shop Now</button>
                </div>

            </div>
        </div>
    )
}

export default Home;
