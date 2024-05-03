import close from "../assets/close-circle.png";


export const Close = () => (
  <div className="set">
    <img src={close} alt="close" onClick={() => window.close()} />
  </div>
);
