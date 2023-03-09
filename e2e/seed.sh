function produce() {
    for i in {0..10}; do
        echo "{\"partition\":$1, \"index\":$i}"| kcli p test -p $1
        sleep .5
    done
}

kcli t create test -p 3

for partition in {0..1}; do
	produce $partition
done
