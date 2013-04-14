json: txt
	mkdir -p json
	node parse.js

sections: json
	mkdir -p sections
	node sections.js

txt: docs/dc_code_unofficial_2012-12-11
	mkdir -p txt
	textutil -convert txt docs/dc_code_unofficial_2012-12-11/*.doc
	mv docs/dc_code_unofficial_2012-12-11/*.txt txt

docs/dc_code_unofficial_2012-12-11: code.zip
	unzip code.zip -d docs

code.zip:
	wget http://dccouncil.us/files/user_uploads/event_testimony/dc_code_unofficial_2012-12-11.zip -O code.zip

docs:
	mkdir docs
