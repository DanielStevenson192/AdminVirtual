import { Observable, map } from "rxjs";
import http from "../services/api/api";
import { env } from "../../env";

export class FileService {

    private url = "/quickbpm/jsserver";
    private baseURL = env.REACT_APP_ENDPOINT;
    private fileUrl = "/quickbpm/wsupload";

    public getUrlFile(contextMedia: string, media: string): string {
        let url = "";
        console.log(this.baseURL);
        if(contextMedia && media) {
            url = this.baseURL+"//filedownload?ContextMedia@="+contextMedia+"@@Media@="+media;    
        }
        console.log(url);
        return url;
    }

    public postFile(imagenParaSubir: File) {
        const data = {
            SessionID: 0,
            Zipped: 0,
            PartIndex: 0,
            DataStore: null,
            SerializerType: "json",
            Filename: imagenParaSubir.name,
            Directory: "temp",
            IDAccount: 0,
            Function: "upload",
        };
        console.log(this.fileUrl);
        const formData = new FormData();
        formData.append("FileUpload", imagenParaSubir, JSON.stringify(data));
        console.log(data);
        return http.post(this.fileUrl, formData);
    }
}