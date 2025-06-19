---
title: 'Weekly AI 2024-12-17 Transformer'
date: '2024-12-17'
---

这是第一篇Weekly AI，主要是帮助我更快更好的整理对现有AI体系的理解，也希望能帮到看到这篇文章的你～

本周主要研究了 **Transformer** 架构。

---

# Transformer 基础架构

**Transformer** 是一个基于注意力机制的编码器-解码器架构：

- 编码器的输出是输入的连续向量表示（continuous vector representation）。
- 解码器获取该连续向量，并逐步生成输出，同时参考前一个输出。

## Inputs 部分详解

### Inputs Embedding

- 将输入的每个单词转换成向量
- 每个 token 被映射到高维向量空间（通常 768 维）
- 向量通过反向传播不断优化，捕获词的语义信息

### Position Embedding

- `inputs embedding + positional encoding => positional input embeddings`
- 使用三角函数实现位置编码：

  ```python
  PE(pos,2i) = sin(pos/10000^(2i/d_model))
  PE(pos,2i+1) = cos(pos/10000^(2i/d_model))
  ```

````

- 奇数 time step 使用正弦，偶数 time step 使用余弦
- 这种设计允许模型学习相对位置关系

### Encoder Layer

- 将所有序列映射为 continuous vector
- 包含整个序列的语义信息

---

## 注意力机制

注意力机制是 Transformer 的核心创新，通过计算不同位置间的关联性来处理序列信息。

**Query、Key、Value 三者关系**：

- **Query**：当前位置的查询向量
- **Key**：可能被关注位置的索引向量
- **Value**：实际的信息内容

计算方式：

```python
Attention(Q,K,V) = softmax(QK^T/√dk)V
````

- 除以√dk 为了控制梯度，防止 softmax 进入饱和区
- softmax 确保所有注意力权重和为 1

![](https://61f32d1.webp.li/2025/03/20250328193628862.png)

---

# RNN (循环神经网络, Recurrent Neural Network) 是什么？

RNN 模拟人阅读句子时的过程：

1. 记住之前读过的内容
2. 用之前的内容来理解当前的词
3. 更新记忆

## RNN 的基本原理

```python
h_t = tanh(W_h * h_{t-1} + W_x * x_t + b_h)
y_t = W_y * h_t + b_y
```

- `h_t`：当前时刻的隐藏状态（新记忆）
- `h_{t-1}`：上一时刻的隐藏状态（旧记忆）
- `x_t`：当前输入
- `W_h, W_x, W_y`：权重矩阵
- `b_h, b_y`：偏置项
- `tanh`：激活函数

**记忆更新与输出生成**：

```python
新记忆 = f(当前输入 + 旧记忆)
输出 = g(新记忆)
```

### RNN 的工作举例

句子 "我喜欢猫"：

- **第1步**: 输入"我"
  - 记忆：记住"我"
  - 输出：这是一个人称代词
- **第2步**: 输入"喜欢"
  - 记忆：与"我"的上下文关联
  - 输出：正面情感
- **第3步**: 输入"猫"
  - 记忆：理解"我喜欢猫"
  - 输出：完成一个喜爱表达

### RNN 的主要问题

- 长期依赖问题：句子越长，前面的信息越容易丢失
- 序列处理速度问题：必须按顺序处理，无法并行

### 生活中的比喻

RNN 就像透过小孔读长卷轴：

- 一次只能看到一个字
- 靠记忆理解整体含义
- 读到最后时开头可能已模糊

---

## 注意力机制和 RNN 的本质区别

**计算并行性**：

- **RNN**：必须一个接一个处理
  ```python
  输入1 -> 处理 -> 输入2 -> 处理 -> 输入3 -> 处理
  ```
- **注意力机制**：可同时处理所有输入
  ```python
  [输入1, 输入2, 输入3] -> 并行处理
  ```

**长距离依赖**：

- **RNN**：信息传递链条式，距离越远越模糊
- **注意力机制**：任意词之间直接建立联系，无需多步传递

实际例子："我昨天在商场买了一个蓝色的书包"：

- **RNN**：读到"书包"时，"我"的信息可能已变得模糊。
- **注意力机制**：可以直接关联"书包"与"买"、"蓝色"与"书包"，并且并行完成。

---

## 多头注意力机制 (Multi-head Attention)

- **单头注意力**：一个人看问题，一种理解
- **多头注意力**：多个人同时看问题，多种视角合并成更全面的理解

```python
head_i = Attention(W_i_q * Q, W_i_k * K, W_i_v * V)
MultiHead(Q, K, V) = Concat(head_1,...,head_h)W_o
```

类比看电影：

- 有人关注剧情发展
- 有人关注人物对话
- 有人关注场景细节

最后合并，形成整体理解。

---

## 自注意力 (Self-Attention)

**普通注意力**：两个不同序列之间的关系  
**自注意力**：序列内部元素之间的关系

```python
Q = W_q * X
K = W_k * X
V = W_v * X
Self_Attention = softmax(QK^T/√d_k)V
```

例子："我昨天买了一个蓝色的书包"：

- 自注意力分析句子内部所有词之间的关联。

在编码器中，自注意力可看整个句子；在解码器中，自注意力只能看已生成的内容。

---

# BERT (Bidirectional Encoder Representations from Transformers)

BERT 的核心创新在于其预训练策略和双向特性。

1. 架构：

   - 使用 Transformer 编码器部分（双向）
   - BERT-base：12层编码器，768隐藏维度，12头注意力
   - BERT-large：24层编码器，1024隐藏维度，16头注意力

2. 预训练任务：

   - **Masked Language Model (MLM)**：随机遮盖15%输入token，模型需预测遮盖词
   - **Next Sentence Prediction (NSP)**：预测两个句子是否相邻，理解句间关系

3. 输入表示：

   - Token Embeddings
   - Segment Embeddings
   - Position Embeddings 三者相加得到最终输入

---

# GPT (Generative Pre-trained Transformer)

GPT 系列是生成式 AI 的重要进展：

1. 架构特点：

   - 使用 Transformer 解码器部分
   - 单向注意力（只看左侧内容）
   - 逐 token 生成文本

2. 演变历程：

   - GPT-1：初步证明大规模语言模型预训练有效性
   - GPT-2：扩展模型规模（1.5B参数），改进文本生成质量
   - GPT-3：175B参数，few-shot 学习能力，多任务处理

3. 预训练策略：

   - 自回归语言建模（预测下一个token）
   - 使用因果掩码确保单向注意力

---

# BERT vs GPT: Transformer的两个分支

## BERT 基础回顾

- 双向的：同时看到句子前后文
- 预训练目标：MLM + NSP

## BERT 和 GPT 的关系与区别

**共同点**：

- 基于 Transformer
- 预训练-微调范式
- 大规模语言建模

**区别**：

- 架构选择：BERT(编码器，双向) vs GPT(解码器，单向)
- 预训练任务：BERT(MLM+NSP) vs GPT(自回归建模)
- 应用场景：
  - BERT擅长理解任务
  - GPT擅长文本生成

---

# BERT 独特优势及与 GPT 的比较

在理解任务上 BERT 更高效。在纯理解任务中，BERT 相比 GPT 更轻量和高效，而 GPT 则通过大型模型和多阶段推理来弥补单向性限制。

## BERT 在代码语义分析场景的优势

- 双向上下文，更快理解函数整体语义
- 对小段代码（如函数体补全）特别有效

## ChatGPT vs BERT 的处理流程对比

- BERT：一步到位理解，资源消耗小
- ChatGPT：多步骤处理（理解-生成-验证），需要更多资源

---

# More About BERT

## BERT 在轻量级代码生成中的应用

- 适用于短块代码生成
- 模型小、内存低、推理快

示例：

```python
def calculate_[MASK]_stats(data):
    return data.[MASK]([MASK])
```

## BERT 在 FIM (Fill In the Middle) 场景的优势

- 双向理解能力，让补全更符合上下文
- 在需要快速响应和资源受限的环境中表现优异

示例：

```python
def process_data[MASK]transform[MASK]return results
```

BERT 能通过同时查看 prefix 和 suffix 做出更合理的中间补全。

---

## 市场现状与解决方案对比

- 市场主流：GPT类模型（Copilot, CodeWhisperer, InCoder, TabNine）
- 它们大多基于自回归模型，而非纯 BERT 方案
- BERT 主要在理解层面表现出色，生成长序列时不如自回归模型流畅和连贯

---

# What is input/output embedding

**Embedding**：

- 是一个将对象（如词、token）映射到向量空间的过程
- 向量包含深层语义信息，表示输入之间的关系和相似性
