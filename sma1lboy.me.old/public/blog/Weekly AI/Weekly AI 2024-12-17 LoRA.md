## **LoRA and the `/v1/completions` Interface**

---

### 1. Background: Evolution of Model Fine-Tuning and the Role of LoRA

As large language models (LLMs) become widely adopted in various tasks, fine-tuning has emerged as an effective way to enhance model performance and adaptability. However, full fine-tuning often involves updating billions of parameters, resulting in high computational costs. This has led to the rise of parameter-efficient fine-tuning (PEFT) methods, with **Low-Rank Adaptation (LoRA)** being one of the most prominent.

#### Key Concept: What is LoRA?

- **LoRA** introduces small trainable low-rank matrices (e.g., A ∈ Rd×r, B ∈ Rr×k) into a model, allowing adaptation without modifying the original weights.
    
- Instead of updating the full model, only a small number of new parameters are trained, enabling fine-tuning under resource constraints.
    
- LoRA adapters can be dynamically loaded alongside a base model, or merged for deployment.
    

#### Comparison with Full Fine-Tuning

|Feature|LoRA|Full Fine-Tuning|
|---|---|---|
|Parameters trained|Very few (1–5%)|All parameters|
|Resource requirements|Low|High|
|Base model altered|No|Yes|
|Multi-task flexibility|Yes|No|
|Inference setup|Base model + adapter|Fully fine-tuned model|

#### Example: Using LoRA in `llama.cpp`

```bash
./main -m llama.gguf --lora lora.gguf -p "Your prompt"
```

---

### 2. Background: Code Completion Requirements and API Interface Differences

In tasks like code generation and autocomplete—particularly fill-in-the-middle (FIM) completion—precise control over the context is essential. Many code-specific models (e.g., `code-davinci-002`, StarCoder, Code Llama) are trained with built-in support for FIM prompt structures.

#### Purpose of `/v1/completions`

- The `/v1/completions` endpoint was designed for traditional text generation, where a single prompt leads to a continuation.
    
- It does not rely on system/user roles and does not support multi-turn interactions.
    
- It is particularly well-suited for tasks like code completion, document generation, summarization, and structured text generation.
    

#### Comparison with `/v1/chat/completions`

|Endpoint|Supported Models|Input Style|Suitable for FIM|
|---|---|---|---|
|`/v1/completions`|GPT-3, Codex, StarCoder, Code Llama|Plain text prompt|Yes|
|`/v1/chat/completions`|GPT-3.5, GPT-4|Role-based messages|No|

---

### 3. Background: FIM and Meta-Language Prompting

Many code-generation models are trained with internal meta-language tokens to support FIM completions. These tokens guide the model to understand where to insert new content:

```
<fim_prefix>...<fim_suffix><fim_middle>
```

- This structure tells the model: "Given the prefix and suffix, generate content for the middle."
    
- These tags are explicitly part of the training data for models like `code-davinci-002`, StarCoder, and DeepSeek-Coder.
    

#### Example Prompt

```json
{
  "model": "code-davinci-002",
  "prompt": "<fim_prefix>def greet(name):\n    print(f\"Hello<fim_suffix>!\")<fim_middle>\n    # greet someone\n",
  "max_tokens": 64
}
```

---

### 4. Background: Why `chat/completions` Is Not Recommended for FIM

- Models like GPT-3.5 and GPT-4 were not trained on `<fim_prefix>` or related meta-language tokens.
    
- Even with handcrafted message formats mimicking FIM behavior, chat-based models will lean toward dialog-driven generation rather than structural code insertion.
    
- In practice, results are less precise and harder to control compared to using `/v1/completions` with FIM-aware models.
    

---

### 5. Background: Industry Practice and Model Interface Compatibility

|Model|FIM Support|Prompt Format|Recommended API|
|---|---|---|---|
|`code-davinci-002`|Yes|`<fim_prefix>` etc.|`/v1/completions`|
|StarCoder|Yes|`<fim-prefix>`, `<fim-middle>`|`/v1/completions`|
|Code Llama|Yes|`<PRE>`, `<SUF>`, `<MID>`|Custom prompt style|
|GPT-3.5-turbo|No|None|`/v1/chat/completions`|
|GPT-4|No|None|`/v1/chat/completions`|
