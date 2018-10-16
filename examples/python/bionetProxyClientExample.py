#!/usr/bin/python3

"""
to run, first start bionetProxy:
node bionetProxyServer -protocol=https -host=endylab.stanford.edu -listen=8088 -username=xxxx -password=xxxx
"""

import asyncio
import websockets
from io import StringIO
import json
import random
from BionetProxyClient import BionetClient

if __name__ == "__main__":

    bionetClient = BionetClient()

    async def rpcSearchResultCSV(err,response):
        print('\nrpcSearchResultCSV:\n')

        def writeSearchResultRow(row):
            result = row['value']
            created = result['created']
            updated = result['updated']
            rowOutput = '"{name}","{description}","{sequence}","{created}","{updated}","{id}"'.format(name=result['name'],description=result['description'],sequence=result['sequence'],created=created['user'],updated=updated['user'],id=result['id'])
            print(rowOutput)

        for row in response:
            writeSearchResultRow(row)

    async def rpcGetResult(err,response):
        print('\nrpcGetResult:\n')
        io = StringIO()
        json.dump(response, io)
        print(io.getvalue())

    async def run():
        await bionetClient.rpc(
            {"method": "searchVirtuals", "params": ['r']},
            rpcSearchResultCSV
        )
        await bionetClient.rpc(
            {"method": "get", "params": ['v-2773e301-03bd-4599-b46c-6fb46aa4b054']},
            rpcGetResult
        )

    bionetClient.connect("ws://localhost:8088", run)

