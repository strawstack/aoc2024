export function queue() {

    let count = 0;
    let head = null;
    let tail = null; 

    function add(value) {
        count += 1;
        const e = {
            value,
            next: null
        };

        if (head === null) {
            head = e;
            tail = e;

        } else {
            tail.next = e;
            tail = tail.next;
        }
    }

    function pop() {
        count -= 1;
        const temp = head;
        head = head.next;
        return temp.value;
    }

    function size() {
        return count;
    } 

    return {
        add,
        pop,
        size
    };

}

function test() {
    let q = queue();
    q.add(1);
    q.add(2);
    q.add(3);
    console.log(q.size());
    console.log(q.pop());
    console.log(q.pop());
    console.log(q.pop());
    console.log(q.size());
}

// test();