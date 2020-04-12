---
title: Learning Rust - Part 6
date: '2020-01-06'
spoiler: Do one thing at a time, and do it well.
---

> As `software engineers` we ought to `strive to be pragmatic and prudent` in problem solving.
> Our approach should be deliberate in planning yet methodical in execution.

It's never a bad idea to slightly future proof our code while also making it also easier to maintain by breaking it apart.
Giving ourselves some room to re-use existing code will reduce future duplicate code and functions.

### Modularity and compositionality go a long way.

To help make it more flexible,
instead of printing out one through five,
let’s take a number as input and print from one up to that value.

This means that a small refactor will be required in the `main.rs` file:
> src/main.rs
```rust{2}
fn main() {
    numbers::print(5);
}

```

We will keep the changes in our `lib.rs` to a minimum, so our `output_sequence` function will stay as is,
while we implement `generate_sequence` helper function which takes a limit as an input and outputs a vector.
Finally, our `print` function will then just combine these two parts to achieve the effect we're after.
> src/lib.rs
```rust
pub fn print(limit: u8) {
    let numbers = generate_sequence(limit);
    output_sequence(&numbers);
}

fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}

fn output_sequence(numbers: &[u8]) {
    for n in numbers {
        println!("{}", n);
    }
}
```

So let's go over what we've done for better clarity, and to get familiar with few other Rust concepts that we've used.

In `print` we bind a variable to the result of calling `generate_sequence` with the `limit` passed to us as the argument,
```rust{2}
pub fn print(limit: u8) {
    let numbers = generate_sequence(limit);
    output_sequence(&numbers);
}
```
then we call `output_sequence` as before passing a reference to a `slice` backed by the variable `numbers` we just created.
```rust{3}
pub fn print(limit: u8) {
    let numbers = generate_sequence(limit);
    output_sequence(&numbers);
}
```

The new function `generate_sequence` takes an input argument `limit`, and returns a `Vec<u8>`.
```rust{1}
fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}
```

First we create a new vector with `Vec::new()` which by default is the same as one created with `vec![]`,
and **does not allocate**, so unless you actually put something into it, **it does not use any memory**.

*new() denotes by convention a function that returns a new instance of a type*
```rust{2}
fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}
```

In the code above, we see a new keyword being used, `mut`.

**Mutability is a property of the variable or reference not of the object itself.**

We declare `numbers` to be a `mutable variable` that holds an `empty vector`.
This allows us to later call `numbers.push(n)` because `push` is a method that `requires the receiver to be mutable`.
Removing the mut from the let binding will result in a compiler error when we try to push.

In order to generate the numbers starting at `1` up to our `limit`, we use a `for loop`,
but this time the iterator is a `Range` object,
specifically an [InclusiveRange](https://doc.rust-lang.org/std/ops/struct.RangeInclusive.html).

*Ranges can be constructed with using the syntax `start..end` or `start..=end`*

```rust{3}
fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}
```

Both start and end are optional, and if you have neither, i.e. .., then you also cannot have the = sign.
By default the range is `inclusive on the left` (i.e. includes start), and `exclusive on the right` (i.e. does not include end).

*The = after the two dots makes it so the range includes the end point.*

**We want the numbers starting at `1` up to `limit`, `including the limit`, so we use `1..=limit`.**

Iterating over this range,
we push each value onto the end of our vector which causes heap allocations every time there is not enough capacity to extend the length.

```rust{4}
fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}
```

Finally, we want to return this vector from our function.

The final expression in a `generate_sequence` function (`numbers`) is implicitly returned so there is no need for an explicit return statement.

However, note the lack of semicolon at the end of the last line of this function.

```rust{5}
fn generate_sequence(limit: u8) -> Vec<u8> {
    let mut numbers = Vec::new();
    for n in 1..=limit {
        numbers.push(n);
    }
    numbers
}
```

**The expression that evaluates to the vector numbers is written without a semicolon and means to return that value.**

*If we had written a semicolon, that would be a statement whose value is () which is not what you want to return.*

This is a common error so the compiler is smart enough to tell you what to fix, but it is nonetheless an error.

> You can use a return statement to return early from a function,
> but using the last expression of the block as the implicit return is idiomatic Rust.

Next, let's see how else we can improve our code.
