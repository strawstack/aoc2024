use std::fs::read_to_string;

fn main() {
    let result = read_to_string("input.txt")
        .unwrap()
        .split("\n\n")
        .map(String::from)
        .map(|pack| {
            let data = pack.split("\n")
                .map(String::from)
                .collect::<Vec<String>>();
            let av = data[0].split(" ");
            av
        })
        .collect::<Vec<Vec<String>>>();

    println!("{:?}", result);
}