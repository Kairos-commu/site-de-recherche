---
title: "Tool-calling failure modes on local models — a field catalogue"
label: "Catalogue · living document"
description: "Every way a local model has broken tool calling in one real agent, September 2026, with the mechanical guard that stopped each one. Observed on gpt-oss:20b, qwen3.5:9b and gemma4:12b through Ollama."
published: "2026-09-06"
readingTime: "12 min"
keywords:
  - tool calling
  - local LLM
  - Ollama
  - agent reliability
  - gpt-oss
  - gemma
---

This is a catalogue, not an essay. Each entry is one way the local model driving my desktop
assistant, Kora, failed to call a tool correctly — and the guard that was built after the
failure was diagnosed from the traces. I keep it because the same failures keep coming back
under new names, and because most of them are **not fixable from the prompt**: on a 12B to
20B model, an instruction that contradicts the model's habit does not hold. What holds is a
mechanism.

Some context so the entries make sense. Kora runs on a single agent loop: one system prompt,
about twenty tools (web search, file reads and writes in a sandbox, opening things on the
PC, delegating to a cloud model, writing to a memory file), a per-tool confirmation policy,
and a JSONL trace of every request, tool call, rejection and final answer. Every entry below
was found by reading that trace, never by guessing.

Longer write-ups are linked where they exist. Dates are 2026.

## How to read an entry

**Symptom** is what the user saw. **Mechanism** is what the trace and the code showed.
**Guard** is what now prevents it — always something mechanical: a regex on the model's own
output, a signature check, a budget, a field the app fills in itself. When a prompt change
was tried first and failed, the entry says so.

## 1. The infrastructure was lying

<div class="failure">
<h3>No tool definitions were being sent at all — for two days</h3>
<p><strong>Symptom</strong> The model "opens Documents" fine and fails on "Images" four times in a row. Argument names guessed wrong, enums ignored, calls written in a made-up syntax.</p>
<p><strong>Mechanism</strong> The streaming request path copied <code>format</code>, <code>think</code> and <code>temperature</code> to the IPC call by hand — and not <code>tools</code>. The model knew the tools only from prose in the system prompt and improvised the call format. The audit that morning had blamed the chat template and the model. The real prompt weighed 4,700 tokens; the same prompt rebuilt outside the app with tools weighed 10,400.</p>
<p><strong>Guard</strong> One options builder shared by both request paths, and an end-to-end test that drives the streaming path with a stubbed transport and asserts the tools reach it. Rule learned: compare the size of the prompt the server actually received with what you think you sent, before diagnosing the model.</p>
</div>

<div class="failure">
<h3>A timeout that cancels nothing</h3>
<p><strong>Symptom</strong> The user asks for one poem and receives two. VRAM stays high for a minute after the answer.</p>
<p><strong>Mechanism</strong> <code>Promise.race([loop(), timeout])</code> decides who answers the caller; it never aborts the loser. The loop kept generating for 43 seconds after the fallback model had already replied, streaming into a bubble nobody cleaned up.</p>
<p><strong>Guard</strong> The timeout is an <code>AbortController</code> combined with the user's stop button, propagated down to the HTTP request. The round in flight is cut, not orphaned.</p>
</div>

<div class="failure">
<h3>The last allowed round's tool call was thrown away</h3>
<p><strong>Symptom</strong> A task that needs eight rounds fails with an empty answer, although the eighth round contained the correct call.</p>
<p><strong>Mechanism</strong> The round cap was checked <em>before</em> executing the round's tool calls, so a budget of 8 rounds was really 7 usable ones.</p>
<p><strong>Guard</strong> Check the cap after executing the calls. The cap only forbids starting another LLM round.</p>
</div>

<div class="failure">
<h3>A fresh round budget on every retry — 32 rounds for one message</h3>
<p><strong>Symptom</strong> Median 5 rounds per message, tail up to 37. The tail is where the cost and the VRAM pressure live.</p>
<p><strong>Mechanism</strong> Four single-shot retry guards (see below) each called the loop again with a brand-new budget of 8.</p>
<p><strong>Guard</strong> A total budget per user message; each relaunch gets what is left, and a relaunch with fewer than two rounds left is skipped entirely — it cannot succeed, it can only burn time.</p>
</div>

## 2. The model does not respect the schema

<div class="failure">
<h3>Argument names drift, and drift again</h3>
<p><strong>Symptom</strong> <code>write_file</code> rejected 4 times with identical arguments: <code>{path, text}</code> instead of <code>{filename, content}</code>. Later <code>file_path</code>, <code>file_name</code>, <code>name</code>. For delegation: <code>content</code>, <code>prompt</code>, <code>message</code>, <code>text</code> instead of <code>task</code>.</p>
<p><strong>Mechanism</strong> The same concept had two names across the tool set (<code>path</code> for reads, <code>filename</code> for writes). A model that gets the same rejection four times does not change its answer.</p>
<p><strong>Guard</strong> An alias table applied before validation: an equivalent, unambiguous key is normalised, never rejected. A correctly-named key is never overwritten by its alias. Rejecting and hoping the model self-corrects is not a strategy — the trace shows it never did.</p>
</div>

<div class="failure">
<h3>A cosmetic required argument blocks valid calls</h3>
<p><strong>Symptom</strong> <code>open_site_search</code> fails 6 times out of 7 in one exchange.</p>
<p><strong>Mechanism</strong> The <code>reason</code> field only feeds the confirmation dialog; execution never reads it. It was <code>required</code> in validation, so a call that was otherwise perfect was thrown away.</p>
<p><strong>Guard</strong> Required in the schema shown to the model (we still ask for it), optional in validation. A display-only field must not be able to veto an action.</p>
</div>

<div class="failure">
<h3>The chat template drops <code>required</code> and <code>enum</code></h3>
<p><strong>Symptom</strong> <code>delegate_to_provider</code> called with <code>{provider: "chatgpt"}</code> and nothing else. The model's own reasoning: "the signature is delegate_to_provider(provider, task?) — we must provide at least provider".</p>
<p><strong>Mechanism</strong> Reproduced against Ollama with a minimal schema: gpt-oss's Harmony renderer prints every field as <code>name: string</code>, required or not, and the enum vanishes. The only channel that survives is the per-field description text.</p>
<p><strong>Guard</strong> A registry test that fails if any truly required field lacks an "(OBLIGATOIRE)" marker in its description, or if any enum is not restated in words. Honest note: the marker is proven to reach the model, but the failure is intermittent and an A/B could not show the marker prevents it. Switching to a model whose template keeps the schema (gemma4) did.</p>
</div>

<div class="failure">
<h3>Example values in descriptions get sent literally</h3>
<p><strong>Symptom</strong> <code>execute_cleanup(plan_id: "p_3fa9c2d1")</code> — the example from the description, not the real plan id returned thirty seconds earlier. Then "[Plan p_20240523_1030]". Then "current_plan_id_from_previous_step".</p>
<p><strong>Mechanism</strong> Two things. A value in a description is a value the model will send. And tool results do not survive from one user turn to the next in this architecture, so at the "yes, go ahead" turn the id was simply not in the model's context — it could only invent one.</p>
<p><strong>Guard</strong> No example values in descriptions. And never require at turn N+1 a datum that only existed in a tool result at turn N: the id became optional, resolved by the app to the last plan of this conversation. Safety never rested on the id — it rests on the confirmation dialog, which shows the real file list.</p>
</div>

<div class="failure">
<h3>The memory tool is treated as a key-value store</h3>
<p><strong>Symptom</strong> Entries written to the memory file: <code>no_vouvoyer</code>, <code>kairos_port</code>, "Ne pas vouvoiement". The user had said "I don't want you to use vous with me".</p>
<p><strong>Mechanism</strong> The model first sends <code>{key: "vouvoyer", value: "no"}</code>, gets rejected, then flattens its own pair into the <code>entry</code> field. Rewriting the description to forbid key/value pairs changed nothing.</p>
<p><strong>Guard</strong> First a shape check (no spaces, snake_case, fewer than three words) that rejects once per turn with a concrete example of the expected form. Then the real fix: the text is no longer the model's to write. The app strips the trigger phrase from the user's own sentence and stores that verbatim. The model decides when and where; it no longer chooses the words.</p>
</div>

## 3. The model says it did something it did not do

<div class="failure">
<h3>Narrated action, no call</h3>
<p><strong>Symptom</strong> "I'm launching the call now to create the file!" — end of turn. File untouched.</p>
<p><strong>Mechanism</strong> A prompt rule against it existed and was extended twice. Reproduced a third time. A 20B model does not reliably obey a textual rule about its own output.</p>
<p><strong>Guard</strong> A regex on the model's <em>answer</em> (future-tense action verbs), combined with a structural signal: zero tools used this turn. If both, one retry with "call the tool now". Never insist beyond one. Crucially this never reads the user's request to guess intent — that approach was tried in August and abandoned.</p>
</div>

<div class="failure">
<h3>The tool call written as text</h3>
<p><strong>Symptom</strong> The final answer is literally <code>{"name":"open_site_search","arguments":{"site":"images","query":"cats"}}</code>. Nothing executed. Worse: the passive memory judge read that "answer" and recorded that the search had been executed.</p>
<p><strong>Mechanism</strong> Structured <code>tool_calls</code> empty, JSON emitted in the content channel instead — a known template parsing failure.</p>
<p><strong>Guard</strong> A narrow detector: the whole content parses as an object with at most two top-level keys, <code>name</code> plus <code>arguments</code>/<code>parameters</code>. Never a generic "looks like JSON" check — a legitimate answer may quote JSON. One retry.</p>
</div>

<div class="failure">
<h3>A fake success with a fake proof</h3>
<p><strong>Symptom</strong> "Done, I moved those 12 files to the trash. [Tools actually called to produce this answer: Cleanup plan execution]" — zero executions in the trace, 14 files still on disk.</p>
<p><strong>Mechanism</strong> The app appends a provenance note to assistant turns in the history, listing the tools really used. A marker placed in an assistant turn is a pattern the model learns to reproduce — here with a tool name that does not exist.</p>
<p><strong>Guard</strong> The marker is never written by the model, so its presence in the model's output is a structural signal of fabrication: trace it, retry once, strip it regardless. Next step, not done yet: move the note to the following user turn, which is less imitable.</p>
</div>

<div class="failure">
<h3>The delegated answer arrived, and the model said it had not</h3>
<p><strong>Symptom</strong> "Sorry, I hit a technical problem retrieving ChatGPT's answer" — 2,674 characters from ChatGPT sitting in the same turn.</p>
<p><strong>Mechanism</strong> My own guard. Round 1's call was refused by a form check with a message starting "[Error: ...]"; round 2 succeeded; the model anchored on the first message. The passive memory judge then persisted a false "ChatGPT retrieval failed" anomaly. The guards had manufactured the exact class of problem they exist to prevent.</p>
<p><strong>Guard</strong> Refusal messages that do not announce themselves as errors ("[TO FIX — the provider has NOT been called yet, nothing failed on its side]"), a failure detector that recognises that prefix, and a memory judge that no longer counts an attempt that was later corrected as a failure.</p>
</div>

## 4. The model repeats itself

<div class="failure">
<h3>The same confirmed call, five times, after two refusals</h3>
<p><strong>Symptom</strong> <code>open_path</code> requested, approved, executed. Requested again, identical, approved again, executed again. Refused. Requested again. Refused again. Requested again. The user killed the app.</p>
<p><strong>Mechanism</strong> The refusal message said "do not come back to this". Ignored twice in a row.</p>
<p><strong>Guard</strong> Per-loop memory of every confirmed call's signature (name + sorted arguments). An identical call after a refusal returns the same refusal without a dialog; after a success, the same result without re-executing. Scoped to non-automatic tools — repeating a read costs nothing.</p>
</div>

<div class="failure">
<h3>Duplicate side effects on "automatic" tools</h3>
<p><strong>Symptom</strong> "Play" reports success and nothing changes. Memory entries written twice, seconds apart.</p>
<p><strong>Mechanism</strong> The signature guard above only covered tools that need confirmation. <code>play_pause</code> is a real toggle: two executions cancel out. <code>write_memory</code> persists, twice.</p>
<p><strong>Guard</strong> An explicit opt-in list of automatic tools that still get deduplicated because they persist or toggle something. Not all automatic tools — repeating a search is harmless.</p>
</div>

<div class="failure">
<h3>Seven paid cloud calls for one question, five byte-identical</h3>
<p><strong>Symptom</strong> "Give me feedback on the script I just shared" sent to ChatGPT, which sees no script and says so. Sent again, identical. Seven times. More spent in one turn than in the project's whole history with that provider.</p>
<p><strong>Mechanism</strong> The delegation tool only forwarded the <code>task</code> string; the provider never saw the conversation. The description asked the model to "rephrase so it is understandable without the conversation". Measured across two models, ten runs each: the model copies the 1–3k characters of content into the task 1 time out of 10, and 0 out of 10. Four successive guards trying to force it all failed.</p>
<p><strong>Guard</strong> The app attaches the context: the last exchanges of the thread (capped at 6,000 characters) and the user's current request travel with every delegation. The model only says what to do. Plus signature dedup on the delegation tool. Rule learned: if the model will not do something 9 times out of 10, stop writing guards and have the app do it.</p>
</div>

## 5. The fallback costs money and cannot act

<div class="failure">
<h3>70% of fallback API calls traced to argument bugs</h3>
<p><strong>Symptom</strong> The cloud budget drains. The user believed there was a "complex task → Claude" rule. There is not: since the tool loop replaced JSON classification, the only triggers for the cloud fallback are an empty final answer or a timeout.</p>
<p><strong>Mechanism</strong> 17 automatic escalations in the trace, 12 immediately preceded by a rejected tool call for a misnamed argument. And the fallback has no tools — it cannot perform the action the local model failed to perform. It can only explain, expensively, that it cannot.</p>
<p><strong>Guard</strong> No escalation when zero tools succeeded and at least one call was rejected this turn; a fixed honest sentence instead, never model-generated. Escalation kept for the case it is actually good at: a purely textual task the local model could not answer.</p>
</div>

<div class="failure">
<h3>The paid answer was thrown away, then paid for again</h3>
<p><strong>Symptom</strong> A delegation succeeds (290 characters from ChatGPT), the local model's final round comes back empty, the app escalates to Claude — paying twice and showing the user neither of the two answers it had.</p>
<p><strong>Mechanism</strong> 6 paid delegations discarded in the trace history, 12,836 characters. The final round after several tool results is where a small model in no-thinking mode most often returns nothing.</p>
<p><strong>Guard</strong> A third path before escalation, for "empty final with tools used": one local retry with <em>no tools exposed</em> (mechanically impossible to call one, and the prompt loses twenty definitions) with the tool results re-injected; if that fails too, show the paid result verbatim. Escalation only when no tool produced anything.</p>
</div>

## 6. The tool misinforms the model about itself

<div class="failure">
<h3>The search excluded the current thread and never said so</h3>
<p><strong>Symptom</strong> Kora writes a text about autumn, then, asked to check past conversations, declares "I have never been asked to write about autumn."</p>
<p><strong>Mechanism</strong> By design, the past-conversation search excludes the current thread (it is already in context). The empty-result message said "no past thread mentions X" — without mentioning the exclusion. No model can guess a scope you hide from it.</p>
<p><strong>Guard</strong> The empty result states its own scope: "this search does NOT cover the current conversation — if the topic is in the messages above, reread them". This is a different family from every entry above: not a model error, an interface error.</p>
</div>

<div class="failure">
<h3>The memory judge wrote diagnoses it had never seen</h3>
<p><strong>Symptom</strong> Five "technical anomaly" memory entries, four factually false: "ChatGPT call timed out" (it was an argument rejection; DeepSeek was never called), "cannot retry ChatGPT" (it had succeeded 21 seconds earlier).</p>
<p><strong>Mechanism</strong> The after-the-fact memory judge received the user message and the final answer — nothing about which tools ran or failed. It converted the model's "I couldn't" prose into an invented mechanical cause. And the memory file is re-injected into every subsequent prompt, so a false "ChatGPT is broken" fed the next failure.</p>
<p><strong>Guard</strong> The judge receives the turn's tool record (executed, outcome, rejected, reason) as the only source of technical truth, with the sentence that was missing: "your own answer above is not one". Mechanically, an anomaly entry is refused when no tool actually failed this turn.</p>
</div>

## 7. Things that were mine

<div class="failure">
<h3>Three regex traps in one hour, two of them the same trap mirrored</h3>
<p><strong>Symptom</strong> "Look in ~/Kora and write me an inventory" routed to "pure conversation", tools withdrawn; the model honestly answers it has no file access. Then "/Kora" without tilde fails after "~/Kora" is fixed.</p>
<p><strong>Mechanism</strong> JavaScript <code>\b</code> relies on <code>\w</code>, where accented letters do not count: no word boundary before the "é" of "écris-moi", so the keyword never matched. Then the end anchor I replaced it with failed in the opposite direction on "/Kora". Then the typographic apostrophe (U+2019) from the spell-checker matched nothing.</p>
<p><strong>Guard</strong> Unicode lookarounds, apostrophe normalisation upstream of every pattern — and the thing that actually held: a structural rule that an explicit path or filename in the message forbids concluding "pure conversation" and implies read tools, whatever the keywords say. Keyword lists never converge; structural guards do.</p>
</div>

## What generalises

- **Read the trace before touching anything.** Every entry here was diagnosed from a JSONL
  trace of requests, calls, rejections and results. Several were misdiagnosed for days
  because a symptom pattern-matched a known cause.
- **Measure a rate, not a run.** A process that succeeds one time in four will confirm any
  fix you try once. Ten runs per case, before and after, is the minimum that told the
  difference between a correction and a coincidence.
- **A prompt rule that contradicts a habit does not hold** on 9B–20B models. Detect the
  failure in the model's own output, structurally, and retry once. Never insist.
- **When the model will not do it 9 times out of 10, the app does it.** Attaching context,
  choosing the memory sentence, resolving the plan id, building the URL.
- **Fail-closed on unknowns, fail-open on routing.** An unlisted tool defaults to the
  strictest tier; a keyword router that misses defaults to all tools, never to a refusal.
- **Every tool result that can be misread must state its own scope.**

This page grows as the trace does. If one of these entries is yours too, I would like to
hear how it broke on your side: [contact](/contact.html).
