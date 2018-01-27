
from api.configure import configure
import json
import datetime
import time
import base64
import hmac
import hashlib
import random
import urllib
from urllib import parse
from hashlib import sha1 as sha

def filter_headers(data):
    """只设置host content-type 还有x开头的头部.
    :param data(dict): 所有的头部信息.
    :return(dict): 计算进签名的头部.
    """
    headers = {}
    for i in data.keys():
        if i == 'Content-Type' or i == 'Host' or i[0] == 'x' or i[0] == 'X':
            headers[i] = data[i]
    return headers


class service:

    def get_iso_8601(expire):
        gmt = datetime.datetime.fromtimestamp(expire).isoformat()
        gmt += 'Z'
        return gmt

    def telCosToken(method, headers={}, params={}):
        # HttpString = [HttpMethod]\n[HttpURI]\n[HttpParameters]\n[HttpHeaders]\n
        headers = filter_headers(headers)
        headers = dict([(k.lower(), parse.quote(v, '-_.~')) for k, v in headers.items()])  # headers中的key转换为小写，value进行encode
        format_str = "{method}\n{host}\n{params}\n{headers}\n".format(
            method=method.lower(),
            host=configure.cosHost,
            params=urllib.parse.urlencode(sorted(params.items())),
            headers='&'.join(map(lambda i: "{key}={value}".format(key=i[0], value=i[1]), sorted(headers.items())))
        )
        print(format_str)
        # SignKey = HMAC-SHA1(SecretKey,"[q-key-time]")
        start_sign_time = int(time.time())
        sign_time = "{bg_time};{ed_time}".format(bg_time=start_sign_time-60, ed_time=start_sign_time+configure.expire_time)
        sha1 = hashlib.sha1()
        sha1.update(format_str.encode("utf8"))
        str_to_sign = "sha1\n{time}\n{sha1}\n".format(time=sign_time, sha1=sha1.hexdigest())
        # StringToSign = [q-sign-algorithm]\n[q-sign-time]\nSHA1-HASH(HttpString)\n
        str_to_sign = "sha1\n{time}\n{sha1}\n".format(time=sign_time, sha1=sha1.hexdigest())
        # Signature = HMAC-SHA1(SignKey,StringToSign)
        sign_key = hmac.new(configure.cosPrivateKey.encode('utf8'), sign_time.encode('utf8'), hashlib.sha1).hexdigest()
        sign = hmac.new(sign_key.encode('utf8'), str_to_sign.encode('utf8'), hashlib.sha1).hexdigest()
        sign_tpl = "q-sign-algorithm=sha1&q-ak={ak}&q-sign-time={sign_time}&q-key-time={key_time}&q-header-list={headers}&q-url-param-list={params}&q-signature={sign}"
        #
        return sign_tpl.format(
            ak=configure.cosAccessId,
            sign_time=sign_time,
            key_time=sign_time,
            params=';'.join(sorted(map(lambda k: k.lower(), params.keys()))),
            headers=';'.join(sorted(headers.keys())),
            sign=sign
        )

    def aliOssToken(dir):
        now = int(time.time())
        expire_syncpoint  = now + configure.expire_time
        expire = __class__.get_iso_8601(expire_syncpoint)

        policy_dict = {}
        policy_dict['expiration'] = configure.expire_time
        condition_array = []
        array_item = []
        array_item.append('starts-with');
        array_item.append('$key');
        array_item.append(dir);
        condition_array.append(array_item)
        policy_dict['conditions'] = condition_array
        policy = json.dumps(policy_dict).strip()
        #policy_encode = base64.encodestring(policy)
        policy_encode = base64.b64encode(policy.encode(encoding="UTF-8"))
        h = hmac.new(configure.accessKeySecret.encode(encoding="UTF-8"), policy_encode, sha)
        sign_result = base64.encodestring(h.digest()).strip()

        token_dict = {}
        token_dict['accessid'] = configure.accessKeyId
        token_dict['host'] = configure.host
        token_dict['policy'] = policy_encode.decode(encoding="UTF-8")
        token_dict['signature'] = sign_result.decode(encoding="UTF-8")
        token_dict['expire'] = expire_syncpoint
        token_dict['dir'] = dir
        return token_dict
