---
title: Rust in 7-steps
date: '2020-01-01'
spoiler: A practical intro to getting productive in Rust
---

## A practical intro to getting productive in Rust

> I hear I forget,
>
> I see I remember,
>
> I do I understand!

I don't know how about you, but I found Rust to be utterly lovely.

As such, I'm going to share with you what I've learned and how you too can get started in most straightforward and practical way.

<!--ts-->
   * [Step 1 - Getting started](#step-1)
   * [Step 2 - Looping over arrays](#step-2)
   * [Step 3 - Using std::vec::Vec](#step-3)
   * [Step 4 - Intro into ownership](#step-4)
   * [Step 5 - One type to rule them all](#step-5)
   * [Step 6 - Do one thing at a time, and do it well](#step-6)
   * [Step 7 - Keep it simple and test it](#step-7)
<!--te-->


### What are some of the highlights of Rust?

While these are a lot of features of Rust that make it great tool,
here are perhaps the most crucial ones (in my opinion):
- Performance
- Strong, static, expressive type system
- Great error messages
- Modern generics
- Memory safety
- Fearless concurrency
- Cross platform
- C interoperability


## Step 1
___
### Getting started

First get your environment [setup](https://www.rust-lang.org/tools/install)

Once you get a bit familiar with `rustup` & `cargo`, it's time to write our first program.

To start, in your favorite terminal execute:
> cargo new numbers

This will generate a binary project, so `cargo new numbers --bin` is equivalent of the above.
Alternatively you can also generate a binary project using the `cargo new numbers --lib` if you wish.

A binary project is one which compiles into an executable file,
while the library project is one which compiles into an artifact which is shareable and can be used as a dependency in other projects.

To run a binary projects code use:
> cargo run

To run a library projects code use:
> cargo build

If you look into the generated structure of `numbers` directory, it should look like this:
```
.
├── Cargo.toml
└── src
    └── main.rs
```

Inside `main.rs` we'll find:
```rust
fn main() {
    println!("Hello, world!");
}
```
Few things to observe here:
- The syntax here says define a function (fn) with the name main which takes zero arguments and returns the empty tuple ().
- The body of the function calls a macro println which prints its argument "Hello, world!" to standard out followed by a newline.

So what are macros and how can we tell the difference between regular function and a macro?
- Macros are a powerful form of meta-programming in Rust.
- We know it is a macro invocation and not a normal function call because of the trailing ! in the name.

Whats the difference?
- To put it simply, in rust, a macros can take a variable number of arguments, while a regular function cannot.

Going back to `Cargo.toml`, which is a TOML format based manifest file that serves as entry point for describing our project
as well as specifying its dependencies and configuration.

Here is how mine looks like:
```
[package]
name = "numbers"
version = "0.1.0"
authors = ["bartekus <bartekus@gmail.com>"]
edition = "2018"

[dependencies]
```

In Rust, the primary unit of code organization is called a crate which can be distributed to the community via crates.io.
Crates in Rust are analogous to gems in Ruby or packages in JavaScript.

One thing to notice here is that a crate can contain both a library and an executable.

The binary part of the crate is typically responsible for argument parsing and configuration,
and then calls into the functionality exposed by the library part of the crate.

With that in mind, let create a library by creating new file under `src` directory called `lib.rs`.
Like `main.rs` which is the default entry point for defining binary crate, `lib.rs` is the default entry point for defining library crate.

Inside it, lets use this code:
```rust
pub fn say_hello() {
    println!("Hello, world!");
}
```
Important thing to notice here is the `pub` privacy identifier which specifies that this function should be publicly accessible to user’s of our crate.
This is same for both, our binary as well as anyone else utilizing our library as dependency.

Next lets refactor our `main.rs` file to use our library's `say_hello` function.
```rust
fn main() {
    numbers::say_hello();
}
```

Once you execute the `cargo run` you will see that it produces exactly the same output as before.

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/e4232e8a54e1708fca58e2f7a0adc53bf306e071)


## Step 2
___
### Looping over arrays

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

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/6abb27b8346f421d4a61579bcba8817df4fe0a4f)


## Step 3
___
### Using std::vec::Vec

As previously mentioned, there are some limitations to the use of arrays in rust due to their fixed size nature.
To alleviate this, rust provides us with a few mechanisms. 
The first we will talk about is the vector type in the standard library, **std::vec::Vec25**.
A vector is similar to an array as we've learned, in that it stores a single type of element in a contiguous memory block.
However, the memory used by a vector is heap allocated (as opposed to array which is a stack allocated) and can therefore grow and shrink at runtime.

Lets refactor our library print function to use vector:

> src/lib.rs
```rust
pub fn print() {
    let numbers = vec![1, 2, 3, 4, 5];

    for n in numbers {
        println!("{}", n);
    }
}
```
As you can notice, vec is a macro (since it has `!` as a suffix) that we call in order to construct a vector with the given values.
While this does look similar to the array version, the difference is in the details.

Vectors own their data elements,
they have a length which says how many elements are in the container,
and they also have a capacity which could be larger than the length.

Changing the capacity can involve quite a bit of work to allocate a new region of memory and move all the data into that region.
Indeed, as you add elements to a vector,
the capacity grows by a multiplicative factor to reduce how frequently this process needs to take place.

The biggest advantage is that you do not need to know upfront how large the vector needs to be;
the length is not part of the type. This is in contrast to arrays, which if you recall, have their size included as part of their type.

To put it in other terms, the type of a vector is `Vec<T>` where `T` is a generic type that represents the types of the elements.
Therefore, `Vec<i32>` and `Vec<u8>` are different types, but a Vec<u8> with four elements is the same type as one with five elements.
                                                            
Also, note that we are no longer explicitly calling iter on the numbers variable in our for loop preamble,
since Vec implements a trait that tells the compiler how to implicitly convert it into an iterator in places where that is necessary like in a for loop.

Next lets play with functions, and their arguments as we dive into ownership in Rust.

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/bdbc82fd43fd53e46bec746c0e983fe222e3d5a8)


## Step 4
___
### Intro into ownership

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
    output_sequence(numbers); // <- Will error here
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

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/547465760ced4cea729216587a1570ad10724e9b)


## Step 5
___
### One type to rule them all

While there is always more than one way to resolve any problem,
usually the most appropriate one is the one which solves the problem without inducing too much complexity or overhead.

Indeed, we know that our previously mentioned problem hinged on `output_sequence` function type signature.

We also know that both arrays and vectors are list types that represent a sequence of things.

So if we look at the Rust docs regarding [Primitive Type array](https://doc.rust-lang.org/1.30.0/std/primitive.array.html),
we'll come across the following:
> Arrays coerce to slices ([T]), so a slice method may be called on an array.

Ok, that's interesting lets follow the link to [Primitive Type slice](https://doc.rust-lang.org/1.30.0/std/primitive.slice.html),
where we'll learn that:
> A slice is a dynamically-sized view into a contiguous sequence.

Next lets check the referred to [Module std::slice](https://doc.rust-lang.org/1.30.0/std/slice/index.html),
here we'll find our answer:
```rust
// slicing a Vec
let vec = vec![1, 2, 3];
let int_slice = &vec[..];
// coercing an array to a slice
let str_slice: &[&str] = &["one", "two", "three"];
```
Bingo, this should do the trick, so let sum up what we've learned so far about a slice:

 - it's a reference to (or "view" into) an array.
 - useful for allowing safe, efficient access to a portion of an array without copying.
 - by nature its not created directly, but from an existing variable.
 - have a length, can be mutable or not, and in many ways behave like arrays.

Great, we can have a slice which references an array or a vector and treat them the same.

Let’s change the signature of output_sequence to take a reference to a slice,
and change print to show that it works with both arrays and vectors:
> src/lib.rs
```rust
pub fn print() {
    let vector_numbers = vec![1, 2, 3, 4, 5];
    output_sequence(&vector_numbers);

    let array_numbers = [1, 2, 3, 4, 5];
    output_sequence(&array_numbers);
}

fn output_sequence(numbers: &[u8]) {
    for n in numbers {
        println!("{}", n);
    }
}
```

> A slice of u8 values has type [u8].

This represents a type with an unknown size at compile time.

> The Rust compilation model does not allow functions to directly take arguments of an unknown size.

In order to access this slice of unknown size with something of a known size we use indirection and pass a reference to the slice rather than the slice itself.

> A reference to a slice of u8 values has type &[u8] which has a known size at compile time.

This size is known because it is equal to the size of a pointer plus the length of the slice.

> Note that slices convert automatically into iterators just like vectors so we again do not call `iter` explicitly in the body of our function.

This takes care of the signature of `output_sequence` however the way we call this function from `print` has changed as well.

> Notice that we have added an `&` before the variable names that are passed to `output_sequence`.

You can think of this as creating a slice that represents `read-only access` to the entire sequence for both the `vector` and `array`.

However, this small change in how we call the function allows us to handle vectors and arrays equally well.

> Idiomatic Rust takes slices as arguments in most cases where one needs only to read the collection.

The major difference here is that we are no longer `transferring ownership` into the function `output_sequence` instead we are `lending read-only access` to that function.

> The data is only borrowed for the duration of the function call.

The idea of `ownership` and `borrowing` is a core part of the Rust language and is something we need to be especially aware.

Next lets have a look at few other important Rust language features.

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/1f5db6410a7e1aa60df6345af30de7136f1ccafb)


## Step 6
___
### Do one thing at a time, and do it well


> As `software engineers` we ought to `strive to be pragmatic and prudent` in problem solving.
> Our approach should be deliberate in planning yet methodical in execution.

It's never a bad idea to slightly future proof our code while also making it also easier to maintain by breaking it apart.
Giving ourselves some room to re-use existing code will reduce future duplicate code and functions.

> #### Modularity and compositionality go a long way.

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

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/3c18d4f842552460b1bc8b2b974978b5f91b7d1e)


## Step 7
___
### Keep it simple and test it


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

The current code used here can be found on [my github](https://github.com/bartekus/rust-in-7-steps/tree/e0485e8c59060dccd6ddc850f97169c2522f000e)

> ## Rust is awesome, now lets build something!
