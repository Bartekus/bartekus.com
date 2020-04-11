---
title: Learning Rust - Part 5
date: '2020-01-05'
spoiler: One type to rule them all; Slice to the rescue
---

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
