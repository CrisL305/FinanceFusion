import Btn from "../../components/Btn/Btn";
import Phone from "../../assets/images/SVG/Phone.svg";
import videoTabDesk from "../../assets/videos/Financial_Management_Made_Easy.mp4";
import "./HomePage.scss";
import video from "../../assets/videos/Financial_Management_Made_Easy_Mobile.mp4";
import { useEffect, useState } from "react";

const HomePage = () => {

    const [videoSource, setVideoSource] = useState("");

    //Detects the screen size and changes the video source
    const updateVideoSource = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 768) {
            setVideoSource(videoTabDesk);
        } else {
            setVideoSource(video);
        }
    };

    useEffect(() => {
        updateVideoSource();
        window.addEventListener("resize", updateVideoSource);
        return () => window.removeEventListener("resize", updateVideoSource);
    }, []);

    return ( 
        <>
        <section className="textDefault pagePadding">
            <h1 className="textDefault__title font--title">Welcome to Finance Fusion</h1>
            <p className="textDefault__paragraph font--normal home__paragraph">A financial app that brings all your transactions from different banks together to then create a personal ledger and for you to correctly budget for your goals.</p>
            <img className="home__image" src={Phone} alt="phone svg" />
            <div className="home__login--holder font--normal"><Btn className="home__login" content="Enter Here!" login={true} logout={false}/></div>
            <div className="video-container">
                <video width="100%" height="500px" autoPlay controls loop muted playsInline preload="auto">
                    <source src={video} type="video/mp4"/>
                </video>
            </div>
        </section>
        </>
     );
}
 
export default HomePage;