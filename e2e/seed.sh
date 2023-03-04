function produce() {
    for i in {0..100}; do
	echo "{\"partition\":$1, \"index\":$i}"| kcli p mmm -p $1
    sleep 1
    done
}
kcli t create -p 3 asdf

for partition in {0..49}; do
	produce $partition &
done
