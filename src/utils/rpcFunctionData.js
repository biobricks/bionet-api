/*
var dataDictionary = {
    "name": "name",
    "description": "d",
    "dataType": ""
}

var fn_spec = {
    "name": "name",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [],
    "returns": ""
}

// database doc formats
// physical
// container
// virtual
// search result
*/

const rpcUserLib = {
    "requestSendMTA": [
        "requestID",
        "description"
    ],
    "requestBuyShippingLabel": [
        "requestID"
    ],
    "requestPrintShippingLabel": [
        "requestID"
    ],
    "printShippingLabel": [
        "address"
    ],
    "getWorkbench": [],
    "workbenchTree": [],
    "getFavLocations": [],
    "favLocationsTree": [],
    "saveFavLocation": [
        "material",
        "imageData",
        "doPrint"
    ],
    "getChildren": [
        "id"
    ],
    "saveInWorkbench": [
        "material",
        "imageData",
        "doPrint"
    ],
    "getID": [],
    "clearDeleted": [],
    "undelete": [
        "key"
    ],
    "delPhysical": [
        "id"
    ],
    "delVirtual": [
        "id"
    ],
    "physicalAutocomplete": [
        "query"
    ],
    "addToCart": [
        "physical_id",
        "name"
    ],
    "delFromCart": [
        "physical_id"
    ],
    "emptyCart": [],
    "getType": [
        "name"
    ],
    "createAutocomplete": [
        "type",
        "query"
    ],
    "saveVirtual": [
        "material"
    ],
    "savePhysical": [
        "material",
        "imageData",
        "doPrint"
    ],
    "elasticSearch": [
        "query"
    ],
    "inventoryTree": [],
    "getParentPath": [
        "id"
    ],
    "getLocationPath": [
        "id"
    ],
    "getPath": [
        "id"
    ],
    "getImmediateChildren": [
        "path",
        "key"
    ],
    "getLocationPathChildren": [
        "id"
    ],
    "getVirtualBy": [
        "field",
        "value"
    ],
    "getBy": [
        "field",
        "value"
    ],
    "search": [
        "query"
    ],
    "getUser": [
        "id"
    ],
    "delUser": [
        "id"
    ],
    "saveUser": [
        "id",
        "userData"
    ],
    "getPeers": [],
    "peerSearchOld": [
        "query"
    ],
    "peerBlast": [
        "query"
    ],
    "emptyRequestTrash": [],
    "changeRequestTrashed": [
        "id",
        "trashed"
    ],
    "changeRequestStatus": [
        "id",
        "status"
    ],
    "requestMaterial": [
        "peerID",
        "id"
    ],
    "freegenesCreatePlate": [
        "parent_id",
        "name"
    ],
    "freegenesCreatePart": [
        "virtual_id",
        "parent_id",
        "name"
    ],
    "getPandadocStatus": [],
    "foo_user": [],
    "testStream": [],
    "listDeleted": [],
    "cartStream": [],
    "clearRequests": [],
    "getRequests": [],
    "recentChanges": [],
    "getUsers": []
}
const rpcPublicLib = {
    "getInventoryRoot": [],
    "getPeerInfo": [],
    "getStatus": [],
    "foo": [],
    "checkMasterPassword": ["password"],
    "createUser": ["username", "email", "password", "opts"],
    "getRequestStatus": ["pandadocID"],
    "getRequest": ["key"],
    "createRequest": ["virtual_id", "data"],
    "getByHumanID": ["humanID"],
    "verifyUser": ["code"],
    "requestPasswordReset": ["emailOrName"],
    "checkPasswordResetCode": ["resetCode"],
    "completePasswordReset": ["resetCode", "password"],
    "blast": ["query", "opts"],
    "get": ["id"],
    "requestLocalMaterial": ["id", "requesterEmail", "physicalAddress", "name", "org", "msg"],
    "searchVirtuals": ["query", "opts"],
    "searchPhysicals": ["query", "opts"],
    "blastStream": ["query", "opts"],
    "peerSearch": ["methodName", "query", "opts"]
}
const streamLib = [
    "searchVirtuals",
    "searchPhysicals",
    "blastStream",
    "peerSearch",
    "testStream",
    "listDeleted",
    "cartStream",
    "getRequests",
    "recentChanges",
    "getUsers"    
]
module.exports.getUserlib = function getUserlib() {
    return rpcUserLib
}
module.exports.getPubliclib = function getPubliclib() {
    return rpcPublicLib
}
module.exports.getStreamFn = function getStreamFn() {
    return streamLib
}
