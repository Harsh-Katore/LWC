public with sharing class RecordFetchHelper {
    @AuraEnabled(cacheable = true)
    public static Map<String,String> fetchAllObjectList(){   
        Map<String,String> mapOfAllObject = new  Map<String,String>();
        List<String> customObjectList = new List<string>();
        List<String> standardObjectList = new List<string>();
         
        for(Schema.SobjectType obj : Schema.getGlobalDescribe().values()) {
            Schema.DescribeSObjectResult objDescribe = obj.getDescribe();
            if(objDescribe.isCustom()) {
                String objName = objDescribe.getName();
                customObjectList.add(objName);
            }
            else {
                String objName = objDescribe.getName();
                standardObjectList.add(objName);
            }
        }
        customObjectList.sort();
        standardObjectList.sort();
        
        for(String obj:standardObjectList){
            mapOfAllObject.put(obj, obj);
        }
        for(String obj:customObjectList){
            mapOfAllObject.put(obj, obj);
        }
        return mapOfAllObject;
    }
    
    @AuraEnabled(cacheable = true)
    public static Map<String,String> fetchAllFieldsForSelectedObject(String strObjectName){   
        Map<String, Schema.SObjectType> detail = Schema.getGlobalDescribe();
        Map<String,String> mapOfFields = new  Map<String,String>();
        for(Schema.SObjectField fields :detail.get(strObjectName).getDescribe().fields.getMap().Values()) {
                mapOfFields.put(fields.getDescribe().getName() , fields.getDescribe().getName());
        }
        return mapOfFields;
    }
    @AuraEnabled(cacheable=true)  
    public static List<sObject> fetchAllRecordsOfSelectedObject(String strObjectName) { 
        Map<String, Schema.SObjectType> detail = Schema.getGlobalDescribe();
        List<String> allFieldsOfSelectedObject = new  List<String>();
        for(Schema.SObjectField fields :detail.get(strObjectName).getDescribe().fields.getMap().Values()) {
            allFieldsOfSelectedObject.add(fields.getDescribe().getName());
        }
        string allFields = string.join(allFieldsOfSelectedObject,','); 
        String query = 'select ' + allFields +' from '  + strObjectName;     
        return Database.query(query);  

    }

  @AuraEnabled(cacheable=true)
    public static void deleteRecord(Id recordId) {
    String objectName = '';
    objectName = recordId.getSObjectType().getDescribe().getName();
    System.debug(objectName);
    system.debug(recordId);

    // try {
    //     SObject sObjectRecord = recordId.getSObjectType().newSObject(recordId);
    //     system.debug(sObjectRecord);
    //     database.delete(sObjectRecord,false);
    //     System.debug('Record with Id ' + recordId + ' deleted successfully.');
    // } catch (Exception e) {
    //     System.debug('Error deleting record: ' + e.getMessage());
    // }


           string query = 'select Id ';
           query=query + ' from ' + objectName ;
           query=query + 'WHERE Id=:'+recordId;
           system.debug('query===='+query);
           list<sobject> accounts=database.query(query);
        }
       
    @AuraEnabled(cacheable=true)
    public static void recordsListCol(Id recordId){

    }
}


//RecordFetchHelper.fetchAllObjectList();