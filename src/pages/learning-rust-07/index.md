---
title: Learning Rust - Part 7
date: '2020-01-07'
spoiler: However let's keep it simple...
---

Previously we've implemented `generate_sequence` without taking advantage of Rust provided constructs.
> src/lib.rs
```rust
fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}
```
         
In the process we've learned about object *construction*, *mutability*, and *ranges*.

However, when working on real life projects, we certainly would try to avoid reinventing the wheel.

Indeed, Rust has powerful *generic programming facilities*, in fact thanks to its **traits** capabilities, Rust is **Turing-complete**.

So going back to our code, we're going to utilize `collect()` function, which can be used to turn any iterator into basically any collection.

Now let us refactor our `generate_sequence` function using [collect](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.collect) method.
> src/lib.rs
```rust
fn generate_sequence(limit: u8) -> Vec<u8> {
    (1..=limit).collect()
}
```

We end up simplifying our function a lot by using `collect` to directly turn one collection (a range) into another collection (a vector).

One of the keys to collect()'s power is that many things you might not think of as 'collections' actually are.
For example, a [String](https://doc.rust-lang.org/std/string/struct.String.html) is a collection of [chars](https://doc.rust-lang.org/std/primitive.char.html).

Because collect() is so general,
it can cause problems with type inference,
so you might find the need to use the syntax **collect::<SomeType>()** to help the compiler know what you want.

This syntax,
affectionately known as the *turbofish*: **::<>** helps the inference algorithm understand specifically which collection you're trying to collect into.

In our case however, because we return the result of calling collect from our function,
type inference sees that the return type needs to be a `Vec<u8>` and ensures that collect generates that collection,
without us having to specify it using *turbofish* syntax.

### What about testing!?

Indeed, testing is very important, so I'm going to cover it in more depth at some point later.
However, I'm going to leave you with an example that will showcase how easy it is,
so that you can start testing your code right away.

We are going to add `generate_sequence_should_work` function to our existing code:
> src/lib.rs
```rust
#[test]
fn generate_sequence_should_work() {
    let result = generate_sequence(3);
    assert_eq!(result, &[1, 2, 3]);
}
```
As you can see, it's just a normal function with a special attribute, **#[test]** preceding it.

*In Rust, this attribute is quite common as it is used for a variety of purposes,
and comes in two forms `#[...]` and `#![...]`.*

Inside of test functions there are a series of macros you can use for asserting facts about your system.

We're using **assert_eq** to ensure that the output of our `generate_sequence` function is what we expect it to be.

Next, we're going to run it:
> cargo test

```bash
   Compiling numbers v0.1.0 (/Users/bart/Dev/_rust_/learning-rust/numbers)
    Finished test [unoptimized + debuginfo] target(s) in 1.18s
     Running target/debug/deps/numbers-c787d951d057183e

running 1 test
test generate_sequence_should_work ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```
Yay, everything works!

Rust is awesome, now lets build something!
