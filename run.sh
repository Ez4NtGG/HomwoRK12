echo Sleep 2....
sleep 2

cd ./hw12
alembic upgrade head
python ./main.py
