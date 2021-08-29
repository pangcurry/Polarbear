import sys, os, re, subprocess, uuid
import pytube
from urllib import parse

mp3_dir = "/home/ubuntu/polarbear/polarbear/data/mp3"
webm_dir = "/home/ubuntu/polarbear/polarbear/data/webm"
ffmpeg_dir = "ffmpeg"

# try:
# test URL
url = "https://www.youtube.com/watch?v=" + sys.argv[1]
# url = "https://www.youtube.com/watch?v=" + "XKH20-WCHpY"

# pytube를 통한 동영상 정보 가져오기
yt = pytube.YouTube(url)
# print('get video info ok')

# 스트림 전체 목록 확인
# videos = yt.streams.all()
# # print(videos)
# for i in range(len(videos)):
#     print(i, '---',videos[i])

# test = yt.streams.filter(adaptive=True).order_by('abr').desc()
# for i in range(len(test)):
#     print(i, '---',test[i])

#제목 가져오기
temp_title = yt.streams[0].title
# print('get title ok')

# 제목 문자열 검열
music_title = re.sub('[/\\:*?,"|<>'+"']",'',temp_title)
# print('music_title::::::::::::', music_title)
# print('use re ok')

# 사용자가 확인할 제목
# print(parse.quote(music_title))

# 실제 저장될 파일 이름
uid = uuid.uuid4()
uid_str = uid.urn
file_uuid = uid_str[9:]

# webm파일 존재 여부
isWebmExist = os.path.isfile(webm_dir+"/"+music_title+".webm")
# print("isWebmExist")

# webm 존재여부 확인
if isWebmExist == False:
    # 다운로드
    test = yt.streams.filter(adaptive=True).order_by('abr').desc().first().download(output_path= webm_dir, filename=music_title)

    # 파일 이름 수정 
    if test != webm_dir+music_title:
        os.rename(test, webm_dir + '/' + music_title + '.webm')
    # print('test ok')

    # print('test:', test)
    

isMp3Exist = os.path.isfile(mp3_dir+"/"+music_title+".mp3")

# mp3 존재여부 확인
if isMp3Exist:
    # 사용자가 확인할 제목
    # print(parse.quote(music_title))
    # 실제 파일 이름
    print(parse.quote(music_title))
    quit()

# webm -> mp3 변환해주는 명령어 제작
command = ffmpeg_dir + " -i " + '"' + webm_dir + '/' + music_title + ".webm" + '" -acodec libmp3lame -aq 4 "' + mp3_dir + "/" + music_title + '.mp3"'
# print(command)

# 명령어 실행
popen = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
(stdoutdata, stderrdata) = popen.communicate()
# print('command : ', command)
# print('popen : ',popen)
# print('stdoutdata: ',stdoutdata)
# print('stderrdata: ',stderrdata)

# 끝
# print('clear')

# print(sys.stdin.encoding)
# print(new_music_title.encode('euc-kr','replace').decode('euc-kr'))
print(parse.quote(music_title))
quit()
# print(unicode(new_music_title, 'cp949'))
# unicode(str, 'utf-8').encode('euc-kr')

# print(stdoutdata)
# print(stderrdata)
# except:
#     print('in except')
#     executable = sys.executable
#     args = sys.argv[:]
#     args.insert(0, sys.executable)

#     time.sleep(1)
#     os.execvp(executable, args)
