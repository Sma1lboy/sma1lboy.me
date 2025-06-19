---
Date: 2024-10-04
---

The purpose of this article is to provide students who already know how to use Vim basics, but want to operate without leaving the keyboard in more situations.
Here we will summarize the most common scenarios.

Common shortcuts:
```plain
$ means last char of current line
0 means first index of current line
^ means first non-white space index of current line
gg means head of file
G means end of file
<c-f> next page
<c-b> prev page
try H M L
w to next word first char
b when at middle of char, go to first char, when at first char, go to prev word
```

Jumping between brackets:
```plain
[[ //prev block
]] //next block
]) ]} ]>
[( [{ [< //jump to next or prev second char
```

Swapping two lines:
```plain
ddp
```
![](https://61f32d1.webp.li/2025/03/20250328193602800.gif)

Inserting repeated code:
```plain
(repeat numbers) -> a -> (content) -> esc
```
![](https://61f32d1.webp.li/2025/03/20250328193602823.gif)

Deleting content inside brackets (large, medium, small, ", '):
```plain
d/c -> i -> (/[/{/"/' also back bracket works as well
```
![](https://61f32d1.webp.li/2025/03/20250328193602837.gif)

Auto-align:
```plain
(selection) -> =
```
![](https://61f32d1.webp.li/2025/03/20250328193602850.gif)
