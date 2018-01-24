
from api.configure import configure
import json
import datetime
import time
import base64
import hmac
from hashlib import sha1 as sha

class service:

    def get_iso_8601(expire):
        gmt = datetime.datetime.fromtimestamp(expire).isoformat()
        gmt += 'Z'
        return gmt

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
