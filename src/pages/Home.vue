
<script setup lang="ts">
import { ref } from 'vue';
import { BilibiliIcon, GithubIcon, InstagramIcon, TwitterIcon } from 'vue3-simple-icons';
import data from '../ArticleParser';

let author = ref("");
author.value = data.author;
let paragraphs = data.article;
console.log(data)
</script>
<template>
    <div class="m-auto prose mb-8 mt-20"><h1 class="mb-0 ">{{author}}</h1></div>
    <article class>
        <div class="prose m-auto">
            <p v-for="paragraph in paragraphs">{{paragraph}}</p>
            <hr/>
            <p>Find me on</p>   
            <p class="flex mt--2">
                <a href="https://github.com/Sma1lboy" class="link-flex" target="_blank"><GithubIcon/>Github</a>
                <a href="https://space.bilibili.com/72605744" class="link-flex" target="_blank"><BilibiliIcon/>Github</a>
                <a href="https://www.instagram.com/sma1lboy/" class="link-flex" target="_blank"><InstagramIcon/>Github</a>
                <a href="https://twitter.com/Sma1lboy" class="link-flex" target="_blank"><TwitterIcon/>Github</a>

            </p>         
        </div>

    </article>
</template>

<style>
.link-flex {
    display: flex;
    gap:0.4rem;
    flex-wrap: wrap;
}
.mt--2 {
    margin: top -0.5rem, important !important;
}
.flex {
    display: flex;
    gap:0.75rem;
    flex-wrap: wrap;

}
.prose {
    max-width: 65ch;
    font-size: 1rem;
    line-height: 1.75;
}

.prose h1 {
    color: var(--fg-deeper);
    font-weight: 800;
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
}
.prose p {
    margin: 1em auto;
}
.prose hr {
    width:15%;
    margin: 2em auto;
}
</style>