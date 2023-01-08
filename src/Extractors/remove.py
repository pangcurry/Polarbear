from urllib import parse
import os, sys

# # ---------- linux -------------
# mp3_dir = "/polarbear/data/mp3/"
# webm_dir = "/polarbear/data/webm/"

# ---------- windows -------------
mp3_dir = os.path.dirname(os.path.realpath(__file__)) + "/../data/mp3/"
webm_dir = os.path.dirname(os.path.realpath(__file__)) + "/../data/webm/"
print(mp3_dir)
music_title = parse.unquote(sys.argv[1])
print(music_title)
print(mp3_dir + music_title + ".mp3")
# music_title = "24kGoldn - Mood (Official Video) ft. iann dior"

if os.path.isfile(mp3_dir + music_title + ".mp3"):
  os.remove(mp3_dir + music_title + ".mp3")
  print('Successfully removed mp3.')

if os.path.isfile(webm_dir + music_title + ".webm"):
  os.remove(webm_dir + music_title + ".webm")
  print('Successfully removed webm.')
