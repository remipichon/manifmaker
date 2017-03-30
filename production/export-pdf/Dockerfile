FROM openlabs/docker-wkhtmltopdf

RUN apt-get install xvfb

# −screen screennum WxHxD
# couldn't give wkhtmltopdf args to CMD, ENV is a workaround that suits me
ENTRYPOINT xvfb-run -a -s "-screen 0 1280x1024x16" wkhtmltopdf --window-status ready_to_print --margin-left 3 --margin-top 3 --margin-right 3 --margin-bottom 3 --use-xserver $IN $OUT
