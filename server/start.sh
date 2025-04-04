# #!/bin/sh
# service sshd start
# npm run dev 

#!/bin/sh

# SSH 실행 (백그라운드)
nohup /usr/sbin/sshd &

# Node 서버 실행
npm run dev
