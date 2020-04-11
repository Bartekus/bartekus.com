---
title: Learning Rust - Part 4
date: '2020-01-04'
spoiler: Intro into ownership
---

Now since we mentioned that vectors own their data elements, lets dive deeper into ownership by way of exploring what that really means.

For reference, our `main.rs` file is still the same as it was:
> src/main.rs
```rust
fn main() {
    numbers::print();
}
```

So first let refactor our library print function into two, while also reverting to using array for the collection:
> src/lib.rs
```rust
pub fn print() {
    let numbers = [1, 2, 3, 4, 5];

    output_sequence(numbers);
}

fn output_sequence(numbers:[u8;5]) {
    for n in numbers.iter() {
        println!("{}", n);
    }
}
```

As you can see, our `output_sequence` needs to have its input type `[u8;5]` fully specified,
since type inference does not operate on function signatures.

Suppose we want to use a vector inside print instead, so we change the code to:
> src/lib.rs
```rust
pub fn print() {
    let numbers = vec![1, 2, 3, 4, 5];

    output_sequence(numbers);
}

fn output_sequence(numbers:Vec<u8>) {
    for n in numbers {
        println!("{}", n);
    }
}
```
Notice how we had to change the `output_sequence` functions input type too,
since if you recall arrays and vectors are of two different types.

So what if we wanted to call the `output_sequence(numbers)` twice in our `print()` function?
For our initial array based implementation a simple addition of second `output_sequence(numbers)` would suffice:
> src/lib.rs
```rust
pub fn print() {
    let numbers = [1, 2, 3, 4, 5];

    output_sequence(numbers);
    output_sequence(numbers);
}

fn output_sequence(numbers:[u8;5]) {
    for n in numbers.iter() {
        println!("{}", n);
    }
}
```

Indeed, this will work, however if we were to try the same with vector based implementation:
> src/lib.rs
```rust
pub fn print() {
    let numbers = vec![1, 2, 3, 4, 5];

    output_sequence(numbers);
    output_sequence(numbers);
}

fn output_sequence(numbers:Vec<u8>) {
    for n in numbers {
        println!("{}", n);
    }
}
```
What we are going to get here is an error:
```bash
error[E0382]: use of moved value: `numbers`
 --> src/lib.rs:5:21
  |
2 |     let numbers = vec![1, 2, 3, 4, 5];
  |         ------- move occurs because `numbers` has type `std::vec::Vec<u8>`, which does not implement the `Copy` trait
3 |
4 |     output_sequence(numbers);
  |                     ------- value moved here
5 |     output_sequence(numbers);
  |                     ^^^^^^^ value used here after move
```

Rust has few different modes when it comes to passing arguments to functions,
and what's going to be crucial to understand is that it differentiates between:
- a function temporarily having access to a variable (borrowing)

and

- having ownership of a variable

Another aspect at play here is whether the function can mutate the input.

Indeed, the default behavior is for a function to take `input by value and hence ownership` of the variable is moved into the function.

The exception to this rule being if the type implements a special trait called Copy,
then the input is copied into the function,
and therefore the caller still maintains ownership of the variable.
 
If the element type of an array implements the Copy trait,
then the array type also implements the Copy trait.

So going back to the error, we can deduce that since `std::vec::Vec<u8>` does not implement `Copy` trait,
the ownership of `numbers` has been moved from `print` function to `output_sequence`,
and as such the subsequent attempt to use `numbers` again inside the `print` function has failed and cause an error.

That being said, aside from using `iter()` the only thing that changed about our `output_sequence` function is its type signature.

Next, lets explore how we can make this work for arrays and vectors with minimal changes to existing code.
