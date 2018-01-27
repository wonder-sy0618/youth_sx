import http.client

conn = http.client.HTTPConnection("http://ccyl-1256005526.cos.ap-shanghai.myqcloud.com/demo.png")

headers = {
    'Authorization': "q-sign-algorithm=sha1&q-ak=AKIDO5fE7n80MWTsKiJujk2DMRL5c3&q-sign-time=1516958226;1516958316&q-key-time=1516958226;1516958316&q-header-list=&q-url-param-list=&q-signatu",
    'Cache-Control': "no-cache",
    'Postman-Token': "a6c0b821-ce04-e7bf-1b87-f5f9004353a3"
    }

conn.request("PUT", "e://tmp//demo.png", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
