import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import about from '../../assets/frontend/img/about.json';


function About() {
    return (
        <div className='container'>
            <br />
            <div className="row d-flex align-items-center">
                <div className="p-3 col-lg-6">
                    <Player
                        src={about}
                        className="AboutContent"
                        loop
                        autoplay />
                </div>
                <div className="p-3 px-4 col-lg-6">
                    <div className='aboutContainer m-auto'>
                        <h2 className='mb-3 aboutTitle'>About Us</h2>
                        <p className='aboutDes'>
                            G-Commerce is an example of an e-commerce platform designed by G37 Dev.
                        </p>
                        <br />
                        <p className='aboutDes'>
                            We can assist companies in building and developing an e-commerce platform that is tailored to their needs, including an admin system for data collection and control.
                        </p>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default About;
