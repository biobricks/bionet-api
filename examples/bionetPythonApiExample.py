#!/usr/bin/python3

"""
to run, first start bionetProxy:
../src/bionetProxyServer -protocol=https -host=endylab.stanford.edu -listen=8088 -username=xxxx -password=xxxx
"""

import asyncio
import websockets
from io import StringIO
import json
from BionetPythonApi import BionetApi
def oolog(msg):
    print(msg)

class BionetClient():

    ws_open = False
    eventLoop = None

    def __init__(self, socketUrl):
        self.wsUrl = socketUrl

    async def arpc(self, request, consumer):
        io = StringIO()
        try:
            json.dump(request, io)
        except:
            oolog("arpc: error in json.dump")

        await self.websocket.send(io.getvalue())
        message = await self.websocket.recv()

        jsonMessage = json.loads(message)
        await consumer(jsonMessage)
        """
        try:
            jsonMessage = json.loads(message)
            await consumer(jsonMessage)
        except:
            oolog("arpc: error in json.loads"+message)
        """

    def rpc(self, request, consumer):
        async def runRpc():
            async with websockets.connect(
                    self.wsUrl, subprotocols=["bionet-protocol"]) as websocket:
                self.websocket = websocket
                await self.arpc(request, consumer)

        loop = asyncio.get_event_loop()
        loop.run_until_complete(runRpc())

if __name__ == "__main__":

    bionetClient = BionetClient("ws://localhost:8088")
    bionetApi = BionetApi(bionetClient)

    async def rpcGetResult(response):
        oolog('\nrpcGetResult:\n')
        io = StringIO()
        json.dump(response, io)
        oolog(io.getvalue())

    async def rpcSearchResultCSV(response):
        oolog('\nrpcSearchResultCSV:\n')

        def writeSearchResultRow(row):
            result = row['value']
            created = result['created']
            updated = result['updated']
            rowOutput = '"{name}","{description}","{sequence}","{created}","{updated}","{id}"'.format(name=result['name'],description=result['description'],sequence=result['sequence'],created=created['user'],updated=updated['user'],id=result['id'])
            oolog(rowOutput)

        for row in response:
            writeSearchResultRow(row)

    bionetApi.searchVirtuals("r",{},rpcSearchResultCSV)
    bionetApi.get("v-2773e301-03bd-4599-b46c-6fb46aa4b054",rpcGetResult)
