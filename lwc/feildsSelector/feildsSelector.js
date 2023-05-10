import { LightningElement,api,track,wire } from 'lwc';
import fetchAllFieldsForSelectedObject from '@salesforce/apex/RecordFetchHelper.fetchAllFieldsForSelectedObject';

export default class feildsSelector extends LightningElement {
    @track lstFields = [];
    @api arrayToSend = [];
    @api objectNameChild='';
    @api showButton=false;
    @wire(fetchAllFieldsForSelectedObject,{ strObjectName: '$objectNameChild' })
    fieldListTemp({ error, data }) {
        if (data) {
            this.lstFields = [];
            for (let key in data) {
                this.lstFields.push({ label: key, value: key,type:'action' });
            }
        } else if (error) {
            console.log('All fields are not fetched');
        }
    }
    handleCheckBoxClick(event) { 
        this.arrayToSend = [];
        for(let index in event.detail.value) {
            this.arrayToSend.push(event.detail.value[index])
        }     
    } 
    handleShowData(event){
        this.template.querySelector("c-sobject-record-list").recordsListCol();
}
}