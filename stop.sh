#! sh

echo "kill service"
try
(  
    echo "kill frontend ..."
    sudo kill -9 $(sudo lsof -t -i:8080)
    echo "kill backend ..."
    sudo kill -9 $(sudo lsof -t -i:8081)
    echo "completed"
)



