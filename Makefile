install:
		@git clone https://github.com/yangyraaron/resumeanalysis ./bin/resumeanalysis
		@cd ./bin/resumeanalysis
		@pip install -r requirements.txt
		@npm install

build: