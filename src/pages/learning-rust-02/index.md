---
title: Learning Rust - Part 2
date: '2020-01-02'
spoiler: Looping over arrays
---

Since we now have a basic grasp of code structure and execution, lets keep the fun going and do some refactoring.
Let say we would want a list of numbers to be printed to screen, from 1 to (and including) 5.

> src/main.rs
```rust
fn main() {
    numbers::print();
}
```

> src/lib.rs
```rust
pub fn print() {
    let numbers = [1, 2, 3, 4, 5];
    for n in numbers.iter() {
        println!("{}", n);
    }
}
```
This should do it, and while we could use `for n in 0..numbers.len()` it would not be optimal,
since the check `numbers.len()` would be performed on each iteration.
In addition, we would have to call the print macro like so: `println!("{}", numbers[n]);` 

One thing to notice here is the use of placeholders for variables `{}` (there is also debugging variant `{:?}`).
This is what's called `Display` trait which provides a 'nice' format and enables `println!` to accept variable as input.
Indeed, if you tried to `println!(n);` you'd get an error since the first argument to the print macro has to be a literal string.

Another thing to notice here is our use of `iter` method on our array.
Rust abstracts the idea of iteration into yet another trait, this one called `Iterator`.
We have to call iter here to turn an array into an Iterator because arrays do not automatically coerce into into an Iterator.
Functions that can operate on themselves can be called using dot syntax.
This is syntactic sugar for a direct function call with the receiver object as the first argument.

Furthermore, arrays as well as vectors in Rust are a homogeneous container (all elements have the same type),
with a difference that the former is of fixed size while the latter is resizable.
Fixed size at compile time, while being advantageous when it comes to being able to be stack allocated instead of heap allocated,
renders array not very useful choice for data which might need to grow or shrink or contain an unknown numbers of items.

Lastly if you look at this code in an IDE, you'll also notice that rust infers the type of elements of the numbers array as `i32` with length size of `5`.
> For reference:
>
> `let numbers : [i32;5] = [1, 2, 3, 4, 5];`

If you are curious why that happens, keep in mind that `i32` means a signed (can be positive or negative) integer that takes 32 bits of space,
and add the following under our numbers definition, followed by running `cargo run` command:
> let numbers = [1, 2, 3, 4, 5];
>
> `let () = numbers;`

What you'll get is an error[E0308] along with explanation:
> expected array `[{integer}; 5]`, found `()`

So what can we conclude from this?
While rust has twelve integers types which depend on size and whether it is signed or unsigned, the `i32` is the default one. 

If we were to define type ourselves, we could do it exactly how IDE would infer it, that is:
> `let numbers : [u8;5] = [1, 2, 3, 4, 5];`

Alternatively we can do it like this also:
> `let numbers = [1u8, 2, 3, 4, 5];`

In both cases we specify that we'd want our numbers to be u8, or 8-bit unsigned integer.

If there is one aspect regarding arrays, and their types to remember here, is that their size is in fact part of their type.
That is [1u8, 2, 3, 4, 5] is not the same type as [1u8, 2, 3, 4] since the former is [u8;5] while the latter is [u8;4].

Next lets look into previously mentioned vectors.
