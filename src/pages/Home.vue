
<script setup lang="ts">
import { BilibiliIcon, GithubIcon } from 'vue3-simple-icons';

</script>
<template>
    <div class="m-auto prose mb-8 mt-20"><h1 class="mb-0 ">Jackson Chen</h1></div>
    <article class>
        <div class="prose m-auto">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <hr/>
            <p>Find me on</p>   
            <p class="flex mt--2">
                <a href="" class="link-flex" target="_blank"><GithubIcon/>Github</a>
                <a href="" class="link-flex" target="_blank"><BilibiliIcon/>Github</a>
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