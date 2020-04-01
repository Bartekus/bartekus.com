---
title: Learning Rust - Part 1
date: '2020-01-01'
spoiler: Basic intro into Rust
---

For some reason I never felt really compelled to learn C/C++, but there's something about Rust that really draws me in.
As I'm learning more and more about it, I figured it would be of some benefit to write about the whole process.
If for no other benefit that to memorize the `gochas` and shed more light on what the experience has taught me.

What are some of the highlights of Rust? While these are a lot of features of Rust that make it great tool, here are perhaps the most crucial ones (in my opinion):
- Performance
- Strong, static, expressive type system
- Great error messages
- Modern generics
- Memory safety
- Fearless concurrency
- Cross platform
- C interoperability

To get started, get your environment [setup](https://www.rust-lang.org/tools/install)

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
as well as specifying its dependencies and configuration. Here is how mine looks like:
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

The current code used here can be found on [my github](https://github.com/bartekus/learning-rust/tree/master/01-numbers)

Next let jump thru some loops ;)
