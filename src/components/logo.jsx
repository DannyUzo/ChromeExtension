import logoimg from "../assets/Layer 2.png";


export const Logo = () => {
    return (
        <div className="logo">
          <img src={logoimg} alt="logo" />
          <h2>Video | Screen Recorder</h2>
        </div>
    );
}