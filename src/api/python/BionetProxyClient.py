import asyncio
import websockets
from io import StringIO
import json
import random
class BionetProxyClient():

	async def rpc(self, request, consumer):
		jsonRpcRequest = request
		jsonRpcRequest['jsonrpc']="2.0"
		jsonRpcRequest['id']=random.randint(1,9999999)
		io = StringIO()
		try:
			json.dump(jsonRpcRequest, io)
		except:
			print("arpc: error in json.dump")
		requestMsg = io.getvalue()
		await self.websocket.send(requestMsg)
		response = await self.websocket.recv()

		jsonRpcResponse = json.loads(response)
		error = None
		params = None
		try:
			error=jsonRpcResponse['error']
		except:
			error = None
		try:
			params=jsonRpcResponse['params']
		except:
			params = None
		await consumer(error,params)

	def connect(self, wsUrl, consumer):
		async def runRpc():
			async with websockets.connect(wsUrl, subprotocols=["bionet-protocol"]) as websocket:
				self.websocket = websocket
				await consumer()
		loop = asyncio.get_event_loop()
		loop.run_until_complete(runRpc())

