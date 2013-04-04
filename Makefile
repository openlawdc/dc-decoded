docs/*.doc: code.zip docs
	unzip code.zip -d docs

code.zip:
	wget http://dccouncil.us/files/user_uploads/event_testimony/dc_code_unofficial_2012-12-11.zip -O code.zip

docs:
	mkdir docs
