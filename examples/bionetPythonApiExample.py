#!/usr/bin/python3

"""
to run, first start bionetProxy:
../src/bionetProxyServer -protocol=https -host=endylab.stanford.edu -listen=8088 -username=xxxx -password=xxxx
"""

import asyncio
from io import StringIO
import json
from BionetPythonApi import BionetApi

if __name__ == "__main__":

    bionetApi = BionetApi()

    async def run():
        async def rpcGetResult(err,response):
            if (err):
                print(err)
                return
            print('\nrpcGetResult:\n')
            io = StringIO()
            json.dump(response, io)
            print(io.getvalue())

        async def rpcSearchResultCSV(err,response):
            print('\nrpcSearchResultCSV:\n')

            async def writeSearchResultRow(row):
                result = row['value']
                id = result['id']

                async def getVirtual(err,response):
                    virtualData=response
                    freeGenes = virtualData['freeGenes']
                    freeGenesStage = virtualData['freeGenesStage']
                    created = result['created']
                    updated = result['updated']
                    #rowOutput = '"{name}","{description}","{sequence}","{freeGenes}","{freeGenesStage}","{id}"'.format(name=result['name'],description=result['description'],sequence=result['sequence'],freeGenes=freeGenes,freeGenesStage=freeGenesStage,id=result['id'])
                    rowOutput = '"{name}","{freeGenes}","{freeGenesStage}","{id}"'.format(name=result['name'],freeGenes=freeGenes,freeGenesStage=freeGenesStage,id=result['id'])
                    print(rowOutput)

                await bionetApi.get(id,getVirtual)

            for row in response:
                await writeSearchResultRow(row)

        await bionetApi.searchVirtuals("r",{},rpcSearchResultCSV)
        await bionetApi.get("v-2773e301-03bd-4599-b46c-6fb46aa4b054",rpcGetResult)
        await bionetApi.get("v-2773e301-03bd-4599-b46c-6fb46aa4b054xx",rpcGetResult)

    bionetApi.connect("ws://localhost:8088",run)

