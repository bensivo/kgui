function produce() {
    for i in {0..100}; do
        date | kcli p datetime -p $1
        sleep 1
    done
}

kcli t create datetime -p 1

# for partition in {0..1}; do
# 	produce $partition
# done

produce 0