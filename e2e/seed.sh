function produce() {
    for i in {0..10}; do
	echo "{\"partition\":$1, \"index\":$i}"| kcli p asdf -p $1
    sleep 1
    done
}
kcli t create -p 3 asdf

for partition in "0" "1" "2"; do
	produce $partition 
done
