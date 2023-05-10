import { LightningElement,track } from 'lwc';
import fetchAllObjectList from '@salesforce/apex/RecordFetchHelper.fetchAllObjectList';
import {NavigationMixin} from 'lightning/navigation';
export default class sObjectSelector extends NavigationMixin(LightningElement) {
    @track objectName = '';
    @track objectList = [];
    @track arrayToSend=[];
    @track showButton=false;
    connectedCallback() { 
        fetchAllObjectList()
        .then((result) => {
            if (result) {
                this.objectList = [];
                for (let key in result ) {
                    this.objectList.push({ label: key, value: key });
                }
            } else {
                console.log('Objects are not found')
            }
        }).catch((error) => {
            console.log('Objects are not found')
        });
    }
    onObjectChange(event) { 
        this.objectName = event.detail.value;
        this.arrayToSend=[];
        this.showButton=true;

    }
    handleClick() {
        console.log("button record name " + this.objectName);
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: this.objectName,
                actionName: "new"
            }
        });
    }
    
}