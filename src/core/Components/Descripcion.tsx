import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { FC, useState } from "react";

interface Props {
  show: any;
  setShow: any;
  handleFunction: any;
  title: string;
  info?: any;
}
export const Descripcion: FC<Props> = ({
  show,
  setShow,
  handleFunction,
  title,
  info,
}) => {
  const [value, setValue] = useState<any>("");
  const renderFooter = () => {
    return (
      <div>
        <Button
          label="NO"
          style={{ color: "white" }}
          icon="pi pi-times"
          onClick={() => {
            setShow(false);
            setValue('')
          }}
          className="p-button-text"
        />
        <Button
          label="SI"
          icon="pi pi-check"
          onClick={() => {
            handleFunction(info, value);
            setShow(false);
            setValue("");
          }}
        />
      </div>
    );
  };
  return (
    <>
      <Dialog
        header={title}
        visible={show}
        footer={renderFooter}
        onHide={() => setShow(false)}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <InputTextarea
            value={value}
            onChange={(e: any) => {
              setValue(e.target.value);
            }}
            rows={10}
            cols={50}
            autoResize
          />
        </div>
      </Dialog>
    </>
  );
};
