function produce() {
    for i in {0..10}; do
        echo "{\"partition\":$1, \"index\":$i}"| kcli p test -p $1
        sleep .5
    done
}

for partition in {0..2}; do
	produce $partition
done
