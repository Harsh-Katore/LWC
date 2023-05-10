import { LightningElement, api, track, wire } from "lwc";
import fetchAllRecordsOfSelectedObject from "@salesforce/apex/RecordFetchHelper.fetchAllRecordsOfSelectedObject";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { deleteRecord } from "lightning/uiRecordApi";
export default class SobjectRecordList extends NavigationMixin(LightningElement) {
  @track allRecordsOfSelectedObject = [];
  @api objectNameGrand = "";
  @api arrayToSendGrand = [];
  @track columnsMap = [];
  @track RecordsMap = [];
  @track count=0;

  @track actions = [
    { label: "View", name: "view" },
    { label: "Edit", name: "edit" },
    { label: "Delete", name: "delete" }
  ];

  @ api recordsListCol() {
    const selectedFields = this.arrayToSendGrand;
    if(selectedFields.length>0){
      this.columnsMap = [
        ...selectedFields.map((fieldName) => ({
          label: fieldName,
          fieldName: fieldName === "Name" ? "TempName" : fieldName,
          type: fieldName === "Name" ? "url" : "text",
          typeAttributes: {
            label: {
              fieldName: "Name",
              target: "_blank"
            }
          }
        })),
        {
          type: "action",
          typeAttributes: {
            target: "_blank",
            rowActions: this.actions
          }
        }
      ];
    }else if(selectedFields.length==0){
      this.columnsMap=[];
    }
}

  @wire(fetchAllRecordsOfSelectedObject, { strObjectName: "$objectNameGrand" ,count1:"$count"})
  wiredObjectRecords({ data, error }) {
    if (data) {
      let tempRecs = [];
      if(data.length==0){
        const toastEvent = new ShowToastEvent({
          title: 'Error!',
          message: 'Records Not Found On Selected Object',
          variant: 'Error'
        });
        this.dispatchEvent(toastEvent);
      }else {
      data.forEach((record) => {
        let tempRec = Object.assign({}, record);
        tempRec.TempName = "/" + tempRec.Id;
        tempRecs.push(tempRec);
        console.log(tempRec);
      });
      this.allRecordsOfSelectedObject = tempRecs;
      this.error = undefined;
    } }else if (error) {
      this.error = error;
      this.allRecordsOfSelectedObject = undefined;
  }
  }6
   
  handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    switch (actionName) {
      case "edit":
        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId: row.Id,
            objectApiName: "MyCustomObject__c",
            actionName: "edit"
          }
        });
        break;

      case "view":
        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId: row.Id,
            objectApiName: "MyCustomObject__c",
            actionName: "view"
          }
        });
        break;

        case 'delete':
              const recordId = row.Id;
              deleteRecord(recordId)
                .then(() => {
                  const index = this.allRecordsOfSelectedObject.findIndex(record => record.Id === recordId);
                  this.allRecordsOfSelectedObject.splice(index, 1);
                  const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'Record has been deleted.',
                    variant: 'success'
                  });
                  this.dispatchEvent(toastEvent);
                  this.count++;
                })
                .catch(error => {
                  console.log(error);
                });
               
        break;
      default:
        break;
    }
  }
}

