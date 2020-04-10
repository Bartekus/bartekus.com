---
title: Learning Rust - Part 3
date: '2020-01-03'
spoiler: Using std::vec::Vec
---

As previously mentioned, there are some limitations to the use of arrays in rust due to their fixed size nature.
To alleviate this, rust provides us with a few mechanisms. 
The first we will talk about is the vector type in the standard library, std::vec::Vec25.
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

TTo put it in other terms, the type of a vector is Vec<T> where T is a generic type that represents the types of the elements.
Therefore, Vec<i32> and Vec<u8> are different types, but a Vec<u8> with four elements is the same type as one with five elements.
                                                            
Also, note that we are no longer explicitly calling iter on the numbers variable in our for loop preamble,
since Vec implements a trait that tells the compiler how to implicitly convert it into an iterator in places where that is necessary like in a for loop.

Next lets play with functions, and their arguments as we dive into ownership in Rust.
