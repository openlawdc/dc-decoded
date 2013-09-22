raw/dc_code_unofficial_sept_2013.utf8.txt:
	iconv -c -t CP1252 -f utf-8 < raw/dc_code_unofficial_sept_2013.txt > raw/dc_code_unofficial_sept_2013.utf8.txt

raw/dc_code_unofficial_sept_2013.txt: raw
	# download the code as text
	wget http://dccouncil.us/files/user_uploads/event_testimony/dc_code_unofficial_sept_2013.txt -O raw/dc_code_unofficial_sept_2013.txt
	# ensure that the file's mtime is now
	touch raw/dc_code_unofficial_sept_2013.txt

raw:
	mkdir -p raw
