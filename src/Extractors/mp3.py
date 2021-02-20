import sys, os, re, subprocess
import pytube
from urllib import parse

# video_dir = "C:\\Users\\user\\Desktop\\musicdown\\video"
# mp3_dir = "C:\\Users\\user\\Documents\\Polarbear\\data\\mp3"
# webm_dir = "C:\\Users\\user\\Documents\\Polarbear\\data\\webm"
# ffmpeg_dir = "C:\\Users\\user\\Documents\\Polarbear\\ffmpeg\\bin\\ffmpeg.exe"
mp3_dir = ".\\data\\mp3"
webm_dir = ".\\data\\webm"
ffmpeg_dir = ".\\ffmpeg\\bin\\ffmpeg.exe"


# test URL
# url = "https://www.youtube.com/watch?v=mKCnrFc63zU&ab_channel=%EC%95%84%EB%8A%94%ED%98%95%EB%8B%98Knowingbros"
url = "https://www.youtube.com/watch?v=" + sys.argv[1]
# url = "https://www.youtube.com/watch?v=" + "GrAchTdepsU"

# pytube를 통한 동영상 정보 가져오기
yt = pytube.YouTube(url)
print('get video info ok')

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
print('get title ok')

# 제목 문자열 검열
music_title = re.sub('[/\\:*?,"|<>'+"']",'',temp_title)
# music_title = ",,,,,,,,,,"
print('use re ok')

# 다운로드
test = yt.streams.filter(adaptive=True).order_by('abr').desc().first().download(output_path= webm_dir, filename=music_title)
print('download ok')

# 파일 이름 수정 
if test != webm_dir+music_title:
    os.rename(test, webm_dir + '\\' + music_title + '.webm')
# print(test)
print('test ok')

# webm -> mp3 변환해주는 명령어 제작
command = ffmpeg_dir + " -i " + '"' + webm_dir + '\\' + music_title + ".webm" + '" -acodec libmp3lame -aq 4 "' + mp3_dir + "\\" + music_title + '.mp3"'
# print(music_title)
print('make command ok')
# print(command)

# 명령어 실행
popen = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
(stdoutdata, stderrdata) = popen.communicate()
print('go command ok')

# 끝
print('clear')
# print(sys.stdin.encoding)
# print(new_music_title.encode('euc-kr','replace').decode('euc-kr'))
print(parse.quote(music_title))
# print(unicode(new_music_title, 'cp949'))
# unicode(str, 'utf-8').encode('euc-kr')

# print(stdoutdata)
# print(stderrdata)