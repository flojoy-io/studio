import yaml
import uptime
from django.conf import settings
import redis
from subprocess import Popen, PIPE
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.shortcuts import render

# Connect to our Redis instance
redis_instance = redis.StrictRedis(host=settings.REDIS_HOST,
                                  port=settings.REDIS_PORT, db=0)

STATUS_CODES = yaml.load(open('STATUS_CODES.yml', 'r'), Loader=yaml.Loader);


def test_socket(request):
    return render(request, 'test_socket.html')
    

@api_view(['GET'])
def ping(request):
    response = {
        'msg': STATUS_CODES['SERVER_ONLINE'],
    }
    return Response(response, status=200)

lastSysStatus = ""

@api_view(['GET'])
def heartbeat(request):
    sysStatus = redis_instance.get('SYSTEM_STATUS') 
    ts = '⏰ server uptime: ' + str(uptime.uptime());
    response = {
        'msg': '', 
        'clock': ts
    }
    
    global lastSysStatus
    if sysStatus != lastSysStatus:
        print('sysStatus', sysStatus)
    lastSysStatus = sysStatus

    if sysStatus == None:
        response['msg'] = ts
    elif sysStatus == STATUS_CODES['RQ_RUN_COMPLETE']:
        response['msg'] = STATUS_CODES['RQ_RUN_COMPLETE']
        redis_instance.set('SYSTEM_STATUS', STATUS_CODES['STANDBY'])
    else:
        response['msg'] = str(sysStatus).lower().replace('_', ' ')
    
    return Response(response, status=200)


@api_view(['GET'])
def io(request):
    result = redis_instance.get('COMPLETED_JOBS')

    ts = '⏰ server uptime: ' + str(uptime.uptime());
    response = {
        'msg': STATUS_CODES['MISSING_RQ_RESULTS'], 
        'clock': ts, 
        'io': {}
    }

    if isinstance(result, str):
        result = result.replace(' ','')
        print(result[:20]);
        response['msg'] = STATUS_CODES['RQ_RESULTS_RETURNED'];
        response['io'] = r;

    return Response(response, status=200)


@api_view(['POST'])
def wfc(request):
    print('Flow chart payload... ', request.data['fc'][:200])

    with open('PYTHON/WATCH/fc.json', 'w') as file:
        file.write(request.data['fc'])
    
    process = Popen(['python3', 'PYTHON/WATCH/watch.py'], stdout=PIPE, stderr=PIPE)
    stdout, stderr = process.communicate()
    
    if stdout:
        print(stdout)
        
    if stderr:
        print(stderr)
    
    redis_instance.set('SYSTEM_STATUS', STATUS_CODES['RQ_RUN_IN_PROCESS'])
    response = {
        'msg': STATUS_CODES['RQ_RUN_IN_PROCESS'], 
    }
    return Response(response, status=200)
    