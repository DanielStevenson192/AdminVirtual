import React, { useEffect, useState } from "react";
import { FileService } from "../services/FileService";
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ToastAlert } from "../../core/Components/Toast";

interface ILoadDocument {
  show: boolean;
  objData: any;
  setShow: Function;
  setFile: Function;
}

const _files = new FileService();

export const SLoadDocument: React.FC<ILoadDocument> = (
  props: ILoadDocument
) => {

  const chooseOptions = {label: 'Adjuntar', icon: 'pi pi-fw pi-plus', className: 'w-100'};
  const uploadOptions = {label: 'Enviar', icon: 'pi pi-upload', className: 'w-100 mt-2'};
  const cancelOptions = {label: 'Cancelar', icon: 'pi pi-times', className: 'w-100 mt-2'};
  const { Toasty } = ToastAlert();

  useEffect(() => {
    console.log(props.show);
    console.log(props.objData);
  }, [])

  const myUploader = ({files}: any) => {
    console.log(files);
    const [file] = files;
    console.log(file);
    _files.postFile(file).subscribe((resp: any) => {
      console.log(resp);
      if(resp.DataBeanProperties.ObjectValue){
        Toasty({
          type: "success",
          message: `Se ha cargado el archivo correctamente.`,
        });
        props.setFile(resp.DataBeanProperties.ObjectValue.DataBeanProperties);
        props.setShow(false);
      } else {
        props.setShow(false);
        alert("Error al carga el archivo");
      }
    });
  }

  return (
    <>
      <Dialog
        header={"Cargar Documento"}
        visible={props.show}
        onHide={() => props.setShow(false)}
      >
        <div
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: "10px",
          }}
        > 
        <p>{props.objData.Name}</p>
          <FileUpload name="demo" accept=".pdf" chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} customUpload ={true} uploadHandler={myUploader} />
        </div>
      </Dialog>
    </>
  );
};