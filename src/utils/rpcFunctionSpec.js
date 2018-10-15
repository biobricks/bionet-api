const rpcLib = {
  "requestSendMTA": {
    "name": "requestSendMTA",
    "description": "d",
    "public": false,
    "requestArgs": [
      "requestID",
      "description"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "requestBuyShippingLabel": {
    "name": "requestBuyShippingLabel",
    "description": "d",
    "public": false,
    "requestArgs": [
      "requestID"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "requestPrintShippingLabel": {
    "name": "requestPrintShippingLabel",
    "description": "d",
    "public": false,
    "requestArgs": [
      "requestID"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "printShippingLabel": {
    "name": "printShippingLabel",
    "description": "d",
    "public": false,
    "requestArgs": [
      "address"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getWorkbench": {
    "name": "getWorkbench",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "workbenchTree": {
    "name": "workbenchTree",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getFavLocations": {
    "name": "getFavLocations",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "favLocationsTree": {
    "name": "favLocationsTree",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "saveFavLocation": {
    "name": "saveFavLocation",
    "description": "d",
    "public": false,
    "requestArgs": [
      "material",
      "imageData",
      "doPrint"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getChildren": {
    "name": "getChildren",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "saveInWorkbench": {
    "name": "saveInWorkbench",
    "description": "d",
    "public": false,
    "requestArgs": [
      "material",
      "imageData",
      "doPrint"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getID": {
    "name": "getID",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "clearDeleted": {
    "name": "clearDeleted",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "undelete": {
    "name": "undelete",
    "description": "d",
    "public": false,
    "requestArgs": [
      "key"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "delPhysical": {
    "name": "delPhysical",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "delVirtual": {
    "name": "delVirtual",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "physicalAutocomplete": {
    "name": "physicalAutocomplete",
    "description": "d",
    "public": false,
    "requestArgs": [
      "query"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "addToCart": {
    "name": "addToCart",
    "description": "d",
    "public": false,
    "requestArgs": [
      "physical_id",
      "name"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "delFromCart": {
    "name": "delFromCart",
    "description": "d",
    "public": false,
    "requestArgs": [
      "physical_id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "emptyCart": {
    "name": "emptyCart",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getType": {
    "name": "getType",
    "description": "d",
    "public": false,
    "requestArgs": [
      "name"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "createAutocomplete": {
    "name": "createAutocomplete",
    "description": "d",
    "public": false,
    "requestArgs": [
      "type",
      "query"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "saveVirtual": {
    "name": "saveVirtual",
    "description": "d",
    "public": false,
    "requestArgs": [
      "material"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "savePhysical": {
    "name": "savePhysical",
    "description": "d",
    "public": false,
    "requestArgs": [
      "material",
      "imageData",
      "doPrint"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "elasticSearch": {
    "name": "elasticSearch",
    "description": "d",
    "public": false,
    "requestArgs": [
      "query"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "inventoryTree": {
    "name": "inventoryTree",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getParentPath": {
    "name": "getParentPath",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getLocationPath": {
    "name": "getLocationPath",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getPath": {
    "name": "getPath",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getImmediateChildren": {
    "name": "getImmediateChildren",
    "description": "d",
    "public": false,
    "requestArgs": [
      "path",
      "key"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getLocationPathChildren": {
    "name": "getLocationPathChildren",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getVirtualBy": {
    "name": "getVirtualBy",
    "description": "d",
    "public": false,
    "requestArgs": [
      "field",
      "value"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getBy": {
    "name": "getBy",
    "description": "d",
    "public": false,
    "requestArgs": [
      "field",
      "value"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "search": {
    "name": "search",
    "description": "d",
    "public": false,
    "requestArgs": [
      "query"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getUser": {
    "name": "getUser",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "delUser": {
    "name": "delUser",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "saveUser": {
    "name": "saveUser",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id",
      "userData"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getPeers": {
    "name": "getPeers",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "peerSearchOld": {
    "name": "peerSearchOld",
    "description": "d",
    "public": false,
    "requestArgs": [
      "query"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "peerBlast": {
    "name": "peerBlast",
    "description": "d",
    "public": false,
    "requestArgs": [
      "query"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "emptyRequestTrash": {
    "name": "emptyRequestTrash",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "changeRequestTrashed": {
    "name": "changeRequestTrashed",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id",
      "trashed"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "changeRequestStatus": {
    "name": "changeRequestStatus",
    "description": "d",
    "public": false,
    "requestArgs": [
      "id",
      "status"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "requestMaterial": {
    "name": "requestMaterial",
    "description": "d",
    "public": false,
    "requestArgs": [
      "peerID",
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "freegenesCreatePlate": {
    "name": "freegenesCreatePlate",
    "description": "d",
    "public": false,
    "requestArgs": [
      "parent_id",
      "name"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "freegenesCreatePart": {
    "name": "freegenesCreatePart",
    "description": "d",
    "public": false,
    "requestArgs": [
      "virtual_id",
      "parent_id",
      "name"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getPandadocStatus": {
    "name": "getPandadocStatus",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "foo_user": {
    "name": "foo_user",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "testStream": {
    "name": "testStream",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "listDeleted": {
    "name": "listDeleted",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "cartStream": {
    "name": "cartStream",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "clearRequests": {
    "name": "clearRequests",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getRequests": {
    "name": "getRequests",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "recentChanges": {
    "name": "recentChanges",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "getUsers": {
    "name": "getUsers",
    "description": "d",
    "public": false,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "getInventoryRoot": {
    "name": "getInventoryRoot",
    "description": "",
    "public": true,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getPeerInfo": {
    "name": "getPeerInfo",
    "description": "",
    "public": true,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getStatus": {
    "name": "getStatus",
    "description": "",
    "public": true,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "foo": {
    "name": "foo",
    "description": "",
    "public": true,
    "requestArgs": [],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "checkMasterPassword": {
    "name": "checkMasterPassword",
    "description": "",
    "public": true,
    "requestArgs": [
      "password"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "createUser": {
    "name": "createUser",
    "description": "",
    "public": true,
    "requestArgs": [
      "username",
      "email",
      "password",
      "opts"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getRequestStatus": {
    "name": "getRequestStatus",
    "description": "",
    "public": true,
    "requestArgs": [
      "pandadocID"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getRequest": {
    "name": "getRequest",
    "description": "",
    "public": true,
    "requestArgs": [
      "key"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "createRequest": {
    "name": "createRequest",
    "description": "",
    "public": true,
    "requestArgs": [
      "virtual_id",
      "data"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "getByHumanID": {
    "name": "getByHumanID",
    "description": "",
    "public": true,
    "requestArgs": [
      "humanID"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "verifyUser": {
    "name": "verifyUser",
    "description": "",
    "public": true,
    "requestArgs": [
      "code"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "requestPasswordReset": {
    "name": "requestPasswordReset",
    "description": "",
    "public": true,
    "requestArgs": [
      "emailOrName"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "checkPasswordResetCode": {
    "name": "checkPasswordResetCode",
    "description": "",
    "public": true,
    "requestArgs": [
      "resetCode"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "completePasswordReset": {
    "name": "completePasswordReset",
    "description": "",
    "public": true,
    "requestArgs": [
      "resetCode",
      "password"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "blast": {
    "name": "blast",
    "description": "",
    "public": true,
    "requestArgs": [
      "query",
      "opts"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "get": {
    "name": "get",
    "description": "",
    "public": true,
    "requestArgs": [
      "id"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "requestLocalMaterial": {
    "name": "requestLocalMaterial",
    "description": "",
    "public": true,
    "requestArgs": [
      "id",
      "requesterEmail",
      "physicalAddress",
      "name",
      "org",
      "msg"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": ""
  },
  "searchVirtuals": {
    "name": "searchVirtuals",
    "description": "",
    "public": true,
    "requestArgs": [
      "query",
      "opts"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "searchPhysicals": {
    "name": "searchPhysicals",
    "description": "",
    "public": true,
    "requestArgs": [
      "query",
      "opts"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "blastStream": {
    "name": "blastStream",
    "description": "",
    "public": true,
    "requestArgs": [
      "query",
      "opts"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  },
  "peerSearch": {
    "name": "peerSearch",
    "description": "",
    "public": true,
    "requestArgs": [
      "methodName",
      "query",
      "opts"
    ],
    "responseArgs": [
      "err"
    ],
    "returns": "",
    "stream": true
  }
}
module.exports.getlib = function getlib() {
    return rpcLib
}
