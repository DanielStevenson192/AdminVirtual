import { map, Observable } from "rxjs";
import { env } from "../../env";
import http from "../services/api/api";
import { AppointmentInfo } from "./model/appoiment-info.interface";
import { Appointment } from "./model/appointment.interface";
import { Pair } from "./model/pair.interface";
import { ServerResponse } from "./model/server-response.interface";

export class AdminService {
  private url: string = "/quickturn/jsserver";
  public baseUrl: string = env.REACT_APP_ENDPOINT || "";

  public login(user: string, password: string): Observable<any> {
    const dataObj = {
      ServiceName: "OrangeBase",
      MethodHash:
        "com.advantage.bean.account.WorkSession_validateWorkSession_String_String_String_String_String_String",
      ArgumentList: ["local", user, password, null, null, null],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getListTicketPending(
    initial: any,
    final: any,
    id: any
  ): Observable<any> {
    const dataObj = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "QuickTurnService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getAppointmentByAccount_java.util.Date_java.util.Date_Number_Number",
      ArgumentList: [initial, final, id, null],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getAttentionOfficeCatalog(): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash: "java.util.List_getAttentionOfficeCatalog_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getAttentionOfficeCatalogByChannelType(type: number): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getAttentionOfficeCatalogByChannelType_Number",
      ArgumentList: [type],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getTree(idOffice: number, idCharacterization: any): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.advantage.shared.Tree_getTreeForAttentionID_Number_Number",
      ArgumentList: [idOffice, idCharacterization],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getAttentionTicket(
    idCustomerType: any,
    idLn: number,
    idAccount: number,
    nit: number,
    idCharacterization: number,
    channelType: number
  ): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.quickturn.bean.AttentionTicket_getAttentionTicket_Number_Number_Number_Number_Number_Number",
      ArgumentList: [
        idCustomerType,
        idLn,
        idAccount,
        nit,
        idCharacterization,
        channelType,
      ],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  public getAttentionTicketAgenda(
    idCustomerType: any,
    idLn: number,
    idAccount: number,
    nit: number,
    idCharacterization: number,
    channelType: number,
    agenda:number
  ): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
      "com.quickturn.bean.AttentionTicket_getAttentionTicket_String_Number_Number_Number_Number_Number_Number_Number",
      ArgumentList: [
        null,
        idCustomerType,
        idLn,
        idAccount,
        nit,
        idCharacterization,
        channelType,
        agenda
      ],
    };
    const data = JSON.stringify(dataObj);
   
    return http.post(this.url, data);
  }

  public validateAccountFromNit(nit: number) {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.advantage.bean.account.AbstractAccount_validateAccountFromNit_Number_Number",
      ArgumentList: [null, nit],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }


  public createOTPCode(nit: number) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "CajaHonor",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "com.advantage.shared.Report_createOTPCode_Number_Number",
      ArgumentList: [null, nit],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public validateOTP(nit: number, codeOTP: number, OTPTransaction: string) {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "CajaHonor",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "com.advantage.shared.Report_validateOTPCode_Number_Number_Number_String",
      ArgumentList: [null, nit, codeOTP, OTPTransaction],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }




  public getCustomerAttentionTicketForDocument(
    idCustomerType: number,
    idLn: number,
    idAccount: number,
    nit: number,
    idCharacterization: number,
    channelType: number
  ): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.quickturn.bean.AttentionTicket_getCustomerAttentionTicketForDocument_Number_Number_Number_Number_Number_Number",
      ArgumentList: [
        idCustomerType,
        idLn,
        idAccount,
        nit,
        idCharacterization,
        channelType,
      ],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getAvailableAppointment(
    anio: any,
    month: any,
    idLn: any
  ): Observable<AppointmentInfo[]> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash: "java.util.List_getAvailableAppointment_Number_Number_Number",
      ArgumentList: [anio, month, idLn],
    };
    const data = JSON.stringify(dataObj);
    return http.post<ServerResponse<AppointmentInfo>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public getAppointments(
    idLn: number,
    date: string
  ): Observable<Appointment[]> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash: "java.util.List_getAppointments_Number_java.util.Date",
      ArgumentList: [idLn, date],
    };
    const data = JSON.stringify(dataObj);
    console.log(dataObj);
    return http.post<ServerResponse<Appointment>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public getAppointmentConstants(): Observable<Pair[]> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash: "java.util.List_getAppointmentConstants_Number",
      ArgumentList: [null],
    };
    const data = JSON.stringify(dataObj);
    return http.post<ServerResponse<Pair>>(this.url, data).pipe(
      map((value: any) => {
        if (value.DataBeanProperties.ObjectValue) {
          return value.DataBeanProperties.ObjectValue.map(
            (value1: any) => value1.DataBeanProperties
          );
        }
        return [];
      })
    );
  }

  public assignAppointment(
    idAttentionTime: number,
    date: any,
    quotaNumber: number,
    idAccount: number,
    idCustomerType: any,
    channelType: number,
    idCharacterization: number
  ): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.quickturn.bean.Appointment_assignAppointment_Number_java.util.Date_Number_Number_Number_Number_Number",
      ArgumentList: [
        idAttentionTime,
        date,
        quotaNumber,
        idAccount,
        idCustomerType,
        channelType,
        idCharacterization,
      ],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public assignAppointmentAgenda(
    idAttentionTime: number,
    date: any,
    quotaNumber: number,
    idAccount: number,
    idCustomerType: any,
    channelType: number,
    idCharacterization: number,
    idAgendaRequest: any
  ): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.quickturn.bean.Appointment_assignAppointment_Number_java.util.Date_Number_Number_Number_Number_Number_Number",
      ArgumentList: [
        idAttentionTime,
        date,
        quotaNumber,
        idAccount,
        idCustomerType,
        channelType,
        idCharacterization,
        idAgendaRequest
      ],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getAttentionIDChilds(idLn: any, office: any): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "java.util.List_getAttentionIDChilds_Number_Number_Number_Number_Boolean",
      ArgumentList: [idLn, null, office, null, true],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  };

  public getAttentionOfficeByAgendaRequest(idAgendaRequest: any): Observable<any> {
    const parametros = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "java.util.List_getAttentionOfficeByAgendaRequest_Number",
      ArgumentList: [idAgendaRequest],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
      map((value: any) => {
        if (value) {
          return value.DataBeanProperties.ObjectValue.map((value: any) => {
            if (value) {
              return value.DataBeanProperties;
            }
          });
        }
      })
    );
  }

  public getAttentionIDChildsForAgendaRequest(idAttentionOffice: any,idAgendaRequest: any): Observable<any> {
    const parametros = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "java.util.List_getAttentionIDChildsForAgendaRequest_Number_Number",
      ArgumentList: [idAttentionOffice, idAgendaRequest],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
      map((value: any) => {
        if (value) {
          return value.DataBeanProperties.ObjectValue.map((value: any) => {
            if (value) {
              return value.DataBeanProperties;
            }
          });
        }
      })
    );
  }

  public getAttentionOffice(idAttentionOffice: number): Observable<any> {
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash:
        "com.quickturn.bean.AttentionOffice_getAttentionOffice_Number",
      ArgumentList: [idAttentionOffice],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getAvailableAgendaRequestCatalog(idAccount: any): Observable<any> {
    const parametros = {
        ServiceName: "BpmService",
        MethodHash:
            "java.util.List_getAvailableAgendaRequestCatalog_Number",
        ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
        map((value: any) => {
            if (value) {
                return value.DataBeanProperties.ObjectValue.map((value: any) => {
                    if (value) {
                        return value.DataBeanProperties;
                    }
                });
            }
        })
    );
}
}
