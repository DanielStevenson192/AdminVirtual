import { FC } from "react";
import { HashLoader, PropagateLoader } from "react-spinners";
import logo from "../../assets/img/home-01.png";
interface ISpinner {
  show: boolean;
}

export const Spinner: FC<ISpinner> = ({ show }) => {
  return (
    <>
      <div
        style={{
          backgroundColor: "black",
          opacity: 0.8,
          zIndex: 800,
          position: "fixed",
          height:'100%',
          width:'100%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "20%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            position:'relative'
          }}
        >
          <img
            src={logo}
            alt=""
            style={{
              height: '100%',
              maxWidth: 250,
            }}
          />
          <PropagateLoader
            loading={show}
            color="#0D48AB"
            size={25}
            speedMultiplier={1}

          />
        </div>
      </div>
    </>
  );
};
